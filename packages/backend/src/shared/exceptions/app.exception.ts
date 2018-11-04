export class AppError extends Error {
  constructor(message: string, public metaData?: object) {
    super(message);
    Error.captureStackTrace(this, AppError);
  }
}
