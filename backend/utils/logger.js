import winston from "winston";

const { combine, timestamp, printf, colorize } = winston.format;

const myFormat = printf(({ level, message, timestamp }) => {
    return `[${timestamp}] [${level}]: ${message}`;
});

const logger = winston.createLogger({
    level: process.env.NODE_ENV === "development" ? "debug" : "info",
    format: combine(
        timestamp(),
        myFormat
    ),
    transports: [
        new winston.transports.Console({
            format: combine(
                colorize(),
                timestamp(),
                myFormat
            )
        }),
        // add file transports
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        // new winston.transports.File({ filename: 'combined.log' })
    ]
});

export default logger;
