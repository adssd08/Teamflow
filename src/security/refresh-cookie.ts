import type { Response } from "express";
import { refreshCookieOptions } from "../config/cookie";

const REFRESH_COOKIE_NAME =
    "refreshToken";

export const setRefreshCookie = (
    res: Response,
    token: string,
) => {
    res.cookie(
        REFRESH_COOKIE_NAME,
        token,
        refreshCookieOptions,
    );
};

export const clearRefreshCookie = (
    res: Response,
) => {
    res.clearCookie(
        REFRESH_COOKIE_NAME,
        {
            httpOnly:
                refreshCookieOptions.httpOnly,

            secure:
                refreshCookieOptions.secure,

            sameSite:
                refreshCookieOptions.sameSite,

            path:
                refreshCookieOptions.path,
        },
    );
};