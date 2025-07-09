import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorResponse } from '../error/error.response';

export class BizException extends HttpException {
  constructor(error: ErrorResponse) {
    super(error, HttpStatus.BAD_REQUEST);
  }
}
