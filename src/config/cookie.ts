import type { CookieOptions } from "express";
import { env } from "./env";


export const refreshCookieOptions: CookieOptions = {
    httpOnly: true,

    secure: env.nodeEnv === "production",

    sameSite: "lax",

    path: "/auth",

    maxAge: env.jwtRefreshExpiresInMs

}