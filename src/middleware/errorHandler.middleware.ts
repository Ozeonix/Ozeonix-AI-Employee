import { Request, Response, NextFunction } from 'express';
import { AppError } from '../shared/errors/AppError.js';
import { sendError } from '../shared/utils/response.js';
import { logger } from '../config/logger.js';
import { ZodError } from 'zod';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(`Error processing request ${req.method} ${req.url}: ${err.message}`, {
    stack: err.stack,
  });

  if (err instanceof AppError) {
    return sendError(res, err.statusCode, err.message, err.errors);
  }

  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return sendError(res, 400, 'Validation Failed', formattedErrors);
  }

  return sendError(res, 500, 'Internal Server Error');
};
