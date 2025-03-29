import axios, { AxiosError, AxiosResponse } from 'axios';
import {ERROR_CODES, ERROR_MESSAGES} from "../constant/error";

interface ApiResponse<T> {
    success: boolean;
    data?:T;
    error?: {
        message: string;
        code: number;
        details?: any;
    };
}

export async function apiRequest<T>(
    config: {
        url: string;
        method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
        params?: any;
        data?: any;
        headers?: any;
    }
): Promise<ApiResponse<T>> {
    try {
        const response: AxiosResponse<T> = await axios({
            method: config.method || 'GET',
            url: config.url,
            params: config.params,
            data: config.data,
            headers: config.headers,
        });

        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        const axiosError = error as AxiosError;
        console.log(axiosError)
        // Handle known error statuses
        if (axiosError.response) {
            switch (axiosError.response.status) {
                case 400:
                    return {
                        success: false,
                        error: {
                            message: ERROR_MESSAGES.API.BAD_REQUEST,
                            code: ERROR_CODES.BAD_REQUEST,
                            details: axiosError.response.data,
                        },
                    };
                case 403:
                    return {
                        success: false,
                        error: {
                            message: ERROR_MESSAGES.API.RATE_LIMITED,
                            code: ERROR_CODES.FORBIDDEN,
                            details: {
                                retryAfter: axiosError.response.headers['retry-after'],
                            },
                        },
                    };
                case 404:
                    return {
                        success: false,
                        error: {
                            message: ERROR_MESSAGES.API.NOT_FOUND,
                            code: ERROR_CODES.NOT_FOUND,
                        },
                    };

                case 429:
                    return {
                        success: false,
                        error: {
                            message: ERROR_MESSAGES.API.RATE_LIMITED,
                            code: ERROR_CODES.TOO_MANY_REQUESTS,
                        }
                    }
                default:
                    return {
                        success: false,
                        error: {
                            message: ERROR_MESSAGES.API.SERVER_ERROR,
                            code: ERROR_CODES.INTERNAL_SERVER_ERROR,
                        },
                    };
            }
        }

        return {
            success: false,
            error: {
                message: ERROR_MESSAGES.API.NETWORK_ERROR,
                code: ERROR_CODES.SERVICE_UNAVAILABLE,
            },
        };
    }
}