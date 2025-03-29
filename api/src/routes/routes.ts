import express, { Request, Response } from "express";
import { Price, HistoryChart } from "../dto/dto";
import {getCryptoMarketChart, getCryptoPrice} from "../service/service";
import {AppError, handleError} from "../error/error";
import {ERROR_CODES, ERROR_MESSAGES} from "../constant/error";
import {validateAndParseDays} from "../utils/utils";

const router = express.Router();


router.get("/price/:symbol", async (req: Request, res: Response) => {
    try {
        const symbol = req.params.symbol?.toLowerCase();

        if (!symbol) {
            throw new AppError(
                ERROR_MESSAGES.VALIDATION.SYMBOL_REQUIRED,
                ERROR_CODES.BAD_REQUEST
            );
        }

        const price = await getCryptoPrice(symbol);
        if (!price) {
            throw new AppError(
                ERROR_MESSAGES.NOT_FOUND.CRYPTO,
                ERROR_CODES.NOT_FOUND
            );
        }

        res.status(200).json(price);
    } catch (error) {
        handleError(error, res);
    }
});

router.get("/history/:symbol/:days", async (req: Request, res: Response) => {
    try {
        const days = validateAndParseDays(req.params.days, "days");
        const symbol = req.params.symbol?.toLowerCase();
        if (!symbol) {
            throw new AppError(
                ERROR_MESSAGES.VALIDATION.SYMBOL_REQUIRED,
                ERROR_CODES.BAD_REQUEST,
                { field: "symbol" }
            );
        }
        const history = await getCryptoMarketChart(symbol, days);
        if (!history) {
            throw new AppError(
                ERROR_MESSAGES.NOT_FOUND.HISTORY,
                ERROR_CODES.NOT_FOUND
            );
        }

        res.status(200).json(history);
    } catch (error) {
        handleError(error, res);
    }
});

export default router;