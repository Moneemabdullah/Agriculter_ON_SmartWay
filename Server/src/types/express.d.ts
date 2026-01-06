// src/types/express.d.ts
import { JwtPayload } from "jsonwebtoken";

interface AuthJwtPayload extends JwtPayload {
    userId: string;
    role?: "admin" | "farmer";
}

declare module "express-serve-static-core" {
    interface Request {
        user?: AuthJwtPayload;
        userId?: string;
    }
}

export { AuthJwtPayload };
