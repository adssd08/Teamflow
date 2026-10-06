import {z} from 'zod';

export const createUserSchema = z.object({
    name: z
        .string()
        .min(2,"Name must contain at least 2 characters")
        .max(100),

    email: z
        .string()
        .email("Invalid email address"),

    password: z
        .string()
        .min(8, "Password must contain at least 8 characters")
        .max(100)
})

export type CreateUserInput = z.Infer<typeof createUserSchema>;