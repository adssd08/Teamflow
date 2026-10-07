import {
    type Request,
    type Response,
    type NextFunction
} from 'express';

import * as userService from '../services/user.service.js';
import { asyncHandler } from '../middleware/async-handler.js';

export const createUser = asyncHandler(
    async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {

        const user = await userService.createUser(req.body);
        return res.status(201).json({
            data: user,
        })

    }
)

export const getUserById = asyncHandler(
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const user = await userService.getUserById(req.params.id as string);
        return res.status(200).json({
            data: user,
        })

    }
)