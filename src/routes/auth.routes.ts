import { Router } from 'express';
import { validate } from '../middleware/validate.middleware';
import { registerSchema } from '../validators/auth.validator';
import { register } from '../controllers/auth.controller';

const router = Router();

router.post(
    "/register",
    validate(registerSchema),
    register,
)

export default router;