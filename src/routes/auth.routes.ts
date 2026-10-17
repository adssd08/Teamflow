import { Router } from 'express';
import { validate } from '../middleware/validate.middleware';
import { loginSchema, registerSchema } from '../validators/auth.validator';
import { register, login, me, refresh, logout } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { rateLimit } from '../middleware/rate-limit.middleware';

const router = Router();

router.post(
    "/register",

    rateLimit({
        prefix: "register",
        limit: 3,
        windowSeconds: 10 * 60,
    }),

    validate(registerSchema),
    register,
)

router.post(
    "/login",
    rateLimit({
        prefix: "Login",
        limit: 5,
        windowSeconds: 60,
    }),

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