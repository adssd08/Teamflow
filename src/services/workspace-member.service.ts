import type { WorkspaceMemberRole } from '../db/schema';
import { ConflictError, ForbiddenError, NotFoundError, UniqueConstraintError } from '../errors';
import * as userRepository from '../repositories/user.repository'
import * as workspaceMemberRepository from '../repositories/workspace-member.repository'

export const addMember = async (
    workspaceId: string,
    actorRole: WorkspaceMemberRole,
    input: {
        email: string;
        role: "ADMIN" | "MEMBER",
    }
) => {

    if (
        actorRole === "ADMIN" && input.role !== "MEMBER"
    ) {
        throw new ForbiddenError(
            "Admins can only add members"
        )
    }

    if (actorRole === "MEMBER") {
        throw new ForbiddenError(
            "You do not have permission to add workspace members"
        )
    }

    const user = await userRepository.findUserByEmail(
        input.email,
    );

    if (!user) {
        throw new NotFoundError(
            "User not found",
        )
    }

    const existingMembership = await workspaceMemberRepository.findMembership(
        workspaceId,
        user.id
    )

    if (existingMembership) {
        throw new ConflictError(
            "User is already a workspace member",
        )
    }
    try {
        const membership = await workspaceMemberRepository
            .createWorkspaceMember({
                workspaceId,
                userId: user.id,
                role: input.role
            });

        if (!membership) {
            throw new Error(
                "Something went wrong"
            )
        }

        return {
            membershipId: membership.id,
            userId: user.id,
            name: user.name,
            email: user.email,
            role: membership.role,
            joinedAt: membership.joinedAt
        }
    } catch (error) {
        if (error instanceof UniqueConstraintError) {
            throw new ConflictError(
                "User is already a member of this workspace"
            )
        }

        throw error
    }
}

export const listMembers = async (
    workspaceId: string
) => {
    const members = await workspaceMemberRepository
        .findWorkspaceMembers(workspaceId)

    return members;
}

export const updateMemberRole = async (
    workspaceId: string,
    targetUserId: string,
    actorRole: WorkspaceMemberRole,
    targetRole: WorkspaceMemberRole
) => {

    if (actorRole !== "OWNER") {
        throw new ForbiddenError(
            "Only the workspace owner can change member roles"
        )
    }

    if (targetRole === "OWNER") {
        throw new ForbiddenError(
            "Workspace can only have one owner"
        )
    }

    const targetMembership = await workspaceMemberRepository.findMembership(
        workspaceId,
        targetUserId
    );

    if (!targetMembership) {
        throw new NotFoundError(
            "Workspace member not found"
        )
    }

    if (targetMembership.role === "OWNER") {
        throw new ForbiddenError(
            "Workspace owner role cannot be changed"
        )
    }

    if (targetMembership.role === targetRole) {
        return targetMembership;
    }

    const membership = await workspaceMemberRepository.updateMemberRole(
        workspaceId,
        targetUserId,
        targetRole
    )

    return membership;
}

export const removeMember = async (
    workspaceId: string,
    targetUserId: string,
    actorRole: WorkspaceMemberRole
) => {

    if (actorRole === "MEMBER") {
        throw new ForbiddenError(
            "Members cannot remove workspace members"
        )
    }

    const targetMembership = await workspaceMemberRepository.findMembership(
        workspaceId,
        targetUserId
    )

    if (!targetMembership) {
        throw new NotFoundError(
            "Workspace member not found"
        )
    }

    if (actorRole === "ADMIN" && targetMembership.role != "MEMBER") {
        throw new ForbiddenError(
            "Admins can only remove members"
        )
    }

    if (targetMembership.role === "OWNER") {
        throw new ForbiddenError(
            "Workspace owner cannot be removed"
        )
    }

    return await workspaceMemberRepository.removeMember(
        workspaceId,
        targetUserId
    )
}