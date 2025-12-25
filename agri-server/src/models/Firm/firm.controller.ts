import { Request, Response } from "express";
import { addFirmService } from "./firm.service";

export const addFirmController = async (req: Request, res: Response) => {
    try {
        const firmData = req.body;
        const newFirm = await addFirmService(firmData as any);
        res.status(201).json({
            success: true,
            message: "Firm added successfully",
            data: newFirm,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

export const getFirmByIdController = async (req: Request, res: Response) => {
    try {
        const firmId = req.params.id;
        const firm = await addFirmService(firmId as any);
        res.status(200).json({
            success: true,
            message: "Firm retrieved successfully",
            data: firm,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

export const updateFirmController = async (req: Request, res: Response) => {
    try {
        const firmId = req.params.id;
        const updateData = req.body;
        const updatedFirm = await addFirmService(firmId as any);
        res.status(200).json({
            success: true,
            message: "Firm updated successfully",
            data: updatedFirm,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

export const deleteFirmController = async (req: Request, res: Response) => {
    try {
        const firmId = req.params.id;
        const deletedFirm = await addFirmService(firmId as any);
        res.status(200).json({
            success: true,
            message: "Firm deleted successfully",
            data: deletedFirm,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};
