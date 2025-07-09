import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ErrorResponse } from '../error/error.response';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const { status, errorResponse } = this.formatException(exception);

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
        : (exceptionResponse as ErrorResponse).message ||
          'An unexpected error occurred.';

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
}
