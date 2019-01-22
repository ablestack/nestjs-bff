import { HttpException, HttpStatus } from '@nestjs/common';

export class AuthorizationError extends HttpException {
  constructor(message: string, public metaData?: object) {
    super(message, HttpStatus.UNAUTHORIZED);
    Error.captureStackTrace(this, AuthorizationError);
  }
}
