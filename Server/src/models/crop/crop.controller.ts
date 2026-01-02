import * as cropservice from "./crop.service";
import { Request, Response } from "express";

export const addCropController = async (req: Request, res: Response) => {
    try {
        const cropData = req.body;
        const newCrop = await cropservice.addCrop(cropData);
        res.status(200).json({
            success: true,
            message: "Crop added successfully",
            data: newCrop,
        });
    } catch (error) {
        res.status(500).json({ message: "Error adding crop", error });
    }
};

export const getAllCropsController = async (req: Request, res: Response) => {
    try {
        const crops = await cropservice.getAllCrops();
        res.status(200).json({
            success: true,
            message: "Crops retrieved successfully",
            data: crops,
        });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving crops", error });
    }
};
export const getCropByNameController = async (req: Request, res: Response) => {
    try {
        const name = req.params.name;
        const crop = await cropservice.getCropByName(name as string);
        res.status(200).json({
            success: true,
            message: "Crop retrieved successfully",
            data: crop,
        });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving crop", error });
    }
};
export const deleteCropByIdController = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const deletedCrop = await cropservice.deleteCropById(id as string);
        res.status(200).json({
            success: true,
            message: "Crop deleted successfully",
            data: deletedCrop,
        });
    } catch (error) {
        res.status(500).json({ message: "Error deleting crop", error });
    }
};

export const updateCropByIdController = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const updateData = req.body;
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
        res.status(500).json({ message: "Error updating crop", error });
    }
};
