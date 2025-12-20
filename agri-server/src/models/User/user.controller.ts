import {
    deleteUserByIdService,
    getAllUsersService,
    getUserByIdService,
} from "./user.service";
import { Request, Response, NextFunction } from "express";
import { User } from "./User.types";

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
