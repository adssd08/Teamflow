import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export type AccessTokenPayload = {
    sub: string;
}

export const signAccessToken = (
    userId: string,
): string => {
    return jwt.sign({
        sub: userId,
    },
        env.jwtAccessSecret,
        {
            algorithm: "HS256",
            expiresIn: env.jwtAccessExpiresIn,
        }
    )
}

export const verifyAccessToken = (
    token: string,
): AccessTokenPayload => {
    const payload = jwt.verify(
        token,
        env.jwtAccessSecret,
        {
            algorithms: ["HS256"]
        }
    )

    if (
        typeof payload === "string" ||
        typeof payload.sub !== "string"
    ) {
        throw new Error(
            "Invalid access token payload",
        )
    }

    return {
        sub: payload.sub
    }
}