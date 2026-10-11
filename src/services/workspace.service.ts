import { toWorkspaceDto } from '../dtos/workspace.dto';
import { NotFoundError } from '../errors';

import * as workspaceRepository from '../repositories/workspace.repository';

import { createWorkspaceSlug } from '../utils/slug';
import type { CreateWorkspaceInput, UpdateWorkspaceInput } from '../validators/workspace.validator';

export const createWorkspace = async (
    userId: string,
    input: CreateWorkspaceInput,
) => {
    const slug = createWorkspaceSlug(input.name);

    // TODO:
    // wrap workspace + OWNER membership creation
    // in a database transaction
    const workspace = await workspaceRepository.createWorkspace({
        name: input.name,
        slug,
        createdBy: userId
    })

    if (!workspace) throw new Error("Something Went Wrong");

    await workspaceRepository.createWorkspaceMember({
        workspaceId: workspace.id,
        userId,
        role: "OWNER"
    })

    console.log("Workspace Created: ", workspace)

    return toWorkspaceDto(workspace, "OWNER")
}

export const listWorkspaces = async (
    userId: string,
) => {
    return workspaceRepository.findWorkspacesForUser(userId)
}

export const getWorkspace = async (
    workspaceId: string,
    userId: string,
) => {
    const workspace = await workspaceRepository
        .findWorkspaceForUser(
            workspaceId,
            userId
        )

    if (!workspace) {
        throw new NotFoundError(
            "Workspace not found"
        )
    }

    return workspace
}

export const updateWorkspace = async (
    workspaceId: string,
    userId: string,
    input: UpdateWorkspaceInput,
) => {
    const workspace = await workspaceRepository
        .findWorkspaceForUser(
            workspaceId,
            userId,
        )

    if (!workspace) {
        throw new NotFoundError(
            "Workspace not found",
        )
    }

    return workspaceRepository
        .updateWorkspace(
            workspaceId,
            input
        )
}

export const deleteWorkspace = async (
    workspaceId: string,
    userId: string,
) => {
    const workspace = await workspaceRepository
        .findWorkspaceForUser(
            workspaceId,
            userId
        )

    if (!workspace) {
        throw new NotFoundError(
            "Workspace not found"
        )
    }

    await workspaceRepository
        .deleteWorkspace(workspaceId)
}