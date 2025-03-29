import express ,{Express} from "express";
import router from "./routes/routes";
import cors from 'cors';
import {config} from "./config/env";

async function main(): Promise<void> {
    const app:Express = express();
    app.use(cors());
    app.use(express.json());
    app.use(router)

    app.listen(config.server.port , () => {
        console.log(`[server]: Server is running at http://localhost:${config.server.port}`);
    });
}

main().catch(error => {
    console.error("[server] Failed to start:", error);
});