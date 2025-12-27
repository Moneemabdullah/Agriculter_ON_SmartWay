import * as authservice from "./auth.service";
import { Request, Response } from "express";

export const signUpController = async (req: Request, res: Response) => {
    try {
        const user = req.body;
        const createdUser = await authservice.signUpService(user);
        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: createdUser,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: (error as Error).message,
        });
    }
};

export const signInController = async (req: Request, res: Response) => {
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
        res.status(400).json({
            success: false,
            message: (error as Error).message,
        });
    }
};

export const meController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(400).json({ success: false, message: 'User id missing' });
        }

        const user = await authservice.getUserById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({ success: false, message: (error as Error).message });
    }
};
