
import { and, eq } from 'drizzle-orm';
import { db } from '../db';

import { projects } from '../db/schema';

type CreateProjectRecord = {
    workspaceId: string;
    name: string;
    description?: string | null;
    createdBy: string;
}

export const createProject = async (
    input: CreateProjectRecord,
) => {
    const [project] = await db
        .insert(projects)
        .values(input)
        .returning()

    return project;
}

export const findProjectsByWorkspace = async (
    workspaceId: string,
) => {
    return db
        .select()
        .from(projects)
        .where(
            eq(
                projects.workspaceId,
                workspaceId
            )
        )
}

export const findProjectInWorkspace = async (
    workspaceId: string,
    projectId: string,
) => {
    const [project] = await db
        .select()
        .from(projects)
        .where(
            and(
                eq(
                    projects.id,
                    projectId
                ),
                eq(
                    projects.workspaceId,
                    workspaceId
                )
            )
        )
        .limit(1)

    return project;
}

export const updateProject = async (
    workspaceId: string,
    projectId: string,
    input: {
        name?: string | undefined,
        description?: string | null | undefined;
    }
) => {
    const [project] = await db
        .update(projects)
        .set({
            ...input,
            updatedAt: new Date(),
        })
        .where(
            and(
                eq(
                    projects.id,
                    projectId
                ),
                eq(
                    projects.workspaceId,
                    workspaceId
                )
            )
        )
        .returning()

    return project;
}

export const deleteProject = async (
    workspaceId: string,
    projectId: string
) => {
    const [project] = await db
        .delete(projects)
        .where(
            and(
                eq(
                    projects.id,
                    projectId,
                ),
                eq(
                    projects.workspaceId,
                    workspaceId
                )
            )
        )
        .returning()

    return project;
}