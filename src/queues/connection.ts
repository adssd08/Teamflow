import { env } from '../config/env';

export const bullmqConnection = {
    host: env.redisHost,
    port: env.redisPort
}