import Router from 'express';

import {
    createUser,
    getUserById
} from '../controllers/user.controller.js';

import { validate } from '../middleware/validate.middleware.js';

import { createUserSchema } from '../validators/user.validator.js';

const router = Router();

router.post(
    "/",
    validate(createUserSchema),
    createUser,
)

router.get('/:id',getUserById);

export default router;

