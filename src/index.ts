import express, { type Express, type Request, type Response } from 'express'
import cookieParser from 'cookie-parser';

import { env } from './config/env'
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import { errorHandler } from './middleware/error.middleware';
import { NotFoundError } from './errors/not-found-error';

const app: Express = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/users", userRoutes);
app.use("/auth", authRoutes);

app.get("/health", (_, res: Response) => {
    res.send({ "status": "ok" })
});

app.use((req, res, next) => {
    next(
        new NotFoundError(
            `Route ${req.method} ${req.originalUrl} not found`,
        )
    )
})

app.use(errorHandler)

app.listen(env.PORT, () => {
    console.log(`App listening on port ${env.PORT}`)
})
