import { redisClient } from "../cache/redis"

export type RateLimitOptions = {
    prefix: string;
    limit: number;
    windowSeconds: number;
}

const rateLimitScript = `
local current = redis.call("INCR", KEYS[1])

if current == 1 then
    redis.call(
        "EXPIRE",
        KEYS[1],
        ARGV[1]
    )
end

local ttl = redis.call("TTL",KEYS[1])

return {current, ttl}
`

export const consumeRateLimit = async (
    identifier: string,
    options: RateLimitOptions,
) => {
    const key = `rate-limit:${options.prefix}:${identifier}`;


    const [count, ttl] = await redisClient.eval(
        rateLimitScript,
        {
            keys: [key],
            arguments: [
                String(
                    options.windowSeconds
                )
            ]
        }
    ) as [
            number,
            number
        ]

    return {
        count,
        limit: options.limit,

        remaining: Math.max(
            options.limit - count,
            0,
        ),

        retryAfterSeconds: ttl > 0 ? ttl : options.windowSeconds,

        allowed: count <= options.limit,
    }
}
