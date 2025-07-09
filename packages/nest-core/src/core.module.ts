import { Global, Module, OnModuleInit } from '@nestjs/common';
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


@Module({
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
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        subscribers: [__dirname + '/**/*.subscriber{.ts,.js}'],
        synchronize: true,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Role, Permission, UserBind, File, Menu]),
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
      signOptions: {
        expiresIn: JWT_EXPIRATION,
      },
    }),
    RequestContextModule,
    ServeStaticModule.forRoot({
      rootPath:
        process.env.NODE_ENV === 'production'
          ? join(process.cwd(), process.env.UPLOAD_DIR || 'uploads')
          : join(__dirname, '../../', process.env.UPLOAD_DIR || 'uploads'),
      serveRoot: `/${process.env.UPLOAD_DIR || 'uploads'}`,
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
  ],
  exports: [UserService, UserBindService, AuthService],
})
@Global()
export class CoreModule implements OnModuleInit {
  constructor(
    private readonly userService: UserService,
    private readonly menuService: MenuService,
    private uploadManager: UploadManager,
  ) {}
  async onModuleInit() {
    // 初始化 SnowflakeUtil
    const workerId = parseInt(process.env.SNOWFLAKE_WORKER_ID || '1');
    const datacenterId = parseInt(process.env.SNOWFLAKE_DATACENTER_ID || '1');
    SnowflakeUtil.initialize(workerId, datacenterId);

    await this.userService.createInitialUser();
    await this.menuService.initializeMenus();
    console.log('Loaded JWT_SECRET:', JWT_SECRET);

    this.uploadManager.registerStrategy('s3', new AwsS3Strategy());
  }
}
