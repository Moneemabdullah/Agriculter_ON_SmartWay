import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import config from "../config/env.config";
import logger from "../utils/logger.utils";
import UserModel from "../models/User/user.models";
import { AppError } from "../utils/appError.utils";

interface AuthJwtPayload extends JwtPayload {
    userId: string;
    role?: "admin" | "farmer" | "viewer";
}

const auth =
    (...roles: ("admin" | "farmer" | "viewer")[]) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || typeof authHeader !== "string") {
                res.status(401).json({
                    success: false,
                    message: "Authorization token missing",
                    error: { code: "UNAUTHORIZED" },
                });
                return;
            }

            if (!authHeader.startsWith("Bearer ")) {
                res.status(401).json({
                    success: false,
                    message: "Invalid authorization format",
                    error: { code: "UNAUTHORIZED" },
                });
                return;
            }

            const token = authHeader.split(" ")[1];

            if (!token) {
                res.status(401).json({
                    success: false,
                    message: "Invalid authorization format",
                    error: { code: "UNAUTHORIZED" },
                });
                return;
            }

            const decoded = jwt.verify(
                token,
                config.jwtSecret as string
            ) as unknown as AuthJwtPayload;

            const user = await UserModel.findById(decoded.userId)
                .select("role isBanned")
                .lean<{ role?: "admin" | "farmer" | "viewer"; isBanned?: boolean }>();

            if (!user) {
                res.status(401).json({
                    success: false,
                    message: "User not found",
                    error: { code: "UNAUTHORIZED" },
                });
                return;
            }

            if (user.isBanned) {
                res.status(403).json({
                    success: false,
                    message: "Your account has been banned",
                    error: { code: "FORBIDDEN" },
                });
                return;
            }

            decoded.role = decoded.role ?? user.role ?? "farmer";

            req.user = decoded;
            req.userId = decoded.userId;

            if (roles.length && !roles.includes(decoded.role)) {
                res.status(403).json({
                    success: false,
                    message: "Forbidden: insufficient permissions",
                    error: { code: "FORBIDDEN" },
                });
                return;
            }

            next();
        } catch (error) {
            logger.warn("JWT auth failed:", (error as Error).message);
            res.status(401).json({
                success: false,
                message: "Invalid or expired token",
                error: { code: "UNAUTHORIZED" },
            });
        }
    };

export default auth;
