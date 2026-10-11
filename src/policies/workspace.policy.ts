import type { WorkspaceMemberRole } from "../db/schema";


export const canManageWorkspace = (role: WorkspaceMemberRole) => (
    role === "OWNER" ||
    role === "ADMIN"
)

export const canDeleteWorkspace = (role: WorkspaceMemberRole) => (
    role === "OWNER"
)

export const canAddMember = (
    actorRole: WorkspaceMemberRole,
    targetRole: WorkspaceMemberRole
) => {
    if (actorRole === "OWNER") {
        return targetRole !== 'OWNER';
    }

    if (actorRole === "ADMIN") {
        return targetRole === "MEMBER";
    }

    return false;
}