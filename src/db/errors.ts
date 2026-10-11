import { DatabaseError } from "pg";
import { DrizzleQueryError } from 'drizzle-orm/errors'

type PostgresError = {
    code?: string;
    constraint?: string;
}

export const isUniqueConstraintError = (
    error: unknown,
    constraintName?: string
): boolean => {
    if (!(error instanceof DrizzleQueryError)) {
        return false;
    }

    const cause = error.cause;

    if (!cause || typeof cause !== "object") {
        return false
    }

    const pgError = cause as PostgresError;

    if (pgError.code !== "23505") {
        return false;
    }

    if (
        constraintName && pgError.constraint !== constraintName
    ) {
        return false;
    }

    return true;
}