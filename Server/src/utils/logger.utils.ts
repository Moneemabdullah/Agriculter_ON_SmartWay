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

export default logger;
