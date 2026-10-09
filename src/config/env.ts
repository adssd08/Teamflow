import 'dotenv/config'
import type { SignOptions } from 'jsonwebtoken';

const jwtAccessSecret = process.env.JWT_ACCESS_SECRET;

if (!jwtAccessSecret) {
    throw new Error("JWT_ACCESS_SECRET is required");
}

const jwtAccessExpiresIn = (
    process.env.JWT_ACCESS_EXPIRES_IN || "15m"
).trim().toLowerCase();

function isJwtDuration(value: string): value is NonNullable<SignOptions['expiresIn']> & string {
    return value.length <= 100 &&
        /^(?:\d+\.?\d*|\.\d+) ?(?:milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/.test(value) &&
        Number.parseFloat(value) > 0;
}

if (!isJwtDuration(jwtAccessExpiresIn)) {
    throw new Error('JWT_ACCESS_EXPIRES_IN must be a positive duration such as "15m", "1h", or "7d"');
}

export const env = {
    PORT: Number(process.env.PORT || 3000),
    DB_URL: process.env.DATABASE_URL,
    jwtAccessSecret,
    jwtAccessExpiresIn,
}
