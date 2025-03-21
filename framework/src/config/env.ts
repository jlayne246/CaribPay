import dotenv from "dotenv";
import logger from "../utils/logger";

dotenv.config({ debug: true, path: './.env'});

// console.log(process.env);

// Helper function to enforce required environment variables
const getEnv = (key: string): string => {
    const value = process.env[key];
    if (!value) {
        console.error(`❌ Missing required environment variable: ${key}`);
        logger.error(`❌ Missing required environment variable: ${key}`)
        process.exit(1);
    }
    return value;
};

// Ensure PORT is a valid number
const getNumberEnv = (key: string, defaultValue: number): number => {
    const value = process.env[key];
    if (!value) return defaultValue;
    const num = Number(value);
    if (isNaN(num)) {
        console.error(`❌ Invalid number for ${key}: ${value}`);
        logger.error(`❌ Invalid number for ${key}: ${value}`);
        process.exit(1);
    }
    return num;
};

const DB_TYPE = process.env.DB_TYPE || "postgres"; // Default to PostgreSQL

export const env = {
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
