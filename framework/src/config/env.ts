import dotenv from 'dotenv';

dotenv.config();

// Helper function to enforce required environment variables
const getEnv = (key: string): string => {
    const value = process.env[key];
    if (!value) {
        console.error(`❌ Missing required environment variable: ${key}`);
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
        process.exit(1);
    }
    return num;
};

export const env = {
    DB_URL: getEnv('DB_URL'),
    PORT: getNumberEnv('PORT', 3000), // Defaults to 3000 if not provided
    NODE_ENV: process.env.NODE_ENV || 'development',
};
