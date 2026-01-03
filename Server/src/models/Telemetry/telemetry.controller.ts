import { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/appError.utils";
import { insertTelemetry } from "./telemetry.service";

export const ingestTelemetry = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const telemetryData = req.body;
        if (!telemetryData || Object.keys(telemetryData).length === 0) {
            throw new AppError("Telemetry data is required", 400);
        }

        const data = await insertTelemetry(telemetryData);

        res.status(201).json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
};
