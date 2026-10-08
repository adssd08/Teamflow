import bcrypt from 'bcrypt';
import * as userRepository from '../repositories/user.repository';
import { toUserResponseDto } from '../dtos/user.dto';
import { NotFoundError } from '../errors/not-found-error'

export const getUserById = async (id: string) => {
    const user = await userRepository.findUserById(id);

    if (!user) {
        throw new NotFoundError("User not found");
    }

    return toUserResponseDto(user);
}