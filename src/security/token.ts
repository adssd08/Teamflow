import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';

export type TokenPayload = {
    sub: string;
}

export const signAccessToken = (
    userId: string,
): string => {
    return signToken(userId, env.jwtAccessSecret, env.jwtAccessExpiresIn)
}

export const signRefreshToken = (
    userId: string,
): string => {
    return signToken(userId, env.jwtRefreshSecret, env.jwtRefreshExpiresIn)
}

export const verifyAccessToken = (
    token: string,
): TokenPayload => {
    return verifyToken(token, env.jwtAccessSecret)
}

export const verifyRefreshToken = (
    token: string
): TokenPayload => {
    return verifyToken(token, env.jwtRefreshSecret)
}

export const signToken = (
    userId: string,
    secret: string,
    expiresIn: NonNullable<SignOptions['expiresIn']>,
): string => {
    return jwt.sign({
        sub: userId,
    },
        secret,
        {
            algorithm: "HS256",
            expiresIn
        }
    )
}

export const verifyToken = (token: string, secret: string): TokenPayload => {
    const payload = jwt.verify(
        token,
        secret,
        {
            algorithms: ["HS256"],
        }
    )

    if (
        typeof payload === "string" ||
        typeof payload.sub !== "string"
    ) {
        throw new Error("Invalid refresh token payload")
    }

    return {
        sub: payload.sub
    }
}
