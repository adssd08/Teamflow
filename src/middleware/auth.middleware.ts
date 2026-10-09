import type { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../errors/unauthorized-error";
import { verifyAccessToken } from "../security/token";


export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authorization = req.headers.authorization;

    if (!authorization) {
        return next(
            new UnauthorizedError(
                "Authentication required"
            )
        )
    }

    const parts = authorization.trim().split(/\s+/);

    if (parts.length !== 2) {
        return next(
            new UnauthorizedError(
                "Invalid authorization header",
            ),
        );
    }

    const [schema, token] = parts;

    if (schema!.toLowerCase() !== "bearer" || !token) {
        return next(
            new UnauthorizedError(
                "Invalid authorization header",
            )
        )
    }

    try {
        const payload = verifyAccessToken(token);

        req.user = {
            id: payload.sub
        }

        next();
    } catch {
        next(
            new UnauthorizedError(
                "Invalid or expired access token"
            )
        )
    }
}