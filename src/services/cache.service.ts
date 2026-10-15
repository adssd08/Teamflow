import { redisClient } from "../config/redis"

export const getCachedJson = async <T>(
    key: string
): Promise<T | null> => {

    const value = await redisClient.get(
        key
    )

    if (!value) {
        return null;
    }

    return JSON.parse(
        value,
    ) as T;
}

export const setCachedJson = async (
    key: string,
    value: unknown,
    ttlSeconds: number,
) => {
    await redisClient.set(
        key,
        JSON.stringify(value),
        {
            EX: ttlSeconds
        }
    )
}