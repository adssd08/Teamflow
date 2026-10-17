import express, { type Express, type Request, type Response } from 'express'
import cookieParser from 'cookie-parser';

import { env } from './config/env'
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import { errorHandler } from './middleware/error.middleware';
import { NotFoundError } from './errors/not-found-error';
import workspaceRoutes from './routes/workspace.routes';
import projectRoutes from './routes/project.routes';
import taskRoutes from './routes/task.routes'
import workspaceMemberRoutes from './routes/workspace-members.routes'
import attachmentRoutes from './routes/attachment.routes'
import { connectRedis } from './cache/redis';
import { ensureUploadDirectory } from './config/upload';

const app: Express = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/workspaces", workspaceRoutes)
app.use(
    "/workspaces/:workspaceId/members",
    workspaceMemberRoutes
)
app.use(
    "/workspaces/:workspaceId/projects",
    projectRoutes,
);
app.use(
    "/workspaces/:workspaceId/projects/:projectId/tasks",
    taskRoutes
)

app.use(
    "/workspaces/:workspaceId/projects/:projectId/tasks/:taskId/attachments",
    attachmentRoutes
)

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

const startServer = async () => {

    await ensureUploadDirectory();

    await connectRedis();

    app.listen(
        env.PORT,
        () => {
            console.log(`App listening on port ${env.PORT}`)
        }
    )
}

startServer().catch(
    (error) => {
        console.error(
            "Failed to start server",
            error,
        )

        process.exit(1);
    }
)

