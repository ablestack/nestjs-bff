export class ValidationError extends Error {
  public messages: string[];

  constructor(messages: string[], public metaData?: object) {
    super(messages && messages.length > 0 ? messages[0] : 'Validation Error');

    this.messages = messages;
  }
}
