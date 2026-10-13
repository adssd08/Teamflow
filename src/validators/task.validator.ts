import { z } from "zod";

const MAX_OFFSET = 2_147_483_647;

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

export const taskListQuerySchema = z
    .object({
        page: z
            .coerce
            .number()
            .int()
            .min(1)
            .default(1),

        limit: z
            .coerce
            .number()
            .int()
            .min(1)
            .max(100)
            .default(20),

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
            .optional(),

        sortBy: z
            .enum([
                "createdAt",
                "updatedAt",
                "dueDate",
                "priority",
                "status",
                "title",
            ])
            .default("createdAt"),

        order: z
            .enum([
                "asc",
                "desc"
            ])
            .default("desc")
    })
    .superRefine(
        (value, ctx) => {
            const offset = (value.page - 1) * value.limit;

            if (
                !Number.isSafeInteger(offset) ||
                offset > MAX_OFFSET
            ) {
                ctx.addIssue({
                    code: "custom",
                    path: ["page"],
                    message: "Page value is too large"
                })
            }


        }
    )

export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
export type TaskListQuery = z.infer<typeof taskListQuerySchema>