import { HttpException, HttpStatus } from '@nestjs/common';

export class UnauthorizedError extends HttpException {
  constructor(message: string, public metaData?: object) {
    super(message, HttpStatus.UNAUTHORIZED);
    Error.captureStackTrace(this, UnauthorizedError);
  }
}
