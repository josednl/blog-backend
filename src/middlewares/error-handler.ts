import { Request, Response, NextFunction } from 'express';
import { ValidationError, validationResult } from 'express-validator';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const mappedErrors: { [key: string]: string } = {};

    errors.array().forEach((err: ValidationError) => {

      const fieldName = (err as any).path;

      if (fieldName) {
        if (!mappedErrors[fieldName]) {
          mappedErrors[fieldName] = err.msg;
        }
      }
    });

    return res.status(400).json({
      message: 'Validation failed.',
      errors: Object.entries(mappedErrors).map(([field, message]) => ({ field, message })),
    });
  }

  next();
};

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors = {};

  if (err.name === 'AppError' || err.statusCode) {
    statusCode = err.statusCode || 500;
    message = err.message;


    if (statusCode === 400) {
      if (message.includes('Username already taken')) {
        errors = { username: message };
        message = 'Data validation failed.';
      } else if (message.includes('Email already in use')) {
        errors = { email: message };
        message = 'Data validation failed.';
      }
    }
  }

  if (err.code === 'P2002') {
    statusCode = 400;
    message = 'A resource with this value already exists.';

    if (err.meta && err.meta.target && Array.isArray(err.meta.target)) {
      const field = err.meta.target[0];
      message = `The ${field} is already in use.`;
      errors = { [field]: message };
    }
  }

  if (err.message.includes('Origin not allowed by CORS')) {
    statusCode = 403;
    message = 'Origin not allowed by CORS';
  }

  res.status(statusCode).json({
    message,
    errors: Array.isArray(errors) 
    ? errors 
    : Object.entries(errors).map(([field, message]) => ({ field, message })),
    // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
