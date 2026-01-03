import cors from "cors";
import express, { Request, Response } from "express";
import path from "path";
import connectDb from "./config/db.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { mainRouter } from "./Route";
import logger from "./utils/logger.utils";

const app = express();
app.use(express.json());

app.use(cors());
connectDb();

const loggerMiddleware = (req: Request, res: Response, next: Function) => {
    logger.info(
        `${req.method} ${req.path} ${
            req.body ? "- Body: " + JSON.stringify(req.body) : ""
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

//* all routes
app.use("/api/v1", mainRouter);

//* Global error handler (must be last)
app.use(errorHandler);

export default app;
