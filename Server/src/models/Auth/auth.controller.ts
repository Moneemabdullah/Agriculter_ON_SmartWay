import { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/appError.utils";
import * as authservice from "./auth.service";

export const signUpController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.body;
        const createdUser = await authservice.signUpService(user);
        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: createdUser,
        });
    } catch (error) {
        next(error);
    }
};

export const signInController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Accept either phone or email as identifier
        const { identifier, password } = req.body;
        const result = await authservice.signInService(identifier, password);
        res.status(200).json({
            success: true,
            message: "User signed in successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const meController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new AppError("User id missing", 400);
        }

        const user = await authservice.getUserById(userId);

        if (!user) {
            throw new AppError("User not found", 404);
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

export const changePasswordController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, oldPassword, newPassword } = req.body;
        if (!email || !oldPassword || !newPassword) {
            throw new AppError("Email, old password, and new password are required", 400);
        }
        if (newPassword.length < 6) {
            throw new AppError("New password must be at least 6 characters", 400);
        }
        await authservice.changePasswordService(email, oldPassword, newPassword);
        res.status(200).json({ success: true, message: "Password changed successfully" });
    } catch (error) {
        next(error);
    }
};
