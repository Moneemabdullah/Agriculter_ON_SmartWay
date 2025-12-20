import * as sensorService from "./sensor.service";
import { Request, Response } from "express";

export const addSensorcontroller = async (req: Request, res: Response) => {
    try {
        const ownerId = req.body.ownerId;
        const newSensor = await sensorService.addSensorService(
            ownerId as string
        );
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: newSensor,
        });
    } catch (error) {
        res.status(500).json({ message: "Error adding sensor", error });
    }
};

export const getSensorsByOwnerController = async (
    req: Request,
    res: Response
) => {
    try {
        const ownerId = req.params.ownerId;
        const sensors = await sensorService.getSensorsByOwnerService(ownerId as string);
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: sensors,
        });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving sensors", error });
    }
};

export const getSensorByIdController = async (req: Request, res: Response) => {
    try {
        const sensorId = req.params.sensorId;
        const sensor = await sensorService.getSensorByIdService(sensorId as string);
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
