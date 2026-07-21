export type ErrorCode =
    | "VALIDATION_ERROR"
    | "NOT_FOUND"
    | "UNAUTHORIZED"
    | "FORBIDDEN"
    | "CONFLICT"
    | "BAD_REQUEST"
    | "TOO_MANY_REQUESTS"
    | "INTERNAL_SERVER_ERROR";

export class AppError extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean;
    code: ErrorCode;
    details?: unknown;

    constructor(
        message: string,
        statusCode: number,
        code?: ErrorCode,
        details?: unknown
    ) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true;
        this.code = code || "INTERNAL_SERVER_ERROR";
        if (details !== undefined) this.details = details;

        Error.captureStackTrace(this, this.constructor);
    }

    static badRequest(message: string, details?: unknown): AppError {
        return new AppError(message, 400, "BAD_REQUEST", details);
    }

    static unauthorized(message: string): AppError {
        return new AppError(message, 401, "UNAUTHORIZED");
    }

    static forbidden(message: string): AppError {
        return new AppError(message, 403, "FORBIDDEN");
    }

    static notFound(message: string): AppError {
        return new AppError(message, 404, "NOT_FOUND");
    }

    static conflict(message: string, details?: unknown): AppError {
        return new AppError(message, 409, "CONFLICT", details);
    }

    static validationFailed(
        message: string,
        details?: unknown
    ): AppError {
        return new AppError(message, 422, "VALIDATION_ERROR", details);
    }

    static tooManyRequests(
        message: string = "Too many requests. Please try again later."
    ): AppError {
        return new AppError(message, 429, "TOO_MANY_REQUESTS");
    }

    static internal(message: string = "Internal server error"): AppError {
        return new AppError(message, 500, "INTERNAL_SERVER_ERROR");
    }
}
