import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import config from "../config/env.config";
import logger from "../utils/logger.utils";
import UserModel from "../models/User/user.models";

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
                    message: "Authorization token missing",
                });
                return;
            }

            if (!authHeader.startsWith("Bearer ")) {
                res.status(401).json({
                    message: "Invalid authorization format",
                });
                return;
            }

            const token = authHeader.split(" ")[1];

            if (!token) {
                res.status(401).json({
                    message: "Invalid authorization format",
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
                    message: "User not found",
                });
                return;
            }

            if (user.isBanned) {
                res.status(403).json({
                    message: "Your account has been banned",
                });
                return;
            }

            decoded.role = decoded.role ?? user.role ?? "farmer";

            req.user = decoded;
            req.userId = decoded.userId;

            if (roles.length && !roles.includes(decoded.role)) {
                res.status(403).json({
                    message: "Forbidden: insufficient permissions",
                });
                return;
            }

            next();
        } catch (error) {
            logger.warn("JWT auth failed", error);
            res.status(401).json({ message: "Invalid or expired token" });
        }
    };

export default auth;
