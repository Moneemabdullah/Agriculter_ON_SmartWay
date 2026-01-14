import {
    getDayAverageForWeek,
    getHourAverageForDay,
} from "./telemetry.aggregation";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/appError.utils";
import { insertTelemetry, TelemetryPayload } from "./telemetry.service";

export const ingestTelemetry = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const body = req.body as TelemetryPayload | TelemetryPayload[];

        if (!body || (Array.isArray(body) && body.length === 0)) {
            throw new AppError("Telemetry data is required", 400);
        }

        const data = await insertTelemetry(body);

        res.status(201).json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
};

export const getHourAverageForDayController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { sensorId, date } = req.params;
        if (!sensorId || !date) {
            throw new AppError("sensorId and date are required", 400);
        }
        const dateObj = new Date(date + "T00:00:00Z");
        const data = await getHourAverageForDay(sensorId as string, dateObj);
        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
};

export const getDayAverageForWeekController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { sensorId } = req.params;
        if (!sensorId) {
            throw new AppError("sensorId is required", 400);
        }
        const data = await getDayAverageForWeek(sensorId as string);
        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
};
