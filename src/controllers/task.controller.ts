import { asyncHandler } from "../middleware/async-handler";

import * as taskService from '../services/task.service';
import type { TaskListQuery } from "../validators/task.validator";

export const createTask = asyncHandler(
    async (req, res) => {
        const task = await taskService.createTask(
            req.params.workspaceId as string,
            req.params.projectId as string,
            req.user!.id,
            req.body,
        )

        res.status(201).json({
            success: true,
            data: task
        })
    }
)

export const listTasks = asyncHandler(
    async (req, res) => {
        const tasks = await taskService.listTasks(
            req.params.workspaceId as string,
            req.params.projectId as string,
            res.locals.validatedQuery as TaskListQuery
        )

        res.status(200).json({
            success: true,
            data: tasks
        })
    }
)

export const getTask = asyncHandler(
    async (req, res) => {
        const task = await taskService.getTask(
            req.params.workspaceId as string,
            req.params.projectId as string,
            req.params.taskId as string
        )

        res.status(200).json({
            success: true,
            data: task
        })
    }
)

export const updateTask = asyncHandler(
    async (req, res) => {
        const task = await taskService.updateTask(
            req.params.workspaceId as string,
            req.params.projectId as string,
            req.params.taskId as string,
            req.body
        )

        res.status(200).json({
            success: true,
            data: task
        })
    }
)

export const deleteTask = asyncHandler(
    async (req, res) => {
        await taskService.deleteTask(
            req.params.workspaceId as string,
            req.params.projectId as string,
            req.params.taskId as string
        )

        res.status(204).send()
    }
)