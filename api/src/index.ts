import dotenv from "dotenv";
import express ,{Express} from "express";
import router from "./routes";
import cors from 'cors';
import "dotenv/config";

async function main(): Promise<void> {
    dotenv.config();
    const app:Express = express();
    app.use(cors());
    app.use(express.json());
    app.use(router)
    const port = process.env.PORT || 3000;

    app.listen(port , () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
    });
}

main();