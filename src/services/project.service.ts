import { NotFoundError } from '../errors';
import * as projectRepository from '../repositories/project.repository';
import type { CreateProjectInput, UpdateProjectInput } from '../validators/project.validator';
import { redisClient } from '../config/redis';
import { getCachedJson, setCachedJson } from './cache.service';
import type { Project } from '../db/schema';

export const PROJECT_CACHE_TTL_SECONDS = 10;

const projectCacheKey = (
    workspaceId: string,
    projectId: string,
) => `project:${workspaceId}:${projectId}`


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

    try {
        cachedProject = await getCachedJson<Project>(key);
    } catch (error) {
        console.error(
            "Redis read failed",
            error,
        )
    }

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

    try {
        await setCachedJson(
            key,
            project,
            PROJECT_CACHE_TTL_SECONDS
        )

    } catch (error) {
        console.error(
            "Redis write failed",
            error
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