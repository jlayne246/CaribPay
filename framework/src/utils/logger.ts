import {createLogger, format, transports} from 'winston';
import path from 'path';

const logDir = path.resolve(__dirname, '../../../');

const logger = createLogger({
    level: "info",
    format: format.combine(
        format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        format.printf(({timestamp, level, message}) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
    ),
    transports: [
        new transports.Console(),
        new transports.File({filename: path.join(logDir, 'sys/logs/error.log'), level: 'error'}),
        new transports.File({filename: path.join(logDir, 'sys/logs/combined.log')})
    ]
});

export default logger;