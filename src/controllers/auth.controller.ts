import { refreshCookieOptions } from "../config/cookie";
import { UnauthorizedError } from "../errors/unauthorized-error";
import { asyncHandler } from "../middleware/async-handler";
import { clearRefreshCookie, setRefreshCookie } from "../security/refresh-cookie";
import * as authService from '../services/auth.service'
import type { Request, Response } from "express";

export const register = asyncHandler(
    async (req: Request, res: Response) => {
        const user = await authService.register(req.body);
        res.status(201).json({
            success: true,
            data: user
        })
    }
)

export const login = asyncHandler(
    async (req, res) => {
        const { accessToken, refreshToken } = await authService.login(req.body);

        setRefreshCookie(res, refreshToken)

        res.status(200).json({
            success: true,
            data: {
                accessToken
            }
        })
    }
)

export const refresh = asyncHandler(
    async (req, res) => {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            throw new UnauthorizedError(
                "Refresh token required",
            )
        }

        const result = await authService.refreshAccessToken(
            refreshToken
        )

        res.status(200).json({
            success: true,
            data: result
        })
    }
)

export const logout = asyncHandler(
    async (req, res) => {
        clearRefreshCookie(res)

        res.status(204).send();
    }
)

export const me = asyncHandler(
    async (req, res) => {
        if (!req.user) {
            throw new UnauthorizedError(
                "Authentication required",
            )
        }

        const user = await authService.getCurrentUser(
            req.user.id
        )

        res.status(200).json({
            success: true,
            data: user
        })
    }
)