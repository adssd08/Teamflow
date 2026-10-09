import { UnauthorizedError } from "../errors/unauthorized-error";
import { asyncHandler } from "../middleware/async-handler";
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
        const result = await authService.login(req.body);

        res.status(200).json({
            success: true,
            data: result
        })
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