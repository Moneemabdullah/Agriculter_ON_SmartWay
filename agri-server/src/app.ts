import express, { Request, Response } from "express";
import connectDb from "./config/db";

const app = express();
app.use(express.json());

connectDb();

app.get("/", (req: Request, res: Response) => {
    res.send("Agriculture on SmartWay API is running...");
});

export default app;
