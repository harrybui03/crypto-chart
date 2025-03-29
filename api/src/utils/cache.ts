import Redis from "ioredis";
import {ERROR_CODES, ERROR_MESSAGES} from "../constant/error";
import {AppError} from "../error/error";

export async function getCachedDataOrThrow<T>(
    redis: Redis,
    cacheKey: string
): Promise<T> {
    const cachedData = await redis.get(cacheKey);
    if (!cachedData) {
        throw new AppError(
            ERROR_MESSAGES.CACHE.NOT_FOUND,
            ERROR_CODES.NOT_FOUND,
            { cacheKey }
        );
    }

    try {
        return JSON.parse(cachedData) as T;
    } catch (error) {
        if (error instanceof AppError) throw error;

        throw new AppError(
            ERROR_MESSAGES.SERVER.INTERNAL,
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            {
                originalError: error instanceof Error ? error.message : String(error)
            }
        );
    }
}