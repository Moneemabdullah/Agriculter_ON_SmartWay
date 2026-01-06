import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import config from "../config/env.config";
import logger from "../utils/logger.utils";
import UserModel from "../models/User/user.models";

interface AuthJwtPayload extends JwtPayload {
    userId: string;
    role?: "admin" | "farmer";
}

const auth =
    (...roles: ("admin" | "farmer")[]) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || typeof authHeader !== "string") {
                res.status(401).json({
                    message: "Authorization token missing",
                });
                return;
            }
            // logger.info("Authorization header found: " + authHeader);
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

            if (!decoded.role) {
                const user = await UserModel.findById(decoded.userId)
                    .select("role")
                    .lean<{ role?: "admin" | "farmer" }>();

                decoded.role = user?.role ?? "farmer";
            }

            req.user = decoded;
            req.userId = decoded.userId;

            if (roles.length && !roles.includes(decoded.role)) {
                res.status(403).json({
                    message: "Forbidden: insufficient permissions",
                });
                return;
            }

            // logger.info(
            //     `User ${decoded.userId} authenticated with role ${decoded.role}`
            // );

            next();
        } catch (error) {
            logger.warn("JWT auth failed", error);
            res.status(401).json({ message: "Invalid or expired token" });
        }
    };

export default auth;
