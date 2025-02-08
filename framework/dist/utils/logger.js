"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const winston_1 = require("winston");
const path_1 = tslib_1.__importDefault(require("path"));
const logDir = path_1.default.resolve(__dirname, '../../../');
const logger = (0, winston_1.createLogger)({
    level: "info",
    format: winston_1.format.combine(winston_1.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)),
    transports: [
        new winston_1.transports.Console(),
        new winston_1.transports.File({ filename: path_1.default.join(logDir, 'sys/logs/error.log'), level: 'error' }),
        new winston_1.transports.File({ filename: path_1.default.join(logDir, 'sys/logs/combined.log') })
    ]
});
exports.default = logger;
