import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import config from "../config/env.config";
import logger from "../utils/logger.utils";

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
            ) as unknown as JwtPayload & { role: string };

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
