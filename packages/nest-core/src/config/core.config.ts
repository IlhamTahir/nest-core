import { SwaggerConfig } from './swagger.config';

/**
 * CoreModule 配置接口
 */
export interface CoreModuleConfig {
  /** Swagger 配置 */
  swagger?: Partial<SwaggerConfig>;
  
  /** 数据库配置（可选，如果不提供则使用环境变量） */
  database?: {
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    database?: string;
    synchronize?: boolean;
    logging?: boolean;
  };
  
  /** JWT 配置（可选，如果不提供则使用环境变量） */
  jwt?: {
    secret?: string;
    expiresIn?: string;
  };
  
  /** 文件上传配置 */
  upload?: {
    uploadDir?: string;
    maxFileSize?: number;
    allowedMimeTypes?: string[];
  };
  
  /** Snowflake ID 配置 */
  snowflake?: {
    workerId?: number;
    datacenterId?: number;
  };
}

/**
 * 默认 CoreModule 配置
 */
export const DEFAULT_CORE_CONFIG: CoreModuleConfig = {
  swagger: {
    enabled: process.env.NODE_ENV === 'development' || process.env.SWAGGER_ENABLED === 'true',
  },
  database: {
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
  },
  upload: {
    uploadDir: process.env.UPLOAD_DIR || 'uploads',
    maxFileSize: 10 * 1024 * 1024, // 10MB
  },
  snowflake: {
    workerId: parseInt(process.env.SNOWFLAKE_WORKER_ID || '1'),
    datacenterId: parseInt(process.env.SNOWFLAKE_DATACENTER_ID || '1'),
  },
};

/**
 * 合并配置
 */
export function mergeCoreConfig(userConfig?: CoreModuleConfig): CoreModuleConfig {
  if (!userConfig) {
    return DEFAULT_CORE_CONFIG;
  }
  
  return {
    ...DEFAULT_CORE_CONFIG,
    ...userConfig,
    swagger: {
      ...DEFAULT_CORE_CONFIG.swagger,
      ...userConfig.swagger,
    },
    database: {
      ...DEFAULT_CORE_CONFIG.database,
      ...userConfig.database,
    },
    upload: {
      ...DEFAULT_CORE_CONFIG.upload,
      ...userConfig.upload,
    },
    snowflake: {
      ...DEFAULT_CORE_CONFIG.snowflake,
      ...userConfig.snowflake,
    },
  };
}
