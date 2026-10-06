import bcrypt from 'bcrypt';
import * as userRepository from '../repositories/user.repository.js';
import { type CreateUserInput } from '../validators/user.validator.js';
import { toUserResponseDto } from '../dtos/user.dto.js';

export const createUser = async (
    input: CreateUserInput,
) => {
    const existingUser = await userRepository.findUserByEmail(input.email)

    if(existingUser){
        throw new Error("User with this email already exists");
    }

    const passwordHash = await bcrypt.hash(
        input.password,
        12
    )

    const user = await userRepository.createUser({
            name: input.name,
            email: input.email,
            passwordHash
        })

    return toUserResponseDto(user!);
}

export const getUserById = async (id: string) => {
    const user = await userRepository.findUserById(id);

    if(!user) {
        throw new Error("User not found");
    }

    return toUserResponseDto(user);
}