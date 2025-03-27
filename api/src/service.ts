import axios from "axios";
import redis from "./redis";
import {CurrentPrice, HistoryChart, HistoryChartData} from "./dto";

const API_URL = process.env.RESOURCE_API_URL || "https://api.coingecko.com/api/v3";
const CACHE_EXPIRATION = 60;

export async function getCryptoPrice(symbol: string): Promise<CurrentPrice | null> {
    symbol = symbol.toLowerCase();
    const cacheKey = `crypto:price:${symbol}`;

    try {
        const response = await axios.get(`${API_URL}/simple/price`, {
            params: { ids: symbol, vs_currencies: "usd" },
        });

        const price = response.data[symbol]?.usd ?? null;

        if (price) {
            const data: CurrentPrice = {
                symbol,
                price,
            };

            await redis.setex(cacheKey, CACHE_EXPIRATION, JSON.stringify(data));
            return data;
        }
    } catch (error) {
        console.error("Error fetching price:", error);
    }

    const cachedData = await redis.get(cacheKey);
    return cachedData ? JSON.parse(cachedData) : null;
}

export async function getCryptoMarketChart(symbol: string, days: number): Promise<HistoryChart | null> {
    symbol = symbol.toLowerCase();
    const cacheKey = `crypto:history:${symbol}:${days}`;

    try {
        const cachedData = await redis.get(cacheKey);
        if (cachedData) return JSON.parse(cachedData);

        const response = await axios.get(`${API_URL}/coins/${symbol}/market_chart`, {
            params: { vs_currency: "usd", days },
        });

        if (!response.data || !response.data.prices) return null;

        const historyData: HistoryChartData[] = response.data.prices.map(
            ([time, price]: [number, number]) => ({
                price,
                time,
            })
        );

        const historyChart: HistoryChart = { data: historyData };

        await redis.setex(cacheKey, 3600, JSON.stringify(historyChart));

        return historyChart;
    } catch (error) {
        console.error("Error fetching market chart:", error);
        return null;
    }
}
