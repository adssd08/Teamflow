import { DatabaseError } from "pg";
import { DrizzleQueryError } from 'drizzle-orm/errors'

export const isUniqueConstraintError = (
    error: unknown
): boolean => {
    if (!(error instanceof DrizzleQueryError)) {
        return false;
    }

    const cause = error.cause;

    return (
        cause instanceof DatabaseError && cause.code === '23505'
    )
}