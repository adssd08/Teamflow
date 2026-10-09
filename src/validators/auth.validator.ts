import { z } from 'zod';

const passwordSchema = z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .refine(
        (password) => Buffer.byteLength(password, "utf8") <= 72,
        {
            message: "Password is too long. Please use a shorter password."
        }
    )

const bcryptPasswordSchema = z
    .string()
    .min(1, "Password is required")
    .refine(
        (password) =>
            Buffer.byteLength(password, "utf8") <= 72,
        {
            message: "Password is too long. Please use a shorter password.",
        },
    );

export const registerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must contain at least 2 characters")
        .max(255),

    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Invalid email address"),

    password: passwordSchema,

})

export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Invalid email address"),

    password: bcryptPasswordSchema
})

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;