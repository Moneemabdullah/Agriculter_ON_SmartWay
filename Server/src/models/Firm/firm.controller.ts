import { Request, Response } from "express";
import * as firmService from "./firm.service";

const isOwnerOrAdmin = (reqUserId?: string, reqUserRole?: string, ownerId?: any) => {
    if (!ownerId) return false;
    if (reqUserRole === "admin") return true;
    return ownerId.toString() === reqUserId;
};

export const addFirmController = async (req: Request, res: Response) => {
    try {
        const userId = req.userId as string;
        const role = req.user?.role as string | undefined;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });
        if (role !== "farmer") return res.status(403).json({ message: "Only farmers can create firms" });

        const { location, crops, sensors, plantationDate } = req.body;
        const missing: string[] = [];
        if (!location) missing.push('location');
        if (!crops) missing.push('crops');
        if (!sensors || !Array.isArray(sensors) || sensors.length === 0) missing.push('sensors');
        if (!plantationDate) missing.push('plantationDate');
        if (missing.length) {
            return res.status(400).json({ message: `Missing required fields: ${missing.join(', ')}` });
        }

        try {
            const newFirm = await firmService.addFirmService(userId, {
                location,
                crops,
                sensors,
                plantationDate,
            } as any);
            res.status(201).json({ success: true, message: "Firm added successfully", data: newFirm });
        } catch (err: any) {
            // validation errors from service
            return res.status(400).json({ success: false, message: err.message || 'Invalid data' });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

export const getAllFirmsController = async (req: Request, res: Response) => {
    try {
        const userId = req.userId as string;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });
        const firms = await firmService.getFirmsByUserService(userId);
        res.status(200).json({ success: true, message: "Firms retrieved successfully", data: firms });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

export const getFirmByIdController = async (req: Request, res: Response) => {
    try {
        const firmId = req.params.id as string | undefined;
        if (!firmId) return res.status(400).json({ message: "Firm id is required" });
        const reqUserId = req.userId as string;
        const reqRole = req.user?.role as string | undefined;

        const firm = await firmService.getFirmByIdService(firmId);
        if (!firm) return res.status(404).json({ message: "Firm not found" });

        if (!isOwnerOrAdmin(reqUserId, reqRole, firm.user)) {
            return res.status(403).json({ message: "Forbidden" });
        }

        res.status(200).json({ success: true, message: "Firm retrieved successfully", data: firm });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

export const updateFirmController = async (req: Request, res: Response) => {
    try {
        const firmId = req.params.id as string | undefined;
        if (!firmId) return res.status(400).json({ message: "Firm id is required" });
        const reqUserId = req.userId as string;
        const reqRole = req.user?.role as string | undefined;
        const updateData = req.body;

        const firm = await firmService.getFirmByIdService(firmId);
        if (!firm) return res.status(404).json({ message: "Firm not found" });

        if (!isOwnerOrAdmin(reqUserId, reqRole, firm.user)) {
            return res.status(403).json({ message: "Forbidden" });
        }

        // if non-admin is updating sensors, ensure ownership
        if ((updateData as any).sensors && reqRole !== 'admin') {
            const sensors = (updateData as any).sensors;
            const foundSensors = await (await import("../Sensor/sensor.models")).SensorModel.find({ _id: { $in: sensors } }).lean();
            const notOwned = foundSensors.find((s: any) => s.owner?.toString() !== reqUserId);
            if (notOwned) {
                return res.status(400).json({ success: false, message: 'You can only attach sensors that you own' });
            }
        }

        const updatedFirm = await firmService.updateFirmService(firmId, updateData as any);
        res.status(200).json({ success: true, message: "Firm updated successfully", data: updatedFirm });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

export const deleteFirmController = async (req: Request, res: Response) => {
    try {
        const firmId = req.params.id as string | undefined;
        if (!firmId) return res.status(400).json({ message: "Firm id is required" });
        const reqUserId = req.userId as string;
        const reqRole = req.user?.role as string | undefined;

        const firm = await firmService.getFirmByIdService(firmId);
        if (!firm) return res.status(404).json({ message: "Firm not found" });

        if (!isOwnerOrAdmin(reqUserId, reqRole, firm.user)) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const deletedFirm = await firmService.deleteFirmService(firmId);
        res.status(200).json({ success: true, message: "Firm deleted successfully", data: deletedFirm });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};
