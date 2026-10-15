import { NotFoundError } from '../errors';
import * as projectRepository from '../repositories/project.repository';
import type { CreateProjectInput, UpdateProjectInput } from '../validators/project.validator';
import { deleteCachedValue, getCachedJson, setCachedJson } from '../cache/cache.service';
import type { Project } from '../db/schema';
import { projectCacheKey } from '../cache/cache-keys';

export const PROJECT_CACHE_TTL_SECONDS = 10;


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

    const key = projectCacheKey(
        workspaceId,
        projectId
    )

    let cachedProject: Project | null = null;

    cachedProject = await getCachedJson<Project>(key);

    if (cachedProject) {
        console.log(
            `[CACHE HIT] ${key}`
        )

        return cachedProject;
    }

    console.log(
        `[CACHE MISS] ${key}`
    );

    const project = await projectRepository.findProjectInWorkspace(
        workspaceId,
        projectId
    )

    if (!project) {
        throw new NotFoundError(
            "Project not found"
        )
    }

    await setCachedJson(
        key,
        project,
        PROJECT_CACHE_TTL_SECONDS
    )

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

    const key = projectCacheKey(
        workspaceId,
        projectId
    )

    await deleteCachedValue(
        key,
    )

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

    const key = projectCacheKey(
        workspaceId,
        projectId
    )

    await deleteCachedValue(
        key,
    )

}