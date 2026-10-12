import { asyncHandler } from "../middleware/async-handler"

import * as projectService from '../services/project.service'

export const createProject = asyncHandler(
    async (req, res) => {
        const project = await projectService.createProject(
            req.params.workspaceId as string,
            req.user!.id,
            req.body
        )

        res.status(201).json({
            success: true,
            data: project
        })
    }
)

export const listProjects = asyncHandler(
    async (req, res) => {
        const projects = await projectService.listProjects(
            req.params.workspaceId as string
        )

        res.status(200).json({
            success: true,
            data: projects
        })
    }
)

export const getProject = asyncHandler(
    async (req, res) => {
        const project = await projectService.getProject(
            req.params.workspaceId as string,
            req.params.projectId as string,
        )

        res.status(200).json({
            success: true,
            data: project
        })
    }
)

export const updateProject = asyncHandler(
    async (req, res) => {
        const project = await projectService.updateProject(
            req.params.workspaceId as string,
            req.params.projectId as string,
            req.body
        )

        res.status(200).json({
            success: true,
            data: project
        })
    }
)

export const deleteProject = asyncHandler(
    async (req, res) => {
        await projectService.deleteProject(
            req.params.workspaceId as string,
            req.params.projectId as string
        )

        res.status(204).send()
    }
)