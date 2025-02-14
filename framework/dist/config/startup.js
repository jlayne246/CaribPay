"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startup = void 0;
const tslib_1 = require("tslib");
const db_1 = require("./db");
const logger_1 = tslib_1.__importDefault(require("../utils/logger"));
const startup = async () => {
    console.log('🚀 Starting Application...');
    logger_1.default.info("Starting application framework!");
    await (0, db_1.initDb)(); // Initialize database connection
    console.log('✅ Framework initialized successfully!');
    logger_1.default.info('Framework initialized successfully!');
};
exports.startup = startup;
