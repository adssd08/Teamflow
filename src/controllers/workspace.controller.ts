import { asyncHandler } from "../middleware/async-handler";
import * as workspaceService from '../services/workspace.service'

export const createWorkspace = asyncHandler(
    async (req, res) => {
        const workspace = await workspaceService.createWorkspace(
            req.user!.id,
            req.body
        )

        console.log("Workspace retrieved: ", workspace)
        res.status(201).json({
            success: true,
            data: workspace
        })
    }
)

export const listWorkspaces = asyncHandler(
    async (req, res) => {
        const workspaces = await workspaceService.listWorkspaces(
            req.user!.id
        )

        res.status(200).json({
            success: true,
            data: workspaces
        })
    }
)

export const getWorkspace = asyncHandler(
    async (req, res) => {
        const workspace = await workspaceService
            .getWorkspace(
                req.params.id as string,
                req.user!.id
            )

        res.status(200).json({
            success: true,
            data: workspace
        })
    }
)

export const updateWorkspace = asyncHandler(
    async (req, res) => {
        const workspace = await workspaceService
            .updateWorkspace(
                req.params.id as string,
                req.user!.id,
                req.body
            )

        return res.status(200).json({
            success: true,
            data: workspace
        })
    }
)

export const deleteWorkspace = asyncHandler(
    async (req, res) => {
        await workspaceService
            .deleteWorkspace(
                req.params.id as string,
                req.user!.id
            )

        res.status(204).send()
    }
)