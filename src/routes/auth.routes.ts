import { Router } from 'express';
import { validate } from '../middleware/validate.middleware';
import { loginSchema, registerSchema } from '../validators/auth.validator';
import { register, login, me, refresh, logout } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post(
    "/register",
    validate(registerSchema),
    register,
)

router.post(
    "/login",
    validate(loginSchema),
    login
)

router.post(
    "/refresh",
    refresh
)

router.post(
    "/logout",
    logout,
)

router.get(
    "/me",
    authenticate,
    me
)

export default router;