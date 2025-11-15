import { Injectable, Logger } from '@nestjs/common';
import { INestApplication } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { SwaggerConfig, createSwaggerDocumentBuilder } from '../config/swagger.config';

/**
 * Swagger 服务
 * 负责初始化和配置 Swagger UI
 */
@Injectable()
export class SwaggerService {
  private readonly logger = new Logger(SwaggerService.name);

  /**
   * 设置 Swagger
   * @param app NestJS 应用实例
   * @param config Swagger 配置
   */
  setupSwagger(app: INestApplication, config: SwaggerConfig): void {
    if (!config.enabled) {
      this.logger.log('Swagger is disabled');
      return;
    }

    try {
      // 创建 Swagger 文档配置
      const documentBuilder = createSwaggerDocumentBuilder(config);
      const documentConfig = documentBuilder.build();

      // 创建 Swagger 文档
      const document = SwaggerModule.createDocument(app, documentConfig, config.documentOptions);

      // 设置 Swagger UI
      SwaggerModule.setup(config.path!, app, document, {
        swaggerOptions: config.swaggerOptions,
      });

      const baseUrl = this.getBaseUrl();
      this.logger.log(`📖 Swagger UI is available at: ${baseUrl}/${config.path}`);
    } catch (error) {
      this.logger.error('Failed to setup Swagger UI', error);
    }
  }

  /**
   * 获取基础 URL
   */
  private getBaseUrl(): string {
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = process.env.HOST || 'localhost';
    const port = process.env.PORT || 3000;
    
    return `${protocol}://${host}:${port}`;
  }
}
