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
        const { phone, password } = req.body;
        const result = await authservice.signInService(phone, password);
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
