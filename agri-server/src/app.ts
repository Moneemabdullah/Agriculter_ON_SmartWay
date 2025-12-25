import express, { Request, Response } from "express";
import connectDb from "./config/db";
import { mainRouter } from "./Route";

const app = express();
app.use(express.json());

connectDb();

// test route
app.get("/", (req: Request, res: Response) => {
    res.render("../src/views/index.html");
});

//* all routes
app.use("/api/v1", mainRouter);

export default app;
