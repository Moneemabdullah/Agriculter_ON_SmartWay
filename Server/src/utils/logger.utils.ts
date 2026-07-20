import winston from "winston";

const isVercel = !!process.env.VERCEL;

const transports: winston.transport[] = [
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        ),
    }),
];

if (!isVercel) {
    transports.push(
        new winston.transports.File({
            filename: "logs/combined.log",
        }),
        new winston.transports.File({
            filename: "logs/error.log",
            level: "error",
        })
    );
}

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
    ),
    transports,
});

const SENSITIVE_FIELDS = [
    "password",
    "newPassword",
    "currentPassword",
    "oldPassword",
    "token",
    "accessToken",
    "refreshToken",
    "authorization",
    "secret",
    "apiKey",
    "deviceKey",
];

const SENSITIVE_PATTERN = new RegExp(
    `^(${SENSITIVE_FIELDS.join("|")})$`,
    "i"
);

export function sanitizeLogBody(body: unknown): unknown {
    if (!body || typeof body !== "object") return body;

    if (Array.isArray(body)) {
        return body.map(sanitizeLogBody);
    }

    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(body)) {
        if (SENSITIVE_PATTERN.test(key)) {
            sanitized[key] = "[REDACTED]";
        } else if (typeof value === "object" && value !== null) {
            sanitized[key] = sanitizeLogBody(value);
        } else {
            sanitized[key] = value;
        }
    }
    return sanitized;
}

export default logger;
