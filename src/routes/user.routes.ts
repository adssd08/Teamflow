import Router from 'express';

import {
    getUserById
} from '../controllers/user.controller';

import { validateParams } from '../middleware/validate.middleware';

import { userIdParamsSchema } from '../validators/user.validator';

const router = Router();

router.get('/:id',
    validateParams(userIdParamsSchema),
    getUserById
);

export default router;

