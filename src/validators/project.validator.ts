import { z } from 'zod';

export const createProjectSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(
                2,
                "Project name must contain at least 2 characters"
            )
            .max(
                255,
                "Project name must not exceed 255 characters"
            ),

        description: z
            .string()
            .trim()
            .optional()
            .nullable()
    })

export const updateProjectSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(
                2,
                "Project name must contain at least 2 characters"
            )
            .max(
                255,
                "Project name must not exceed 255 characters"
            )
            .optional(),

        description: z
            .string()
            .trim()
            .nullable()
            .optional()
    })
    .refine(
        (value) => value.name !== undefined || value.description !== undefined,
        {
            message: "At least one project field must be provided"
        }
    )

export const workspaceProjectParamsSchema = z
    .object({
        workspaceId: z
            .string()
            .uuid("Invalid workspace ID"),

        projectId: z
            .string()
            .uuid("Invalid project ID")
    })

export const workspaceIdParamsSchema = z.object({
    workspaceId: z.string().uuid("Invalid workspace ID")
})

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;