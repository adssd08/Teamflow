import { z } from 'zod';

const passwordSchema = z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .refine(
        (password) => Buffer.byteLength(password, "utf8") <= 72,
        {
            message: "Password must not exceed 72 UTF-8 bytes"
        }
    )

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

export type RegisterInput = z.infer<typeof registerSchema>;