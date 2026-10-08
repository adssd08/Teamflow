import { eq } from 'drizzle-orm';

import { db } from '../db/index';
import { users } from '../db/schema';
import { UniqueConstraintError } from '../errors/uniqueConstraint-error';
import { isUniqueConstraintError } from '../db/errors';

type createUserRecord = {
    name: string;
    email: string;
    passwordHash: string;
}

export const createUser = async (
    input: createUserRecord
) => {
    try {
        const [user] = await db
            .insert(users)
            .values(input)
            .returning();

        return user;
    } catch (error) {
        if (isUniqueConstraintError(error)) {
            throw new UniqueConstraintError("Email already exists")
        }

        throw error;
    }
}

export const findUserById = async (id: string) => {
    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1)

    return user;
}

export const findUserByEmail = async (email: string) => {
    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1)

    return user;
}