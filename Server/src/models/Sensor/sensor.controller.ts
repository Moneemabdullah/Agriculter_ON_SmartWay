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
        const firmId = req.body.firmId;
        const sensorId = req.body.sensorId;

        if (!sensorId) {
            throw new AppError("Sensor ID is required", 400);
        }

        logger.info(`Owner ID: ${firmId}, Sensor ID: ${sensorId}`);
        const newSensor = await sensorService.addSensorService(
            firmId as string,
            sensorId as string
        );
        res.status(200).json({
            success: true,
            message: "Sensor added successfully",
            data: newSensor,
        });
    } catch (error) {
        next(error);
    }
};

export const getSensorByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const sensorId = req.params.sensorId;
        if (!sensorId) {
            throw new AppError("Sensor ID is required", 400);
        }

        const sensor = await sensorService.getSensorByIdService(
            sensorId as string
        );
        res.status(200).json({
            success: true,
            message: "Sensor retrieved successfully",
            data: sensor,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteSensorByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const sensorId = req.params.sensorId;
        if (!sensorId) {
            throw new AppError("Sensor ID is required", 400);
        }

        const deletedSensor = await sensorService.deleteSensorByIdService(
            sensorId as string
        );
        res.status(200).json({
            success: true,
            message: "Sensor deleted successfully",
            data: deletedSensor,
        });
    } catch (error) {
        next(error);
    }
};
