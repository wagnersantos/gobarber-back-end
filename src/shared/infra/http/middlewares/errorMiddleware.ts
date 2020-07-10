import { Request, Response, NextFunction } from 'express';
import AppError from 'shared/errors/AppError';

const errorMiddleware = (
  err: Error,
  request: Request,
  response: Response,
  _next: NextFunction,
): Response => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.log(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
};

export default errorMiddleware;
