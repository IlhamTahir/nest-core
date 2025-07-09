import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ErrorResponse } from '../error/error.response';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name); // 使用 Logger

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const { status, errorResponse } = this.formatException(exception);
    this.logError(exception);

    response.status(status).json(errorResponse);
  }

  private formatException(exception: any): {
    status: number;
    errorResponse: ErrorResponse | ErrorResponse[];
  } {
    if (Array.isArray(exception)) {
      // 如果是 ValidationPipe 抛出的 ErrorResponse[]
      return { status: HttpStatus.BAD_REQUEST, errorResponse: exception };
    }

    if (exception instanceof HttpException) {
      return this.handleHttpException(exception);
    }

    return this.handleUnknownException(exception);
  }

  private handleHttpException(exception: HttpException): {
    status: number;
    errorResponse: ErrorResponse;
  } {
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as any).message || 'An unexpected error occurred.';

    return {
      status,
      errorResponse: { code: status, message },
    };
  }

  private handleUnknownException(exception: any): {
    status: number;
    errorResponse: ErrorResponse;
  } {
    const status = HttpStatus.INTERNAL_SERVER_ERROR;

    return {
      status,
      errorResponse: {
        code: status,
        message:
          exception.message || 'An unexpected internal server error occurred.',
      },
    };
  }

  private logError(exception: any): void {
    // 记录错误信息
    this.logger.error(`Error: ${exception.message}`);

    // 仅在开发或测试环境中打印堆栈跟踪
    this.logger.error(`Stack Trace: ${exception.stack}`);
  }
}
