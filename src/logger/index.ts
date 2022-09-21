import { createLogger, format, LogCallback, Logger, transports } from 'winston';

const { printf, combine, timestamp, colorize, errors } = format;

export enum WinstonLevel {
	ERROR = 'error',
	WARN = 'warn',
	INFO = 'info',
	HTTP = 'http',
	VERBOSE = 'verbose',
	DEBUG = 'debug',
	SILLY = 'silly',
}

const logFormat = printf(({ level, message, timestamp, stack }) => {
	return `${timestamp} ${level}: ${stack || message}`;
});

export const logger = createLogger({
	level: WinstonLevel.DEBUG,
	format: combine(
		errors({ stack: true }),
		colorize(),
		timestamp({
			format: 'YYYY-MM-DD HH:mm:ss',
		}),
		logFormat
	),
	transports: [new transports.Console()],
});

export const customLogger = (
	level: WinstonLevel,
	message: string,
	callback?: LogCallback
): Logger => {
	return logger.log(level, message, callback);
};
