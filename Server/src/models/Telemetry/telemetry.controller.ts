import {
    getDayAverageForWeek,
    getHourAverageForDay,
} from "./telemetry.aggregation";
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

export const ingestBulkTelemetry = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const telemetryArray = req.body;
        if (!Array.isArray(telemetryArray) || telemetryArray.length === 0) {
            throw new AppError("An array of telemetry data is required", 400);
        }
        const data = await insertTelemetry(telemetryArray);

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
        const dateObj = new Date(date);
        const data = await getHourAverageForDay(sensorId, dateObj);
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
        const data = await getDayAverageForWeek(sensorId);
        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
};
