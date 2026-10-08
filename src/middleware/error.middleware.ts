import type { NextFunction, Request, Response } from 'express';
import { AppError } from "../errors/app-error";
import { ValidationError } from '../errors/validation-error';

type BodyParserError = Error & {
    status?: number;
    statusCode?: number;
    type?: string;
}

export const errorHandler = (
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction,
) => {

    if (res.headersSent) {
        return next(err);
    }

    const bodyParserError = err as BodyParserError;

    if (
        bodyParserError instanceof SyntaxError &&
        bodyParserError.status === 400 &&
        bodyParserError.type === "entity.parse.failed"
    ) {
        return res.status(400).json({
            success: false,
            error: {
                message: "Malformed JSON body",
            }
        })
    }

    if (err instanceof ValidationError) {
        return res.status(err.statusCode).json({
            success: false,
            error: {
                message: err.message,
                details: err.details,
            }
        })
    }

    if (err instanceof AppError) {
        if (!err.isOperational) {
            console.error(err);

            return res.status(500).json({
                success: false,
                error: {
                    message: "Internal server error",
                }
            });
        }

        return res.status(err.statusCode).json({
            success: false,
            error: {
                message: err.message
            }
        })
    }

    console.error(err);

    return res.status(500).json({
        success: false,
        error: {
            message: "Internal server error"
        }
    })
}