import express, { Request, Response } from "express";
import connectDb from "./config/db.config";
import { mainRouter } from "./Route";
import path from "path";
import cors from "cors";

const app = express();
app.use(express.json());

app.use(cors());
connectDb();

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

export default app;
