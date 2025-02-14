"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const tslib_1 = require("tslib");
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
const logger_1 = tslib_1.__importDefault(require("../utils/logger"));
dotenv_1.default.config({ debug: true, path: './.env' });
// console.log(process.env);
// Helper function to enforce required environment variables
const getEnv = (key) => {
    const value = process.env[key];
    if (!value) {
        console.error(`❌ Missing required environment variable: ${key}`);
        logger_1.default.error(`❌ Missing required environment variable: ${key}`);
        process.exit(1);
    }
    return value;
};
// Ensure PORT is a valid number
const getNumberEnv = (key, defaultValue) => {
    const value = process.env[key];
    if (!value)
        return defaultValue;
    const num = Number(value);
    if (isNaN(num)) {
        console.error(`❌ Invalid number for ${key}: ${value}`);
        logger_1.default.error(`❌ Invalid number for ${key}: ${value}`);
        process.exit(1);
    }
    return num;
};
const DB_TYPE = process.env.DB_TYPE || "postgres"; // Default to PostgreSQL
exports.env = {
    DB_TYPE,
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: getNumberEnv("PORT", 3000), // Defaults to 3000 if not provided
    // PostgreSQL (Neon)
    DB_URL: DB_TYPE === "postgres" ? getEnv("DB_URL") : "",
    // MySQL (Local)
    DB_HOST: DB_TYPE === "mysql" ? getEnv("DB_HOST") : "",
    DB_PORT: DB_TYPE === "mysql" ? getNumberEnv("DB_PORT", 3306) : 3306,
    DB_USER: DB_TYPE === "mysql" ? getEnv("DB_USER") : "",
    DB_PASS: DB_TYPE === "mysql" ? getEnv("DB_PASS") : "",
    DB_NAME: DB_TYPE === "mysql" ? getEnv("DB_NAME") : "",
};
