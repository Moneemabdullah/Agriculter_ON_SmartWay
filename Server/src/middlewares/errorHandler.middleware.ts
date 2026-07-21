import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import mongoose from "mongoose";
import multer from "multer";
import { AppError } from "../utils/appError.utils";
import logger from "../utils/logger.utils";

const isDev = process.env.NODE_ENV !== "production";

function handleZodError(error: ZodError): AppError {
    return AppError.validationFailed(
        "Validation failed",
        error.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
        }))
    );
}

function handleMongooseValidationError(
    error: mongoose.Error.ValidationError
): AppError {
    const details = Object.entries(error.errors).map(([field, err]) => ({
        field,
        message: err.message,
    }));
    return AppError.validationFailed("Validation failed", details);
}

function handleMongooseCastError(error: mongoose.Error.CastError): AppError {
    return AppError.badRequest(
        `Invalid ${error.path}: ${error.value}`
    );
}

function handleMongoDuplicateKey(error: mongoose.Error): AppError {
    const err = error as unknown as { keyValue?: Record<string, unknown> };
    const key = err.keyValue ? Object.keys(err.keyValue)[0] : "field";
    return AppError.conflict(
        `Duplicate value for ${key}`,
        { field: key }
    );
}

function handleMulterError(error: multer.MulterError): AppError {
    const messages: Record<string, string> = {
        LIMIT_FILE_SIZE: "File too large",
        LIMIT_FILE_COUNT: "Too many files",
        LIMIT_UNEXPECTED_FILE: "Unexpected file field",
        LIMIT_FIELD_KEY: "Field name too long",
        LIMIT_FIELD_VALUE: "Field value too long",
        LIMIT_PART_COUNT: "Too many parts",
        LIMIT_FIELD_COUNT: "Too many fields",
    };
    return AppError.badRequest(
        messages[error.code] || "Upload error",
        { code: error.code, field: error.field }
    );
}

export const errorHandler = (
    err: Error | AppError,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    // AppError (our custom errors)
    if (err instanceof AppError) {
        logger.error(
            `${err.statusCode} ${err.code} - ${err.message} - ${_req.originalUrl} - ${_req.method}`
        );
        const body: Record<string, unknown> = {
            success: false,
            message: err.message,
            error: { code: err.code },
        };
        if (err.details !== undefined) (body.error as Record<string, unknown>).details = err.details;
        if (isDev) (body.error as Record<string, unknown>).stack = err.stack;
        res.status(err.statusCode).json(body);
        return;
    }

    // Zod validation errors
    if (err instanceof ZodError) {
        const appErr = handleZodError(err);
        logger.error(
            `${appErr.statusCode} ${appErr.code} - ${appErr.message} - ${_req.originalUrl} - ${_req.method}`
        );
        res.status(appErr.statusCode).json({
            success: false,
            message: appErr.message,
            error: {
                code: appErr.code,
                details: appErr.details,
                ...(isDev ? { stack: err.stack } : {}),
            },
        });
        return;
    }

    // Mongoose ValidationError
    if (err instanceof mongoose.Error.ValidationError) {
        const appErr = handleMongooseValidationError(err);
        logger.error(
            `${appErr.statusCode} ${appErr.code} - ${appErr.message} - ${_req.originalUrl} - ${_req.method}`
        );
        res.status(appErr.statusCode).json({
            success: false,
            message: appErr.message,
            error: {
                code: appErr.code,
                details: appErr.details,
                ...(isDev ? { stack: err.stack } : {}),
            },
        });
        return;
    }

    // Mongoose CastError (invalid ObjectId, etc.)
    if (err instanceof mongoose.Error.CastError) {
        const appErr = handleMongooseCastError(err);
        logger.error(
            `${appErr.statusCode} ${appErr.code} - ${appErr.message} - ${_req.originalUrl} - ${_req.method}`
        );
        res.status(appErr.statusCode).json({
            success: false,
            message: appErr.message,
            error: {
                code: appErr.code,
                ...(isDev ? { stack: err.stack } : {}),
            },
        });
        return;
    }

    // Mongoose duplicate key (code 11000)
    if (
        (err as unknown as { code?: number }).code === 11000
    ) {
        const appErr = handleMongoDuplicateKey(err);
        logger.error(
            `${appErr.statusCode} ${appErr.code} - ${appErr.message} - ${_req.originalUrl} - ${_req.method}`
        );
        res.status(appErr.statusCode).json({
            success: false,
            message: appErr.message,
            error: {
                code: appErr.code,
                details: appErr.details,
                ...(isDev ? { stack: err.stack } : {}),
            },
        });
        return;
    }

    // Multer errors
    if (err instanceof multer.MulterError) {
        const appErr = handleMulterError(err);
        logger.error(
            `${appErr.statusCode} ${appErr.code} - ${appErr.message} - ${_req.originalUrl} - ${_req.method}`
        );
        res.status(appErr.statusCode).json({
            success: false,
            message: appErr.message,
            error: {
                code: appErr.code,
                details: appErr.details,
                ...(isDev ? { stack: err.stack } : {}),
            },
        });
        return;
    }

    // JWT errors (from jsonwebtoken)
    if (err.name === "TokenExpiredError") {
        const appErr = AppError.unauthorized("Token expired");
        logger.error(
            `${appErr.statusCode} ${appErr.code} - ${appErr.message} - ${_req.originalUrl} - ${_req.method}`
        );
        const body: Record<string, unknown> = {
            success: false,
            message: appErr.message,
            error: { code: appErr.code },
        };
        if (isDev) (body.error as Record<string, unknown>).stack = err.stack;
        res.status(appErr.statusCode).json(body);
        return;
    }

    if (err.name === "JsonWebTokenError") {
        const appErr = AppError.unauthorized("Invalid token");
        logger.error(
            `${appErr.statusCode} ${appErr.code} - ${appErr.message} - ${_req.originalUrl} - ${_req.method}`
        );
        const body: Record<string, unknown> = {
            success: false,
            message: appErr.message,
            error: { code: appErr.code },
        };
        if (isDev) (body.error as Record<string, unknown>).stack = err.stack;
        res.status(appErr.statusCode).json(body);
        return;
    }

    // CORS errors
    if (err.message === "Not allowed by CORS") {
        const appErr = AppError.forbidden("Not allowed by CORS");
        logger.error(
            `${appErr.statusCode} ${appErr.code} - ${err.message} - ${_req.originalUrl} - ${_req.method}`
        );
        res.status(appErr.statusCode).json({
            success: false,
            message: appErr.message,
            error: { code: appErr.code },
        });
        return;
    }

    // Unexpected errors — never leak stack traces in production
    logger.error(
        `500 INTERNAL_SERVER_ERROR - ${err.message} - ${_req.originalUrl} - ${_req.method}`
    );
    if (isDev) logger.error(err.stack);

    res.status(500).json({
        success: false,
        message: "Internal server error",
        error: {
            code: "INTERNAL_SERVER_ERROR" as const,
            ...(isDev ? { stack: err.stack } : {}),
        },
    });
};
