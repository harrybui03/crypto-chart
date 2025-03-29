import { Response } from "express";
import {ERROR_CODES, ERROR_MESSAGES} from "../constant/error";

export class AppError extends Error {
    constructor(
        public message: string,
        public statusCode: number,
        public details?: any
    ) {
        super(message);
    }
}

export const handleError = (err: unknown, res: Response) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            error: err.message,
            ...(err.details && { details: err.details }),
        });
    }

    console.error("Unexpected error:", err);
    return res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({
        error: ERROR_MESSAGES.SERVER.INTERNAL,
    });
};