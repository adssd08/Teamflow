import { and, eq } from 'drizzle-orm';

import { db } from '../db';
import { workspaces, workspaceMembers } from '../db/schema'


type CreateWorkspaceRecord = {
    name: string;
    slug: string;
    createdBy: string;
}

export const createWorkspaceWithOwner = async (
    input: CreateWorkspaceRecord,
) => {

    return db.transaction(
        async (tx) => {
            const [workspace] = await tx
                .insert(workspaces)
                .values(input)
                .returning()

            if (!workspace) throw new Error("Unable to create workspace");

            const [membership] = await tx
                .insert(workspaceMembers)
                .values({
                    workspaceId: workspace.id,
                    userId: input.createdBy,
                    role: "OWNER"
                })
                .returning()

            if (!membership) throw new Error("Unable to create membership for the workspace");

            return {
                workspace,
                membership,
            }
        }
    )
}

export const findWorkspacesForUser = async (
    userId: string,
) => {
    return db
        .select({
            id: workspaces.id,
            name: workspaces.name,
            slug: workspaces.slug,
            createdBy: workspaces.createdBy,
            role: workspaceMembers.role,
            createdAt: workspaces.createdAt,
            updatedAt: workspaces.updatedAt,
        })
        .from(workspaceMembers)
        .innerJoin(
            workspaces,
            eq(
                workspaceMembers.workspaceId,
                workspaces.id
            )
        )
        .where(
            eq(
                workspaceMembers.userId,
                userId
            )
        )
}

export const findWorkspaceForUser = async (
    workspaceId: string,
    userId: string,
) => {
    const [workspace] = await db
        .select({
            id: workspaces.id,
            name: workspaces.name,
            slug: workspaces.slug,
            createdBy: workspaces.createdBy,
            role: workspaceMembers.role,
            createdAt: workspaces.createdAt,
            updatedAt: workspaces.updatedAt,
        })
        .from(workspaceMembers)
        .innerJoin(
            workspaces,
            eq(
                workspaceMembers.workspaceId,
                workspaces.id,
            ),
        )
        .where(
            and(
                eq(
                    workspaceMembers.workspaceId,
                    workspaceId
                ),
                eq(
                    workspaceMembers.userId,
                    userId
                )
            )
        )
        .limit(1)

    return workspace
}

export const updateWorkspace = async (
    workspaceId: string,
    input: {
        name: string;
    },
) => {
    const [workspace] = await db
        .update(workspaces)
        .set({
            name: input.name,
            updatedAt: new Date(),
        })
        .where(
            eq(
                workspaces.id,
                workspaceId
            )
        )
        .returning();

    return workspace;
}

export const deleteWorkspace = async (
    workspaceId: string,
) => {
    await db
        .delete(workspaces)
        .where(
            eq(
                workspaces.id,
                workspaceId
            )
        )
}