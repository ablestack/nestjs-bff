import { HttpException, HttpStatus } from '@nestjs/common';

class ServerHttpError extends HttpException {
  constructor(response: string | object, status: number, public metaData?: object) {
    super(response, status);
    Error.captureStackTrace(this, ServerHttpError);
  }
}

export class BadGatewayHttpError extends ServerHttpError {
  constructor(response: string | object, public metaData?: object) {
    super(response, HttpStatus.BAD_GATEWAY);
  }
}

export class BadRequestHttpError extends ServerHttpError {
  constructor(response: string | object, public metaData?: object) {
    super(response, HttpStatus.BAD_REQUEST);
  }
}
