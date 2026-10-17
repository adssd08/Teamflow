import type { RequestHandler } from "express";
import { consumeRateLimit, type RateLimitOptions } from "../rate-limit/redis-rate-limiter";

export const rateLimit = (
    options: RateLimitOptions
): RequestHandler => async (
    req,
    res,
    next
) => {
        try {
            const identifier = req.ip as string;

            const result = await consumeRateLimit(
                identifier,
                options
            )

            res.setHeader(
                "X-RateLimit-Limit",
                result.limit
            )

            res.setHeader(
                "X-RateLimit-Remaining",
                result.remaining
            )

            if (!result.allowed) {
                res.setHeader(
                    "Retry-After",
                    result.retryAfterSeconds
                )

                return res
                    .status(429)
                    .json({
                        success: false,
                        error: {
                            message: "Too many requests. Please try again later.",
                            retryAfterSeconds: result.retryAfterSeconds
                        }
                    })
            }


            next();
        } catch (error) {
            console.error(
                "Rate limiter unavailable",
                error
            )
            next(error)
        }

    }