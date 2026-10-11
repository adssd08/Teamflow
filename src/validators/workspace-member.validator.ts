import { z } from "zod"

export const addWorkspaceMemberSchema = z
    .object({
        email: z
            .string()
            .trim()
            .toLowerCase()
            .email(),
        role: z
            .enum(["ADMIN", "MEMBER"])
            .default("MEMBER")
    })

export const updateWorkspaceMemberSchema = z
    .object({
        role: z.enum([
            "ADMIN",
            "MEMBER",
        ]),
    });

export const workspaceIdParamsSchema = z.object({
    workspaceId: z.string().uuid("Invalid workspace ID")
})

export const workspaceMemberParamsSchema = z.object({
    userId: z.string().uuid("Invalid user ID"),
    workspaceId: z.string().uuid("Invalid workspace ID")
})