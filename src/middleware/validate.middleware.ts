import { type NextFunction, type Request, type Response } from 'express';

import { type ZodSchema } from 'zod';
import { ValidationError } from '../errors/validation-error.js';

export const validate =
    (schema: ZodSchema) =>
        (req: Request, res: Response, next: NextFunction) => {

            const result = schema.safeParse(req.body);

            if (!result.success) {
                return next(
                    new ValidationError(
                        "Validation failed",
                        result.error.flatten().fieldErrors,
                    )
                )
            }

            req.body = result.data;

            next();
        }

export const validateParams =
    (schema: ZodSchema) =>
        (req: Request, res: Response, next: NextFunction) => {
            const result = schema.safeParse(req.params);

            if (!result.success) {
                return next(
                    new ValidationError(
                        "Validation failed",
                        result.error.flatten().fieldErrors,
                    )
                )
            }

            req.params = result.data as any;

            next();
        } 