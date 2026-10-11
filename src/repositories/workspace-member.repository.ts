import { db } from "../db";
import { isUniqueConstraintError } from "../db/errors";
import { users, workspaceMembers, type WorkspaceMemberRole } from "../db/schema";
import { and, eq } from 'drizzle-orm'
import { UniqueConstraintError } from "../errors";

type CreateWorkspaceMemberRecord = {
    workspaceId: string;
    userId: string;
    role: WorkspaceMemberRole;
}

export const createWorkspaceMember = async (
    input: CreateWorkspaceMemberRecord,
) => {
    try {
        const [member] = await db
            .insert(workspaceMembers)
            .values(input)
            .returning();

        return member;

    } catch (error) {
        if (
            isUniqueConstraintError(
                error,
                "workspace_members_workspace_user_unique"
            )
        ) {
            throw new UniqueConstraintError(
                "Workspace membership already exists"
            )
        }

        throw error;
    }

}

export const findMembership = async (
    workspaceId: string,
    userId: string,
) => {
    const [membership] = await db
        .select({
            id: workspaceMembers.id,
            workspaceId: workspaceMembers.workspaceId,
            userId: workspaceMembers.userId,
            role: workspaceMembers.role,
            joinedAt: workspaceMembers.joinedAt
        })
        .from(workspaceMembers)
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

    return membership;
}

export const findWorkspaceMembers = async (
    workspaceId: string
) => {
    return db
        .select({
            membershipId: workspaceMembers.id,
            userId: users.id,
            name: users.name,
            email: users.email,
            role: workspaceMembers.role,
            joinedAt: workspaceMembers.joinedAt,
        })
        .from(workspaceMembers)
        .innerJoin(
            users,
            eq(
                workspaceMembers.userId,
                users.id
            )
        )
        .where(
            eq(
                workspaceMembers.workspaceId,
                workspaceId
            )
        )
}

export const updateMemberRole = async (
    workspaceId: string,
    userId: string,
    role: "ADMIN" | "MEMBER"
) => {
    const [membership] = await db
        .update(workspaceMembers)
        .set({
            role,
        })
        .where(
            and(
                eq(
                    workspaceMembers.workspaceId,
                    workspaceId
                ),
                eq(
                    workspaceMembers.userId,
                    userId,
                )
            )
        )
        .returning()

    return membership;
}

export const removeMember = async (
    workspaceId: string,
    userId: string,
) => {
    const [member] = await db
        .delete(workspaceMembers)
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
        .returning()

    return member

}