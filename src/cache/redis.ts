import {
    createClient,
} from 'redis';

import { env } from '../config/env';

export const redisClient = createClient({
    url: env.redisUrl,

    socket: {
        connectTimeout: 1_000,

        reconnectStrategy: (retries) => {
            if (retries >= 5) {
                return false;
            }

            return Math.min(
                100 * 2 ** retries,
                1_000,
            );
        },
    },

    commandOptions: {
        timeout: 500,
    },

    disableOfflineQueue: true,
})

redisClient.on(
    "error",
    (error) => {
        console.error(
            "Redis error: ",
            error
        );
    }
)

export const connectRedis = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
}