"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDb = exports.initDb = exports.typeOrmDataSource = exports.db = exports.query = void 0;
const tslib_1 = require("tslib");
const pg_1 = require("pg"); // Imports Pool from PostgreSQL module
const promise_1 = tslib_1.__importDefault(require("mysql2/promise")); // Imports MySQL
const typeorm_1 = require("typeorm"); // Import TypeORM
const env_1 = require("./env"); // Imports the env object from env.ts
const logger_1 = tslib_1.__importDefault(require("../utils/logger")); // Imports the logger object from logger.ts
let typeOrmDataSource; // Declares typeOrmDataSource as type DataSource
let db; // Declares db as either PostgreSQL Pool or MySQL Pool 
const MAX_RETRIES = 5; // Sets the maximum number of retries when connecting to the database
const RETRY_DELAY = 2000; // Sets the retry delay to 2 seconds
const isPostgres = env_1.env.DB_TYPE === "postgres"; // Sets isPostgres to true if env.DB_TYPE is postgres and false otherwise
/**
    << initDB() >>

    Summary: This function initializes the database and TypeORM connections
    Async: true
    Visibility: external => Exported for use in other functions/modules
    Input Parameters: nil
    Return Value: nil
    Dependencies:
    - typeorm: To allow for the use of an ORM in the application, acting as an interface between the ORMs and the databases.
    - logger: To log system events within the initialization process.
    - env: To access the environment variables through the env object.
    - db: To provide a base object for the database connection
    Line Calls:
    - 53 => typeorm.initialize()
    - 73 => db.connect() [For PostgreSQL]
    Usage Example:

*/
const initDb = async () => {
    let retries = 0; // initializes the retries
    // Sets up connection to TypeORM database
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
        await typeOrmDataSource.initialize(); // initializes the TypeORM connection asynchronously
        console.log('✅ Connected to database using TypeORM!');
        logger_1.default.info('✅ Connected to database using TypeORM!');
    }
    catch (error) { // If there is an error, the error is logged and the process is exited
        console.error('❌ TypeORM connection failed:', error);
        logger_1.default.error(`❌ TypeORM connection failed: ${error}`);
        process.exit(1);
    }
    // For manual connections to the database
    while (retries < MAX_RETRIES) { // While the number of retries is less than the set maximum
        try { // This code is tried...
            if (isPostgres) { // If the database set is the PostgreSQL
                console.log('DB_URL:', process.env.DB_URL);
                exports.db = db = new pg_1.Pool({
                    connectionString: env_1.env.DB_URL,
                    ssl: { rejectUnauthorized: false }, // Required for Neon
                });
                await db.connect(); // Tries to connect the database async
                console.log("✅ Connected to Neon PostgreSQL successfully!");
                logger_1.default.info("✅ Connected to Neon PostgreSQL successfully!");
            }
            else { // If the database is set to MySQL
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
        catch (error) { // If either database connection attempt fails...
            retries++; // Increment retries
            console.error(`❌ Database connection failed (Attempt ${retries}/${MAX_RETRIES}):`, error);
            logger_1.default.error(`❌ Database connection failed (Attempt ${retries}/${MAX_RETRIES}): ${error}`);
            if (retries < MAX_RETRIES) { // If the retries are still less than the maximum
                console.log(`🔄 Retrying in ${RETRY_DELAY / 1000} seconds...`);
                await new Promise((res) => setTimeout(res, RETRY_DELAY)); // Delays the loop by the set amount using a Promise
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
/**
    << closeDB() >>

    Summary: This function closes the database connection on shutdown
    Async: true
    Visibility: external => Exported for use in other functions/modules
    Input Parameters: nil
    Return Value: nil
    Dependencies:
    - logger: To log system events within the initialization process.
    - db: To provide a base object for the database connection
    - typeOrmDataSource: To access the TypeORM connection
    Line Calls:
    - 132, 134 => db.end()
    - 141 => typeOrmDataSource.destroy()
    Usage Example:

*/
const closeDb = async () => {
    if (db) { // If there is a DB connection active...
        if (isPostgres) { // and if that DB connection is PostgreSQL...
            await db.end(); // end the connection
        }
        else { // otherwise, and it is MySQL...
            await db.end(); // End the connection
        }
        console.log("🔌 Database connection closed.");
        logger_1.default.info("🔌 Database connection closed.");
    }
    if (typeOrmDataSource) { // If there is an active TypeORM connection...
        await typeOrmDataSource.destroy(); // End the connection
        console.log('🔌 TypeORM connection closed.');
        logger_1.default.info('🔌 TypeORM connection closed.');
    }
};
exports.closeDb = closeDb;
/**
    << query() >>

    Summary: This function acts as a wrapper function to log queries
    Async: true
    Visibility: external => Exported for use in other functions/modules
    Input Parameters:
    - text: [string] => This holds the text or template of the query
    - params: [any or undefined] => This holds any parameters for the query
    Return Value: nil
    Dependencies:
    - logger: To log system events within the initialization process.
    - db: To provide a base object for the database connection
    - typeOrmDataSource: To access the TypeORM connection
    Line Calls:
    - 132, 134 => db.end()
    - 141 => typeOrmDataSource.destroy()
    Usage Example:

*/
const query = async (text, params) => {
    try { // This code is attempted as a unit
        console.log(`📡 Executing Query: ${text} ${params ? JSON.stringify(params) : ""}`); // Logs the query in the console
        logger_1.default.info(`📡 Executing Query: ${text} ${params ? JSON.stringify(params) : ""}`); // Logs the query in the system logs
        if (isPostgres) { // If the DB is PostgreSQL 
            return await db.query(text, params); // Returns rhe query result object of the PostgreSQL query
        }
        else {
            const [rows] = await db.query(text, params);
            return rows; // Returns the query result object of the MySQL query
        }
    }
    catch (error) { // If there is an error... logs the errors in console and system logs
        console.error("❌ Query Error:", error);
        logger_1.default.error(`❌ Query Error: ${error}`);
        throw error; // Throws the received error
    }
};
exports.query = query;
