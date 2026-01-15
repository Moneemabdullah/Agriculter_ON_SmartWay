import {
    deleteUserByIdService,
    getAllUsersService,
    getUserByIdService,
    updatedUserByIdService,
} from "./user.service";

import { NextFunction, Request, Response } from "express";
import logger from "../../utils/logger.utils";
import { User } from "./User.types";

//* Update user profile photo
export const updateProfilePhotoController = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.userId || (req as any).userId;

        logger.info("Profile photo update attempt for user:", userId);
        logger.info("File info:", req.file);

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized - User ID not found",
            });
            return;
        }

        if (!req.file) {
            res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
            return;
        }

        if (!req.file.path) {
            logger.error(
                "File uploaded but no path from Cloudinary:",
                req.file
            );
            res.status(400).json({
                success: false,
                message: "File upload failed - no path returned",
            });
            return;
        }

        const updateData: Partial<User> = {
            photo: req.file.path, // Cloudinary URL
        };

        logger.info("Updating user", userId, "with photo:", req.file.path);

        const result: User = (await updatedUserByIdService(
            userId,
            updateData
        )) as User;

        res.status(200).json({
            success: true,
            message: "Profile photo updated successfully",
            data: result,
        });
    } catch (error) {
        logger.error("Error updating profile photo:", error);
        next(error);
    }
};

//* Get all users
export const getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const result = await getAllUsersService();

        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

//* Get user by id
export const getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = req.params.id;
        const result: User = (await getUserByIdService(id as string)) as User;
        res.status(200).json({
            success: true,
            message: "User retrieved successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};
//* Update user by id
//* Update user by id
export const updateUserByIdcontroller = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = req.params.id;

        // Start with body data
        const updateData: Partial<User> = { ...req.body };

        // 🔑 Add this: attach photo if uploaded
        if (req.file) {
            updateData.photo = req.file.path; // Cloudinary URL
        }

        logger.info("Update Data:", updateData);

        const result: User = (await updatedUserByIdService(
            id as string,
            updateData
        )) as User;

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

//* Delete user by id
export const deleteUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = req.params.id;
        const result: User = (await deleteUserByIdService(
            id as string
        )) as User;
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};
