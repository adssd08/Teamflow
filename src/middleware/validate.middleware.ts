import { type NextFunction, type Request, type Response } from 'express';

import { type ZodSchema } from 'zod';
import { ValidationError } from '../errors/validation-error';

export const validate =
    (schema: ZodSchema) =>
        (req: Request, res: Response, next: NextFunction) => {

            const result = schema.safeParse(req.body);

            if (!result.success) {
                const flattened = result.error.flatten();
                return next(
                    new ValidationError(
                        "Validation failed",
                        {
                            fieldErrors: flattened.fieldErrors,
                            formErrors: flattened.formErrors
                        }
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
                const flattened = result.error.flatten();
                return next(
                    new ValidationError(
                        "Validation failed",
                        {
                            fieldErrors: flattened.fieldErrors,
                            formErrors: flattened.formErrors
                        }
                    )
                )
            }

            req.params = result.data as any;

            next();
        }

export const validateQuery =
    (schema: ZodSchema) => (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const result = schema.safeParse(req.query);

        if (!result.success) {
            const flattened = result.error.flatten();

            return next(
                new ValidationError(
                    "Validation failed",
                    {
                        fieldErrors: flattened.fieldErrors,
                        formErrors: flattened.formErrors
                    }
                )
            )
        }

        // Express 5 exposes req.query as a getter; keep parsed values separately.
        res.locals.validatedQuery = result.data;
        next();
    }
