import Router from 'express';

import {
    createUser,
    getUserById
} from '../controllers/user.controller.js';

import { validate, validateParams } from '../middleware/validate.middleware.js';

import { createUserSchema, userIdParamsSchema } from '../validators/user.validator.js';

const router = Router();

router.post(
    "/",
    validate(createUserSchema),
    createUser,
)

router.get('/:id',
    validateParams(userIdParamsSchema),
    getUserById
);

export default router;

