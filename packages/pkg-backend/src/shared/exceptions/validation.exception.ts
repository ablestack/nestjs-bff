import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationError extends HttpException {
  public messages: string[];

  constructor(messages: string[], public metaData?: object) {
    super(
      messages && messages.length > 0 ? messages[0] : 'Validation Error',
      HttpStatus.BAD_REQUEST,
    );

    this.messages = messages;
  }
}
