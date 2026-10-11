import type { Workspace, WorkspaceMemberRole } from "../db/schema";

export interface WorkspaceResponseDto {
    id: string;
    name: string;
    slug: string;
    createdBy: string;
    role: WorkspaceMemberRole;
    createdAt: Date;
    updatedAt: Date;
}

export const toWorkspaceDto = (workspace: Workspace, role: WorkspaceMemberRole): WorkspaceResponseDto => ({
    id: workspace.id,
    name: workspace.name,
    slug: workspace.slug,
    createdBy: workspace.createdBy,
    role: role,
    createdAt: workspace.createdAt,
    updatedAt: workspace.updatedAt
})