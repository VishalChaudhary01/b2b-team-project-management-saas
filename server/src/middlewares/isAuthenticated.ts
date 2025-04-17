import { Request, Response, NextFunction } from 'express';
import { UnauthorizedException } from '@utils/appError';

export const isAuthenticated = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (!req.isAuthenticated?.() || !req.user?._id) {
    throw new UnauthorizedException('Unauthorized. Please log in.');
  }
  next();
};
