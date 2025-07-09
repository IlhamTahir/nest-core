import { HttpStatus, ValidationError, ValidationPipe } from '@nestjs/common';
import { ErrorResponse } from '../error/error.response';

export class GlobalValidationPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true, // 移除未定义的字段
      forbidNonWhitelisted: true, // 禁止多余字段
      transform: true, // 自动类型转换
      exceptionFactory: (errors: ValidationError[]): ErrorResponse[] => {
        // 将验证错误格式化为统一的 ErrorResponse[]
        return errors.flatMap((error) =>
          Object.values(error.constraints || {}).map((message) => ({
            code: HttpStatus.BAD_REQUEST,
            message: message,
          })),
        );
      },
    });
  }
}
