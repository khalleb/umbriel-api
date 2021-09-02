import httpStatus from 'http-status';

class AppError extends Error {
  public readonly message: string;

  public readonly statusCode: number;

  constructor(message: string, statusCode = httpStatus.BAD_REQUEST, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;
