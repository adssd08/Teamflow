import type { User } from "../db/schema.js";

export interface UserResponseDto {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

export const toUserResponseDto = ( user: User ) : UserResponseDto => ({
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
})