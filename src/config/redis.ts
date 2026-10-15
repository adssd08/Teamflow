import {
    createClient,
} from 'redis';

import { env } from '../config/env';

export const redisClient = createClient({
    url: env.redisUrl
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