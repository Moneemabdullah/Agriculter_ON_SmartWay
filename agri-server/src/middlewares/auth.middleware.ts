import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import config from "../config/env.config.ts";

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload & { role?: string };
        }
    }
}

const auth =
    (...roles: ("admin" | "user")[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader) {
                return res.status(401).json({
                    message: "Authorization token missing",
                });
            }

            // Expect: Bearer <token>
            const token = authHeader.split(" ")[1];

            if (!token) {
                return res.status(401).json({
                    message: "Invalid authorization format",
                });
            }

            const decoded = jwt.verify(
                token,
                config.jwtSecret as string
            ) as JwtPayload & { role: string };

            req.user = decoded;

            // Role check
            if (roles.length && !roles.includes(decoded.role as any)) {
                return res.status(403).json({
                    message: "Forbidden: insufficient permissions",
                });
            }

            next();
        } catch (err: any) {
            return res.status(401).json({
                message: "Invalid or expired token",
                error: err.message,
            });
        }
    };

export default auth;
