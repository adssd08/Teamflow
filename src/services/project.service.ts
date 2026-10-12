import { NotFoundError } from '../errors';
import * as projectRepository from '../repositories/project.repository';
import type { CreateProjectInput, UpdateProjectInput } from '../validators/project.validator';

export const createProject = async (
    workspaceId: string,
    userId: string,
    input: CreateProjectInput
) => {
    return projectRepository.createProject({
        workspaceId,
        createdBy: userId,
        name: input.name,
        description: input.description ?? null,
    })
}

export const listProjects = async (
    workspaceId: string,
) => {
    return projectRepository.findProjectsByWorkspace(
        workspaceId
    )
}

export const getProject = async (
    workspaceId: string,
    projectId: string,
) => {
    const project = await projectRepository.findProjectInWorkspace(
        workspaceId,
        projectId
    )

    if (!project) {
        throw new NotFoundError(
            "Project not found"
        )
    }

    return project;
}

export const updateProject = async (
    workspaceId: string,
    projectId: string,
    input: UpdateProjectInput
) => {
    const project = await projectRepository.updateProject(
        workspaceId,
        projectId,
        input
    )

    if (!project) {
        throw new NotFoundError(
            "Project not found",
        )
    }

    return project;
}

export const deleteProject = async (
    workspaceId: string,
    projectId: string,
) => {
    const project = await projectRepository.deleteProject(
        workspaceId,
        projectId
    );

    if (!project) {
        throw new NotFoundError(
            "Project not found"
        )
    }
}