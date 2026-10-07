import express, { type Express, type Request, type Response } from 'express'
import { env } from './config/env.js'
import userRoutes from './routes/user.routes.js';
import { errorHandler } from './middleware/error.middleware.js';
import { NotFoundError } from './errors/not-found-error.js';

const app: Express = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRoutes);

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
