import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import path from "path";
import connectDb from "./config/db.config";
import config from "./config/env.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { globalRateLimiter } from "./middlewares/rateLimit.middleware";
import { mainRouter } from "./Route";
import logger, { sanitizeLogBody } from "./utils/logger.utils";

const app = express();
app.use(helmet());
app.use(express.json());

const allowedOrigins = config.corsOrigins
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            if (
                allowedOrigins.includes(origin) ||
                allowedOrigins.includes("*")
            ) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        maxAge: 86400,
    })
);

app.use(globalRateLimiter);

app.use(async (req: Request, _res: Response, next: NextFunction) => {
    await connectDb();
    next();
});

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    logger.info(
        `${req.method} ${req.path} ${
            req.body ? "- Body: " + JSON.stringify(sanitizeLogBody(req.body)) : ""
        }`
    );
    next();
};

app.use(loggerMiddleware);

// test route
// app.get("/", (req: Request, res: Response) => {
//     res.render("../src/views/index.html");
// });

// app.use("/", (req: Request, res: Response) => {
//     res.send("Server is running");
// });

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (_req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});
//* all routes
app.use("/api/v1", mainRouter);

//* Global error handler (must be last)
app.use(errorHandler);

export default app;
