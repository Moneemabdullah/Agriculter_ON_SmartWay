import { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/appError.utils";
import { addFirmService } from "./firm.service";

export const addFirmController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const firmData = req.body;
        if (!firmData || Object.keys(firmData).length === 0) {
            throw new AppError("Firm data is required", 400);
        }

        const newFirm = await addFirmService(firmData as any);
        res.status(201).json({
            success: true,
            message: "Firm added successfully",
            data: newFirm,
        });
    } catch (error) {
        next(error);
    }
};

export const getFirmByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const firmId = req.params.id;
        if (!firmId) {
            throw new AppError("Firm ID is required", 400);
        }

        const firm = await addFirmService(firmId as any);
        res.status(200).json({
            success: true,
            message: "Firm retrieved successfully",
            data: firm,
        });
    } catch (error) {
        next(error);
    }
};

export const updateFirmController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const firmId = req.params.id;
        const updateData = req.body;

        if (!firmId) {
            throw new AppError("Firm ID is required", 400);
        }
        if (!updateData || Object.keys(updateData).length === 0) {
            throw new AppError("Update data is required", 400);
        }

        const updatedFirm = await addFirmService(firmId as any);
        res.status(200).json({
            success: true,
            message: "Firm updated successfully",
            data: updatedFirm,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteFirmController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const firmId = req.params.id;
        if (!firmId) {
            throw new AppError("Firm ID is required", 400);
        }

        const deletedFirm = await addFirmService(firmId as any);
        res.status(200).json({
            success: true,
            message: "Firm deleted successfully",
            data: deletedFirm,
        });
    } catch (error) {
        next(error);
    }
};
