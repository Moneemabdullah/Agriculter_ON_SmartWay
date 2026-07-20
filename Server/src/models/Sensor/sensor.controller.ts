import { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/appError.utils";
import logger from "../../utils/logger.utils";
import { FirmModel } from "../Firm/firm.models";
import * as sensorService from "./sensor.service";
import { UserContext } from "./sensor.service";

const resolveFirmId = async (userId: string, preferredFirmId?: string): Promise<string> => {
    if (preferredFirmId) return preferredFirmId;
    const firm = await FirmModel.findOne({ owner: userId }).lean();
    if (!firm) throw new AppError("No firm found for this user. Create a firm first.", 400);
    return firm._id.toString();
};

function getUserContext(req: Request): UserContext {
    return {
        userId: req.userId!,
        role: (req.user?.role ?? "farmer") as "admin" | "farmer" | "viewer",
    };
}

export const addSensorcontroller = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const sensorId = req.body.sensorId as string | undefined;
        if (!sensorId) throw new AppError("Sensor ID is required", 400);

        const firmId = await resolveFirmId(req.userId as string, req.body.firmId as string | undefined);

        logger.info(`Firm ID: ${firmId}, Sensor ID: ${sensorId}`);
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
        next(new AppError((error as Error)?.message || "Error adding sensor", 400));
    }
};

export const getAllSensorsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const sensors = await sensorService.getAllSensorsService();
        res.status(200).json({
            success: true,
            message: "All sensors retrieved successfully",
            data: sensors,
        });
    } catch (error) {
        if (error instanceof AppError) return next(error);
        next(new AppError((error as Error)?.message || "Error retrieving sensors", 400));
    }
};

export const getSensorsByOwnerController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const explicitFirmId =
            (req.params.ownerId as string | undefined) ??
            (req.params.firmId as string | undefined);

        if (explicitFirmId) {
            const userContext = getUserContext(req);

            if (userContext.role !== "admin" && explicitFirmId !== req.userId) {
                const targetFirm = await FirmModel.findById(explicitFirmId).lean();
                if (!targetFirm || targetFirm.owner.toString() !== req.userId) {
                    res.status(403).json({
                        status: "fail",
                        message: "You are not authorized to access these sensors",
                    });
                    return;
                }
            }

            const sensors = await sensorService.getSensorsByFirmService(explicitFirmId);
            res.status(200).json({
                success: true,
                message: "Sensors retrieved successfully",
                data: sensors,
            });
            return;
        }

        const userId = req.userId as string | undefined;
        if (!userId) throw new AppError("Authentication required", 401);

        const firms = await FirmModel.find({ owner: userId }).lean();
        if (!firms.length) {
            res.status(200).json({
                success: true,
                message: "Sensors retrieved successfully",
                data: [],
            });
            return;
        }

        const firmIds = firms.map((f) => f._id.toString());
        const sensors = await sensorService.getSensorsByFirmIdsService(firmIds);
        res.status(200).json({
            success: true,
            message: "Sensors retrieved successfully",
            data: sensors,
        });
    } catch (error) {
        if (error instanceof AppError) return next(error);
        next(new AppError((error as Error)?.message || "Error retrieving sensors", 400));
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

        const userContext = getUserContext(req);
        const sensor = await sensorService.getSensorByIdService(sensorId, userContext);

        if (!sensor) {
            res.status(404).json({
                status: "fail",
                message: "Sensor not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Sensor retrieved successfully",
            data: sensor,
        });
    } catch (error) {
        if (error instanceof AppError) return next(error);
        next(new AppError((error as Error)?.message || "Error retrieving sensor", 400));
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

        const userContext = getUserContext(req);
        const deletedSensor = await sensorService.deleteSensorByIdService(sensorId, userContext);

        if (!deletedSensor) {
            res.status(404).json({
                status: "fail",
                message: "Sensor not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Sensor deleted successfully",
            data: deletedSensor,
        });
    } catch (error) {
        if (error instanceof AppError) return next(error);
        next(new AppError((error as Error)?.message || "Error deleting sensor", 400));
    }
};
