import { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/appError.utils";
import logger from "../../utils/logger.utils";
import * as sensorService from "./sensor.service";

export const addSensorcontroller = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const sensorId = req.body.sensorId as string | undefined;
        const firmId = (req.body.firmId as string | undefined) ?? req.userId;

        if (!firmId) throw new AppError("Firm ID is required", 400);
        if (!sensorId) throw new AppError("Sensor ID is required", 400);

        logger.info(`Firm/Owner ID: ${firmId}, Sensor ID: ${sensorId}`);
        const newSensor = await sensorService.addSensorService(
            firmId,
            sensorId
        );
        res.status(201).json({
            success: true,
            message: "Sensor added successfully",
            data: newSensor,
        });
    } catch (error) {
        if (error instanceof AppError) return next(error);
        next(new AppError((error as any)?.message || "Error adding sensor", 400));
    }
};

export const getSensorsByOwnerController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const firmId =
            (req.params.ownerId as string | undefined) ??
            (req.params.firmId as string | undefined) ??
            (req.userId as string | undefined);
        if (!firmId) throw new AppError("Firm ID is required", 400);

        const sensors = await sensorService.getSensorsByFirmService(firmId);
        res.status(200).json({
            success: true,
            message: "Sensors retrieved successfully",
            data: sensors,
        });
    } catch (error) {
        if (error instanceof AppError) return next(error);
        next(new AppError((error as any)?.message || "Error retrieving sensors", 400));
    }
};

export const getSensorByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const sensorId = req.params.sensorId as string | undefined;
        if (!sensorId) throw new AppError("Sensor ID is required", 400);

        const sensor = await sensorService.getSensorByIdService(sensorId);
        res.status(200).json({
            success: true,
            message: "Sensor retrieved successfully",
            data: sensor,
        });
    } catch (error) {
        if (error instanceof AppError) return next(error);
        next(new AppError((error as any)?.message || "Error retrieving sensor", 400));
    }
};

export const deleteSensorByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const sensorId = req.params.sensorId as string | undefined;
        if (!sensorId) throw new AppError("Sensor ID is required", 400);

        const deletedSensor = await sensorService.deleteSensorByIdService(sensorId);
        res.status(200).json({
            success: true,
            message: "Sensor deleted successfully",
            data: deletedSensor,
        });
    } catch (error) {
        if (error instanceof AppError) return next(error);
        next(new AppError((error as any)?.message || "Error deleting sensor", 400));
    }
};
