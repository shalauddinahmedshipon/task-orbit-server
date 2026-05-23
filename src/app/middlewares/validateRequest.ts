import { AnyZodObject } from 'zod';
import catchAsync from '../utils/catchAsync';
import { NextFunction, Request, Response } from 'express';

// const validateRequest = (schema: AnyZodObject) => {
//   return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     await schema.parseAsync({
//       body: req.body,
//       cookies: req.cookies,
//     });
//     return next();
//   });
// };

const validateRequest = (schema: AnyZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const validatedData = await schema.parseAsync({
      body: req.body,
      cookies: req.cookies,
    });

    req.body = validatedData.body;

    next();
  });
};
export default validateRequest;
