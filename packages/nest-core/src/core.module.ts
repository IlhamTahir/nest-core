import { Global, Module, OnModuleInit, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokenController } from './controller/token.controller';
import { UserService } from './service/user.service';
import { User } from './entity/user.entity';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from './service/auth.service';
import { JWT_EXPIRATION, JWT_SECRET } from './constants/jwt';
import { RoleController } from './controller/role.controller';
import { RoleService } from './service/role.service';
import { Role } from './entity/role.entity';
import { Permission } from './entity/permission.entity';
import { UserController } from './controller/user.controller';
import { UserBindService } from './service/user-bind.service';
import { UserBind } from './entity/user-bind.entity';
import { FileController } from './controller/file.controller';
import { FileService } from './service/file.service';
import { RequestContextModule } from 'nestjs-request-context';
import { File } from './entity/file.entity';
import { UploadManager } from './service/upload-manager';
import { AwsS3Strategy } from './service/strategy/aws-s3.strategy';
import { FileMapper } from './mapper/file.mapper';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import * as process from 'node:process';
import { MenuService } from './service/menu.service';
import { MenuMapper } from './mapper/menu.mapper';
import { Menu } from './entity/menu.entity';
import { MenuController } from './controller/menu.controller';
import { SnowflakeUtil } from './util/snowflake.util';
import { SwaggerService } from './service/swagger.service';
import { CoreModuleConfig, mergeCoreConfig } from './config/core.config';
import { mergeSwaggerConfig } from './config/swagger.config';

// 临时导入 CourseModule 实体以解决 TypeORM 扫描问题
let CourseModuleEntities: any[] = [];
try {
  console.log('Attempting to load CourseModule entities from:', process.cwd());

  // 尝试多个可能的路径
  const possiblePaths = [
    process.cwd() + '/dist/course/entity',
    process.cwd() + '/src/course/entity',
    '/private/var/workspace/yili-bili/backend/dist/course/entity',
    '/private/var/workspace/yili-bili/backend/src/course/entity'
  ];

  let loadedEntities = [];
  for (const basePath of possiblePaths) {
    try {
      const { Media } = require(basePath + '/media.entity');
      const { CourseEntity } = require(basePath + '/course.entity');
      const { LessonEntity } = require(basePath + '/lesson.entity');
      const { ActivityEntity } = require(basePath + '/activity.entity');
      const { VideoActivityEntity } = require(basePath + '/video-activity.entity');
      const { TextActivityEntity } = require(basePath + '/text-activity.entity');
      const { DocActivityEntity } = require(basePath + '/doc-activity.entity');

      loadedEntities = [
        Media,
        CourseEntity,
        LessonEntity,
        ActivityEntity,
        VideoActivityEntity,
        TextActivityEntity,
        DocActivityEntity,
      ];
      console.log('Successfully loaded CourseModule entities from:', basePath);
      break;
    } catch (pathError) {
      console.log('Failed to load from path:', basePath, pathError.message);
    }
  }

  CourseModuleEntities = loadedEntities;
  console.log('Final CourseModule entities:', CourseModuleEntities.map(e => e.name));
} catch (error) {
  console.log('CourseModule entities not found, skipping...', error.message);
}


// 配置常量
const CORE_MODULE_CONFIG = 'CORE_MODULE_CONFIG';

@Module({})
@Global()
export class CoreModule implements OnModuleInit {
  constructor(
    private readonly userService: UserService,
    private readonly menuService: MenuService,
    private uploadManager: UploadManager,
    private readonly swaggerService: SwaggerService,
  ) {}

  /**
   * 创建根模块（推荐使用）
   */
  static forRoot(config?: CoreModuleConfig): DynamicModule {
    const mergedConfig = mergeCoreConfig(config);

    return {
      module: CoreModule,
      controllers: [
        TokenController,
        RoleController,
        UserController,
        FileController,
        MenuController,
      ],
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: [
            '.env', // 通用配置，最低优先级
            `.env.${process.env.NODE_ENV}`, // 环境配置，如 .env.development
            `.env.${process.env.NODE_ENV}.local`, // 本地配置，最高优先级
          ],
        }),
        TypeOrmModule.forRootAsync({
          useFactory: async (configService: ConfigService) => ({
            type: 'mysql',
            host: mergedConfig.database?.host || configService.get<string>('DB_HOST'),
            port: mergedConfig.database?.port || configService.get<number>('DB_PORT'),
            username: mergedConfig.database?.username || configService.get<string>('DB_USERNAME'),
            password: mergedConfig.database?.password || configService.get<string>('DB_PASSWORD'),
            database: mergedConfig.database?.database || configService.get<string>('DB_NAME'),
            autoLoadEntities: true,
            entities: [
              __dirname + '/**/*.entity{.ts,.js}',
              process.cwd() + '/src/**/*.entity{.ts,.js}',
              process.cwd() + '/dist/**/*.entity{.js}',
            ],
            subscribers: [__dirname + '/**/*.subscriber{.ts,.js}'],
            synchronize: mergedConfig.database?.synchronize ?? true,
            logging: mergedConfig.database?.logging ?? true,
          }),
          inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([User, Role, Permission, UserBind, File, Menu, ...CourseModuleEntities]),
        JwtModule.register({
          global: true,
          secret: mergedConfig.jwt?.secret || JWT_SECRET,
          signOptions: {
            expiresIn: mergedConfig.jwt?.expiresIn || JWT_EXPIRATION,
          },
        }),
        RequestContextModule,
        ServeStaticModule.forRoot({
          rootPath:
            process.env.NODE_ENV === 'production'
              ? join(process.cwd(), mergedConfig.upload?.uploadDir || 'uploads')
              : join(__dirname, '../../', mergedConfig.upload?.uploadDir || 'uploads'),
          serveRoot: `/${mergedConfig.upload?.uploadDir || 'uploads'}`,
          serveStaticOptions: {
            fallthrough: false,
          },
        }),
      ],
      providers: [
        {
          provide: APP_GUARD,
          useClass: AuthGuard,
        },
        {
          provide: CORE_MODULE_CONFIG,
          useValue: mergedConfig,
        },
        UserService,
        JwtService,
        AuthService,
        RoleService,
        UserBindService,
        FileService,
        FileMapper,
        UploadManager,
        MenuService,
        MenuMapper,
        SwaggerService,
      ],
      exports: [UserService, UserBindService, AuthService, SwaggerService],
    };
  }

  /**
   * 兼容性方法：不带配置的导入方式
   */
  static forRootAsync(): DynamicModule {
    return CoreModule.forRoot();
  }
  async onModuleInit() {
    // 获取配置
    const config = mergeCoreConfig();

    // 初始化 SnowflakeUtil
    SnowflakeUtil.initialize(
      config.snowflake?.workerId || 1,
      config.snowflake?.datacenterId || 1
    );

    await this.userService.createInitialUser();
    await this.menuService.initializeMenus();
    console.log('Loaded JWT_SECRET:', JWT_SECRET);

    this.uploadManager.registerStrategy('s3', new AwsS3Strategy());
  }

  /**
   * 设置 Swagger（需要在应用启动后调用）
   */
  static setupSwagger(app: any, config?: CoreModuleConfig): void {
    const mergedConfig = mergeCoreConfig(config);
    const swaggerConfig = mergeSwaggerConfig(mergedConfig.swagger);

    if (swaggerConfig.enabled) {
      const swaggerService = app.get(SwaggerService);
      swaggerService.setupSwagger(app, swaggerConfig);
    }
  }
}
