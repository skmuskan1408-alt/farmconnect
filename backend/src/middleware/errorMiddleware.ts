import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Server Error:', err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({
    status: 'error',
    statusCode: status,
    message: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
