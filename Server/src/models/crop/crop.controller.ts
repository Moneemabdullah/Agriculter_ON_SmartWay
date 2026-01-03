import { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/appError.utils";
import logger from "../../utils/logger.utils";
import * as cropservice from "./crop.service";

export const addCropController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const cropData = req.body;
        if (!cropData || Object.keys(cropData).length === 0) {
            throw new AppError("Crop data is required", 400);
        }

        logger.info("Crop Data:", cropData);
        const newCrop = await cropservice.addCrop(cropData);
        res.status(200).json({
            success: true,
            message: "Crop added successfully",
            data: newCrop,
        });
    } catch (error) {
        next(error);
    }
};

export const getAllCropsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const crops = await cropservice.getAllCrops();
        res.status(200).json({
            success: true,
            message: "Crops retrieved successfully",
            data: crops,
        });
    } catch (error) {
        next(error);
    }
};

export const getCropByNameController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const name = req.params.name;
        if (!name) {
            throw new AppError("Crop name is required", 400);
        }

        const crop = await cropservice.getCropByName(name as string);
        res.status(200).json({
            success: true,
            message: "Crop retrieved successfully",
            data: crop,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteCropByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const id = req.params.id;
        if (!id) {
            throw new AppError("Crop ID is required", 400);
        }

        const deletedCrop = await cropservice.deleteCropById(id as string);
        res.status(200).json({
            success: true,
            message: "Crop deleted successfully",
            data: deletedCrop,
        });
    } catch (error) {
        next(error);
    }
};

export const updateCropByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const id = req.params.id;
        const updateData = req.body;

        if (!id) {
            throw new AppError("Crop ID is required", 400);
        }
        if (!updateData || Object.keys(updateData).length === 0) {
            throw new AppError("Update data is required", 400);
        }

        const updatedCrop = await cropservice.updateCropById(
            id as string,
            updateData
        );
        res.status(200).json({
            success: true,
            message: "Crop updated successfully",
            data: updatedCrop,
        });
    } catch (error) {
        next(error);
    }
};
