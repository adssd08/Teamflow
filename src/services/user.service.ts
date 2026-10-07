import bcrypt from 'bcrypt';
import * as userRepository from '../repositories/user.repository.js';
import { type CreateUserInput } from '../validators/user.validator.js';
import { toUserResponseDto } from '../dtos/user.dto.js';
import { ConflictError } from '../errors/conflict-error.js'
import { NotFoundError } from '../errors/not-found-error.js'
import { UniqueConstraintError } from '../errors/uniqueConstraint-error.js';

export const createUser = async (
    input: CreateUserInput,
) => {
    const existingUser = await userRepository.findUserByEmail(input.email)

    if (existingUser) {
        throw new ConflictError("User with this email already exists");
    }

    const passwordHash = await bcrypt.hash(
        input.password,
        12
    )
    try {
        const user = await userRepository.createUser({
            name: input.name,
            email: input.email,
            passwordHash
        })

        return toUserResponseDto(user!);
    } catch (error) {
        if (error instanceof UniqueConstraintError) {
            throw new ConflictError(
                "User with this email already exists",
            )
        }
        throw error
    }
}

export const getUserById = async (id: string) => {
    const user = await userRepository.findUserById(id);

    if (!user) {
        throw new NotFoundError("User not found");
    }

    return toUserResponseDto(user);
}