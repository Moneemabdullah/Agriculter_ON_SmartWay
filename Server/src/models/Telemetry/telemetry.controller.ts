import {
    getDayAverageForWeek,
    getHourAverageForDay,
} from "./telemetry.aggregation";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/appError.utils";
import { insertTelemetry } from "./telemetry.service";
import { telemetryPayloadSchema } from "../../validations/telemetry.validation";
import { SensorModel } from "../Sensor/sensor.models";

export const ingestTelemetry = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const parsed = telemetryPayloadSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({
                success: false,
                message: "Invalid telemetry payload",
                error: {
                    code: "VALIDATION_ERROR",
                    details: parsed.error.issues.map((e) => ({
                        field: e.path.join("."),
                        message: e.message,
                    })),
                },
            });
            return;
        }

        const payload = parsed.data;
        const records = Array.isArray(payload) ? payload : [payload];

        const sensorIds = [...new Set(records.map((r) => r.sensorId))];
        const existingSensors = await SensorModel.find({
            sensorId: { $in: sensorIds },
        }).select("sensorId");
        const existingSensorIds = new Set(
            existingSensors.map((s) => s.sensorId)
        );

        const unknownSensors = sensorIds.filter(
            (id) => !existingSensorIds.has(id)
        );
        if (unknownSensors.length > 0) {
            res.status(400).json({
                success: false,
                message: "Telemetry references unknown sensors",
                error: {
                    code: "BAD_REQUEST",
                    details: { unknownSensors },
                },
            });
            return;
        }

        const data = await insertTelemetry(records);

        res.status(201).json({
            success: true,
            message: "Telemetry ingested successfully",
            data: { inserted: data.length },
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
            throw AppError.badRequest("sensorId and date are required");
        }
        const dateObj = new Date(date + "T00:00:00Z");
        const data = await getHourAverageForDay(sensorId as string, dateObj);
        res.status(200).json({
            success: true,
            message: "Hourly average retrieved successfully",
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
            throw AppError.badRequest("sensorId is required");
        }
        const data = await getDayAverageForWeek(sensorId as string);
        res.status(200).json({
            success: true,
            message: "Daily average retrieved successfully",
            data,
        });
    } catch (error) {
        next(error);
    }
};
