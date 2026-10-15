import { redisClient } from "./redis"

export const getCachedJson = async <T>(
    key: string
): Promise<T | null> => {

    if (!redisClient.isReady) {
        return null;
    }

    try {
        const value = await redisClient.get(
            key
        )

        if (!value) {
            return null;
        }

        return JSON.parse(
            value,
        ) as T;
    } catch (error) {
        console.error(
            "Redis read failed",
            error,
        );

        return null;
    }

}

export const setCachedJson = async (
    key: string,
    value: unknown,
    ttlSeconds: number,
) => {
    if (!redisClient.isReady) {
        return null;
    }

    try {
        await redisClient.set(
            key,
            JSON.stringify(value),
            {
                EX: ttlSeconds
            }
        )
    } catch (error) {
        console.error(
            "Redis write failed",
            error
        )
    }
}

export const deleteCachedValue = async (
    key: string
) => {
    try {
        await redisClient.del(
            key,
        )
    } catch (error) {
        // TODO: Need to handle this case, 
        // as in this case we will have latest DB data but stale cached data
        console.error(
            "Failed to invalidate cache",
            error
        )

    }
}