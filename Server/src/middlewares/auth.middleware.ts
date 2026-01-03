import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import config from "../config/env.config";
import logger from "../utils/logger.utils";
import UserModel from "../models/User/user.models";

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload & { role?: string };
            userId?: string;
        }
    }
}

const auth =
    (...roles: ("admin" | "farmer")[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;
            logger.info(`Auth Header: ${authHeader}`);
            if (!authHeader) {
                return res.status(401).json({
                    message: "Authorization token missing",
                });
            }

            // Expect: Bearer <token>
            if (!authHeader.startsWith("Bearer ")) {
                return res.status(401).json({
                    message: "Invalid authorization format",
                });
            }

            const token = authHeader.split(" ")[1];

            const decoded = jwt.verify(
                token as string,
                config.jwtSecret as string
            ) as unknown as JwtPayload & { role?: string };

            // If token doesn't contain role (older tokens), try to fetch from DB
            if (!decoded.role) {
                try {
                    const user = await UserModel.findById(decoded.userId).select("role").lean();
                    (decoded as any).role = (user as any)?.role || "farmer";
                    logger.info(`Role filled from DB: ${(decoded as any).role}`);
                } catch (dbErr) {
                    // fallback to a sensible default
                    (decoded as any).role = "farmer";
                    logger.warn("Failed to fetch user role from DB, defaulting to 'farmer'");
                }
            }

            req.user = decoded;

            logger.info(`Decoded JWT: ${JSON.stringify(decoded)}`);

            if (roles.length && !roles.includes(decoded.role as any)) {
                return res.status(403).json({
                    message: "Forbidden: insufficient permissions",
                });
            }
            req.userId = decoded.userId;
            next();
        } catch (err: any) {
            return res.status(401).json({
                message: "Invalid or expired token",
                error: err.message,
            });
        }
    };

export default auth;