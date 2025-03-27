import express, { Request, Response } from "express";
import { CurrentPrice, HistoryChart } from "./dto";
import {getCryptoMarketChart, getCryptoPrice} from "./service";

const router = express.Router();


router.get("/price/:symbol", async (req: Request, res: Response) => {
    try {
        const symbol = req.params.symbol?.toLowerCase();

        if (!symbol) {
            res.status(400).json({ error: "Symbol is required" });
            return
        }

        const price: CurrentPrice | null = await getCryptoPrice(symbol);

        if (!price) {
            res.status(404).json({ error: "Cryptocurrency not found" });
            return
        }

        res.status(200).json(price);
    } catch (error) {
        console.error("Error fetching price:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/history/:symbol/:days", async (req: Request, res: Response) => {
    try {
        const symbol = req.params.symbol?.toLowerCase();
        const days = parseInt(req.params.days, 10);

        if (!symbol || isNaN(days) || days <= 0) {
             res.status(400).json({ error: "Valid symbol and days are required" });
             return
        }

        const history: HistoryChart | null = await getCryptoMarketChart(symbol, days);

        if (!history) {
            res.status(404).json({ error: "Cryptocurrency history not found" });
            return
        }

        res.status(200).json(history);
    } catch (error) {
        console.error("Error fetching market chart:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
