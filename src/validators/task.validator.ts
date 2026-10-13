import { z } from "zod";

export const createTaskSchema = z
    .object({
        title: z
            .string()
            .trim()
            .min(1, "Task title is required")
            .max(255, "Task title must not exceed 255 characters"),

        description: z
            .string()
            .trim()
            .nullable()
            .optional(),

        status: z
            .enum([
                "TODO",
                "IN_PROGRESS",
                "DONE"
            ])
            .optional(),

        priority: z
            .enum([
                "LOW",
                "MEDIUM",
                "HIGH"
            ])
            .optional(),

        assignedTo: z
            .string()
            .uuid("Invalid assignee ID")
            .nullable()
            .optional(),

        dueDate: z
            .string()
            .datetime({ offset: true })
            .nullable()
            .optional()
    });

export const updateTaskSchema = z
    .object({
        title: z
            .string()
            .trim()
            .min(1, "Task title is required")
            .max(255, "Task title must not exceed 255 characters")
            .optional(),

        description: z
            .string()
            .trim()
            .nullable()
            .optional(),

        status: z
            .enum([
                "TODO",
                "IN_PROGRESS",
                "DONE"
            ])
            .optional(),

        priority: z
            .enum([
                "LOW",
                "MEDIUM",
                "HIGH"
            ])
            .optional(),

        assignedTo: z
            .string()
            .uuid("Invalid assignee ID")
            .nullable()
            .optional(),

        dueDate: z
            .string()
            .datetime({ offset: true })
            .nullable()
            .optional()
    })
    .refine(
        value => Object.values(value).some(
            (field) => field !== undefined
        ),
        {
            message: "At least one task field must be provided"
        }
    )

export const projectTaskParamsSchema = z
    .object({
        workspaceId: z
            .string()
            .uuid("Invalid workspace ID"),

        projectId: z
            .string()
            .uuid("Invalid project ID"),

        taskId: z
            .string()
            .uuid("Invalid task ID")
    })

export const projectIdParamsSchema = z
    .object({
        workspaceId: z
            .string()
            .uuid("Invalid workspace ID"),

        projectId: z
            .string()
            .uuid("Invalid project ID"),
    })


export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>