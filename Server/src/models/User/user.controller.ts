import {
    deleteUserByIdService,
    getAllUsersService,
    getUserByIdService,
    updatedUserByIdService,
} from "./user.service";

import { Request, Response, NextFunction } from "express";
import { User } from "./User.types";
import logger from "../../utils/logger.utils";

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
