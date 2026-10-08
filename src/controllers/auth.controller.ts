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