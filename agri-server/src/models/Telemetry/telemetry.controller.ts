import { Request, Response } from "express";
import { insertTelemetry } from "./telemetry.service";

export const ingestTelemetry = async (req: Request, res: Response) => {
    const data = await insertTelemetry(req.body);

    res.status(201).json({
        success: true,
        data,
    });
};
