import { Price, HistoryChart } from "../dto/dto";
import { config } from "../config/env";
import { redisClient } from "../redis/redis";
import {CACHE_EXPIRATION} from "../constant/cache";
import {getCachedDataOrThrow} from "../utils/cache";
import {AppError} from "../error/error";
import {ERROR_CODES, ERROR_MESSAGES} from "../constant/error";
import {apiRequest} from "../utils/app";

export async function getCryptoPrice(symbol: string): Promise<Price | null> {
    const cacheKey = `crypto:price:${symbol.toLowerCase()}`;

    try {
        const cachedPrice = await getCachedDataOrThrow<Price>(redisClient.getClient(), cacheKey);
        return cachedPrice;
    } catch (cacheError) {
        if (!(cacheError instanceof AppError) || cacheError.statusCode !== 404) {
            throw cacheError;
        }
    }

    try {
        const response = await apiRequest<Record<string, { usd: number }>>({
            url: `${config.api.resourceUrl}/simple/price`,
            params: { ids: symbol, vs_currencies: 'usd' },
        });

        if (!response.success) {
            throw new AppError(
                response.error?.message || ERROR_MESSAGES.API.SERVER_ERROR,
                response.error?.code || ERROR_CODES.INTERNAL_SERVER_ERROR,
                { apiError: response.error?.details }
            );
        }

        const price = response.data?.[symbol.toLowerCase()]?.usd;
        if (!price) {
            throw new AppError(
                ERROR_MESSAGES.NOT_FOUND.CRYPTO,
                ERROR_CODES.NOT_FOUND,
                { symbol }
            );
        }

        const priceData: Price = {
            symbol: symbol.toLowerCase(),
            price,
        };

        await redisClient.getClient().setex(
            cacheKey,
            CACHE_EXPIRATION.CRYPTO_PRICE,
            JSON.stringify(priceData)
        );

        return priceData;
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

export async function getCryptoMarketChart(
    symbol: string,
    days: number
): Promise<HistoryChart | null> {
    const cacheKey = `crypto:history:${symbol.toLowerCase()}:${days}`;
    try {
        const cachedChart = await getCachedDataOrThrow<HistoryChart>(redisClient.getClient(), cacheKey);
        return cachedChart;
    } catch (cacheError) {
        if (!(cacheError instanceof AppError) || cacheError.statusCode !== 404) {
            throw cacheError;
        }
    }

    try {
        const response = await apiRequest<{ prices: [number, number][] }>({
            url: `${config.api.resourceUrl}/coins/${symbol}/market_chart`,
            params: { vs_currency: 'usd', days },
        });
        if (!response.success) {
            throw new AppError(
                response.error?.message || ERROR_MESSAGES.API.SERVER_ERROR,
                response.error?.code || ERROR_CODES.INTERNAL_SERVER_ERROR,
                { apiError: response.error?.details }
            );
        }

        if (!response.data?.prices?.length) {
            throw new AppError(
                ERROR_MESSAGES.NOT_FOUND.HISTORY,
                ERROR_CODES.NOT_FOUND,
                { symbol, days }
            );
        }

        const historyChart: HistoryChart = {
            data: response.data.prices.map(([time, price]) => ({ time, price })),
        };

        await redisClient.getClient().setex(
            cacheKey,
            CACHE_EXPIRATION.CRYPTO_MARKET_CHART,
            JSON.stringify(historyChart)
        );

        return historyChart;
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