import { z } from 'zod';

export const createWorkspaceSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Workspace name must contain at least 2 characters")
        .max(255, "Workspace name must not exceed 255 characters")
})

export const updateWorkspaceScehma = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Workspace name must contain at least 2 characters")
        .max(255, "Workspace name must not exceed 255 characters")
})

export const workspaceIdSchema = z.object({
    id: z.string().uuid("Invalid workspace ID")
})

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>
export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceScehma>