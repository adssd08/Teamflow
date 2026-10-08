import { toUserResponseDto } from "../dtos/user.dto"
import { ConflictError } from "../errors/conflict-error"
import { UniqueConstraintError } from "../errors/uniqueConstraint-error"
import { findUserByEmail, createUser } from "../repositories/user.repository"
import { hashPassword } from "../security/password"
import type { RegisterInput } from '../validators/auth.validator'

export const register = async (
    input: RegisterInput
) => {
    const existingUser = await findUserByEmail(input.email);

    if (existingUser) {
        throw new ConflictError(
            "User with this email already exists"
        )
    }

    const passwordHash = await hashPassword(
        input.password
    )
    try {
        const user = await createUser({
            name: input.name,
            email: input.email,
            passwordHash
        })

        return toUserResponseDto(user!)
    } catch (error) {
        if (error instanceof UniqueConstraintError) {
            throw new ConflictError(
                "User with this email already exists",
            )
        }
        throw error
    }
}