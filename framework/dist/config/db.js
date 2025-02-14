"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDb = exports.initDb = exports.typeOrmDataSource = exports.db = exports.query = void 0;
const tslib_1 = require("tslib");
const pg_1 = require("pg");
const promise_1 = tslib_1.__importDefault(require("mysql2/promise"));
const typeorm_1 = require("typeorm"); // Import TypeORM
const env_1 = require("./env");
const logger_1 = tslib_1.__importDefault(require("../utils/logger"));
let typeOrmDataSource;
let db;
const MAX_RETRIES = 5;
const RETRY_DELAY = 2000; // 2 seconds
const isPostgres = env_1.env.DB_TYPE === "postgres";
const initDb = async () => {
    let retries = 0;
    // Set up connection to TypeORM database
    try {
        // TypeORM dynamic configuration based on DB_TYPE
        exports.typeOrmDataSource = typeOrmDataSource = new typeorm_1.DataSource({
            type: env_1.env.DB_TYPE === 'postgres' ? 'postgres' : 'mysql',
            host: env_1.env.DB_HOST,
            port: env_1.env.DB_PORT,
            username: env_1.env.DB_USER,
            password: env_1.env.DB_PASS,
            database: env_1.env.DB_NAME,
            entities: [
            // List of entities for TypeORM
            ],
            synchronize: true,
            logging: true,
        });
        await typeOrmDataSource.initialize();
        console.log('✅ Connected to database using TypeORM!');
        logger_1.default.info('✅ Connected to database using TypeORM!');
    }
    catch (error) {
        console.error('❌ TypeORM connection failed:', error);
        logger_1.default.error(`❌ TypeORM connection failed: ${error}`);
        process.exit(1);
    }
    // For manual connections to the database
    while (retries < MAX_RETRIES) {
        try {
            if (isPostgres) {
                console.log('DB_URL:', process.env.DB_URL);
                exports.db = db = new pg_1.Pool({
                    connectionString: env_1.env.DB_URL,
                    ssl: { rejectUnauthorized: false }, // Required for Neon
                });
                await db.connect();
                console.log("✅ Connected to Neon PostgreSQL successfully!");
                logger_1.default.info("✅ Connected to Neon PostgreSQL successfully!");
            }
            else {
                console.log('DB_URL:', process.env.DB_URL);
                exports.db = db = await promise_1.default.createPool({
                    host: env_1.env.DB_HOST,
                    port: Number(env_1.env.DB_PORT),
                    user: env_1.env.DB_USER,
                    password: env_1.env.DB_PASS,
                    database: env_1.env.DB_NAME,
                    waitForConnections: true,
                    connectionLimit: 10,
                    queueLimit: 0,
                });
                console.log("✅ Connected to MySQL successfully!");
                logger_1.default.info("✅ Connected to MySQL successfully!");
            }
            return;
        }
        catch (error) {
            retries++;
            console.error(`❌ Database connection failed (Attempt ${retries}/${MAX_RETRIES}):`, error);
            logger_1.default.error(`❌ Database connection failed (Attempt ${retries}/${MAX_RETRIES}): ${error}`);
            if (retries < MAX_RETRIES) {
                console.log(`🔄 Retrying in ${RETRY_DELAY / 1000} seconds...`);
                await new Promise((res) => setTimeout(res, RETRY_DELAY));
            }
            else {
                console.error("❌ Max retries reached. Exiting...");
                logger_1.default.error("❌ Max retries reached. Exiting...");
                process.exit(1); // Stop the app if DB is unreachable
            }
        }
    }
};
exports.initDb = initDb;
// Close DB connection on shutdown
const closeDb = async () => {
    if (db) {
        if (isPostgres) {
            await db.end();
        }
        else {
            await db.end();
        }
        console.log("🔌 Database connection closed.");
        logger_1.default.info("🔌 Database connection closed.");
    }
    if (typeOrmDataSource) {
        await typeOrmDataSource.destroy();
        console.log('🔌 TypeORM connection closed.');
        logger_1.default.info('🔌 TypeORM connection closed.');
    }
};
exports.closeDb = closeDb;
// Wrapper function to log queries
const query = async (text, params) => {
    try {
        console.log(`📡 Executing Query: ${text} ${params ? JSON.stringify(params) : ""}`);
        logger_1.default.info(`📡 Executing Query: ${text} ${params ? JSON.stringify(params) : ""}`);
        if (isPostgres) {
            return await db.query(text, params);
        }
        else {
            const [rows] = await db.query(text, params);
            return rows;
        }
    }
    catch (error) {
        console.error("❌ Query Error:", error);
        logger_1.default.error(`❌ Query Error: ${error}`);
        throw error;
    }
};
exports.query = query;
