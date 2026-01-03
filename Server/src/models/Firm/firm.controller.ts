import { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/appError.utils";
import * as firmService from "./firm.service";

const isOwnerOrAdmin = (
    reqUserId?: string,
    reqUserRole?: string,
    ownerId?: unknown
) => {
    if (!ownerId) return false;
    if (reqUserRole === "admin") return true;
    return ownerId?.toString() === reqUserId;
};

const wrapAndForwardError = (error: unknown, next: NextFunction) => {
    if (error instanceof AppError) return next(error);
    const message = (error as any)?.message || "Internal Server Error";
    const statusCode = typeof (error as any)?.message === "string" ? 400 : 500;
    return next(new AppError(message, statusCode));
};

export const addFirmController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.userId as string | undefined;
        const role = req.user?.role as string | undefined;
        if (!userId) throw new AppError("Unauthorized", 401);
        if (role !== "farmer") {
            throw new AppError("Only farmers can create firms", 403);
        }

        const { location, crops, sensors, plantationDate } = req.body;
        const missing: string[] = [];
        if (!location) missing.push("location");
        if (!crops) missing.push("crops");
        if (!sensors || !Array.isArray(sensors) || sensors.length === 0)
            missing.push("sensors");
        if (!plantationDate) missing.push("plantationDate");

        if (missing.length) {
            throw new AppError(
                `Missing required fields: ${missing.join(", ")}`,
                400
            );
        }

        const newFirm = await firmService.addFirmService(userId, {
            location,
            crops,
            sensors,
            plantationDate,
        } as any);

        res.status(201).json({
            success: true,
            message: "Firm added successfully",
            data: newFirm,
        });
    } catch (error) {
        wrapAndForwardError(error, next);
    }
};

export const getAllFirmsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.userId as string | undefined;
        if (!userId) throw new AppError("Unauthorized", 401);

        const firms = await firmService.getFirmsByUserService(userId);
        res.status(200).json({
            success: true,
            message: "Firms retrieved successfully",
            data: firms,
        });
    } catch (error) {
        wrapAndForwardError(error, next);
    }
};

export const getFirmByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const firmId = req.params.id as string | undefined;
        if (!firmId) throw new AppError("Firm id is required", 400);

        const reqUserId = req.userId as string | undefined;
        const reqRole = req.user?.role as string | undefined;
        const firm = await firmService.getFirmByIdService(firmId);
        if (!firm) throw new AppError("Firm not found", 404);

        const ownerId = (firm as any).user ?? (firm as any).owner;
        if (!isOwnerOrAdmin(reqUserId, reqRole, ownerId)) {
            throw new AppError("Forbidden", 403);
        }

        res.status(200).json({
            success: true,
            message: "Firm retrieved successfully",
            data: firm,
        });
    } catch (error) {
        wrapAndForwardError(error, next);
    }
};

export const updateFirmController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const firmId = req.params.id as string | undefined;
        const updateData = req.body;
        if (!firmId) throw new AppError("Firm id is required", 400);
        if (!updateData || Object.keys(updateData).length === 0)
            throw new AppError("Update data is required", 400);

        const reqUserId = req.userId as string | undefined;
        const reqRole = req.user?.role as string | undefined;

        const firm = await firmService.getFirmByIdService(firmId);
        if (!firm) throw new AppError("Firm not found", 404);
        const ownerId = (firm as any).user ?? (firm as any).owner;
        if (!isOwnerOrAdmin(reqUserId, reqRole, ownerId)) {
            throw new AppError("Forbidden", 403);
        }

        const updatedFirm = await firmService.updateFirmService(
            firmId,
            updateData as any
        );
        res.status(200).json({
            success: true,
            message: "Firm updated successfully",
            data: updatedFirm,
        });
    } catch (error) {
        wrapAndForwardError(error, next);
    }
};

export const deleteFirmController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const firmId = req.params.id as string | undefined;
        if (!firmId) throw new AppError("Firm id is required", 400);

        const reqUserId = req.userId as string | undefined;
        const reqRole = req.user?.role as string | undefined;
        const firm = await firmService.getFirmByIdService(firmId);
        if (!firm) throw new AppError("Firm not found", 404);
        const ownerId = (firm as any).user ?? (firm as any).owner;
        if (!isOwnerOrAdmin(reqUserId, reqRole, ownerId)) {
            throw new AppError("Forbidden", 403);
        }

        const deletedFirm = await firmService.deleteFirmService(firmId);
        res.status(200).json({
            success: true,
            message: "Firm deleted successfully",
            data: deletedFirm,
        });
    } catch (error) {
        wrapAndForwardError(error, next);
    }
};
