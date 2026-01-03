import logger from "../../utils/logger.utils";
import * as sensorService from "./sensor.service";
import { Request, Response } from "express";

export const addSensorcontroller = async (req: Request, res: Response) => {
    try {
        const ownerId = req.userId;
        const sensorId = req.body.sensorId;
        logger.info(`Owner ID: ${ownerId}, Sensor ID: ${sensorId}`);
        const newSensor = await sensorService.addSensorService(
            ownerId as string,
            sensorId as string
        );
        res.status(200).json({
            success: true,
            message: "Sensor added successfully",
            data: newSensor,
        });
    } catch (error) {
        logger.error("Error in addSensorcontroller:", error);
        res.status(500).json({ message: "Error adding sensor", error });
    }
};

export const getSensorsByOwnerController = async (
    req: Request,
    res: Response
) => {
    try {
        const ownerIdParam = req.params.ownerId as string | undefined;
        const currentUserId = req.userId as string | undefined;
        const currentUserRole = req.user?.role as string | undefined;

        const ownerId = ownerIdParam || currentUserId;
        if (!ownerId) return res.status(400).json({ message: "Owner id required" });

        // if ownerId is provided explicitly, only allow admin or the same user
        if (ownerIdParam && currentUserRole !== "admin" && ownerId !== currentUserId) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const sensors = await sensorService.getSensorsByOwnerService(ownerId as string);
        res.status(200).json({ success: true, message: "Sensors retrieved successfully", data: sensors });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving sensors", error });
    }
};

export const getSensorByIdController = async (req: Request, res: Response) => {
    try {
        const sensorId = req.params.sensorId;
        const sensor = await sensorService.getSensorByIdService(
            sensorId as string
        );
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: sensor,
        });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving sensor", error });
    }
};

export const deleteSensorByIdController = async (
    req: Request,
    res: Response
) => {
    try {
        const sensorId = req.params.sensorId;
        const deletedSensor = await sensorService.deleteSensorByIdService(
            sensorId as string
        );
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: deletedSensor,
        });
    } catch (error) {
        res.status(500).json({ message: "Error deleting sensor", error });
    }
};
