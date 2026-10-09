import { toUserResponseDto } from "../dtos/user.dto"
import { ConflictError } from "../errors/conflict-error"
import { UnauthorizedError } from "../errors/unauthorized-error"
import { UniqueConstraintError } from "../errors/uniqueConstraint-error"
import * as userRepository from "../repositories/user.repository"
import { hashPassword, verifyPassword } from "../security/password"
import { signAccessToken, signRefreshToken, verifyRefreshToken, type TokenPayload } from "../security/token"
import type { LoginInput, RegisterInput } from '../validators/auth.validator'

export const register = async (
    input: RegisterInput
) => {
    const existingUser = await userRepository.findUserByEmail(input.email);

    if (existingUser) {
        throw new ConflictError(
            "User with this email already exists"
        )
    }

    const passwordHash = await hashPassword(
        input.password
    )
    try {
        const user = await userRepository.createUser({
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

export const login = async (
    input: LoginInput
) => {
    const user = await userRepository.findUserByEmail(input.email);

    if (!user) {
        throw new UnauthorizedError(
            "Invalid email or password"
        )
    }

    const passwordMatches = await verifyPassword(
        input.password,
        user.passwordHash
    )

    if (!passwordMatches) {
        throw new UnauthorizedError(
            "Invalid email or password"
        )
    }

    const accessToken = signAccessToken(user.id)
    const refreshToken = signRefreshToken(user.id)

    return {
        accessToken,
        refreshToken
    }
}

export const refreshAccessToken = async (
    refreshToken: string,
) => {
    let payload: TokenPayload;

    try {
        payload = verifyRefreshToken(refreshToken);
    } catch {
        throw new UnauthorizedError(
            "Invalid or expired refresh token"
        )
    }

    const user = await userRepository.findUserById(
        payload.sub,
    );

    if (!user) {
        throw new UnauthorizedError(
            "Invalid refresh token"
        )
    }

    const accessToken = signAccessToken(user.id);

    return {
        accessToken
    }
}

export const getCurrentUser = async (
    userId: string,
) => {
    const user = await userRepository.findUserById(userId);

    if (!user) {
        throw new UnauthorizedError(
            "User no longer exist",
        )
    }

    return toUserResponseDto(user)
}