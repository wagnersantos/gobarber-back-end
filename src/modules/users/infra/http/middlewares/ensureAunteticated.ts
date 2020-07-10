import { Request, Response, NextFunction } from 'express';

import { verify } from 'jsonwebtoken';
import authConfig from 'config/auth';
import AppError from 'shared/errors/AppError';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}
export default (
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('Token is missing!');
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.secret);
    const { sub } = decoded as ITokenPayload;

    request.user = {
      id: sub,
    };

    return next();
  } catch {
    throw new AppError('Invalid token!');
  }
};
