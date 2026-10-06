import {
    type Request,
    type Response,
    type NextFunction
} from 'express';

import * as userService from '../services/user.service.js';

export const createUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try{
        const user = await userService.createUser(req.body);
        return res.status(201).json({
            data: user,
        })
    } catch (error) {
        next(error);
    }
}

export const getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await userService.getUserById(req.params.id as string);

        return res.status(200).json({
            data: user,
        })
    } catch (error) {
        next(error);
    }
}