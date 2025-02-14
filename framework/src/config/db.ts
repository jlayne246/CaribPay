import { Pool } from "pg"; // Imports Pool from PostgreSQL module
import mysql, { Pool as MySQLPool } from "mysql2/promise"; // Imports MySQL
import { createConnection, DataSource } from 'typeorm'; // Import TypeORM
import { env } from "./env"; // Imports the env object from env.ts
import logger from "../utils/logger"; // Imports the logger object from logger.ts

let typeOrmDataSource: DataSource; // Declares typeOrmDataSource as type DataSource

let db: Pool | MySQLPool; // Declares db as either PostgreSQL Pool or MySQL Pool 
const MAX_RETRIES = 5; // Sets the maximum number of retries when connecting to the database
const RETRY_DELAY = 2000; // Sets the retry delay to 2 seconds

const isPostgres = env.DB_TYPE === "postgres"; // Sets isPostgres to true if env.DB_TYPE is postgres and false otherwise

/* 
    << initDB() >>

    Summary: This function initializes the database and TypeORM connections
    Type: async
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
        typeOrmDataSource = new DataSource({ // Declares typeOrmDataSource as new DataSource
            type: env.DB_TYPE === 'postgres' ? 'postgres' : 'mysql',
            host: env.DB_HOST,
            port: env.DB_PORT,
            username: env.DB_USER,
            password: env.DB_PASS,
            database: env.DB_NAME,
            entities: [
                // List of entities for TypeORM
            ],
            synchronize: true,
            logging: true,
        });

        await typeOrmDataSource.initialize(); // initializes the TypeORM connection asynchronously
        console.log('✅ Connected to database using TypeORM!');
        logger.info('✅ Connected to database using TypeORM!');
    } catch (error) { // If there is an error, the error is logged and the process is exited
        console.error('❌ TypeORM connection failed:', error);
        logger.error(`❌ TypeORM connection failed: ${error}`);
        process.exit(1);
    }

    // For manual connections to the database
    while (retries < MAX_RETRIES) { // While the number of retries is less than the set maximum
        try { // This code is tried...
            if (isPostgres) { // If the database set is the PostgreSQL
                console.log('DB_URL:', process.env.DB_URL);

                db = new Pool({ // Creates the PostgreSQL manual database connection object using the URL
                    connectionString: env.DB_URL,
                    ssl: { rejectUnauthorized: false }, // Required for Neon
                });

                await db.connect(); // Tries to connect the database async
                console.log("✅ Connected to Neon PostgreSQL successfully!");
                logger.info("✅ Connected to Neon PostgreSQL successfully!");
            } else { // If the database is set to MySQL
                console.log('DB_URL:', process.env.DB_URL);

                db = await mysql.createPool({ // Creates the MySQL manual database connection object using the following environment variables
                    host: env.DB_HOST,
                    port: Number(env.DB_PORT),
                    user: env.DB_USER,
                    password: env.DB_PASS,
                    database: env.DB_NAME,
                    waitForConnections: true,
                    connectionLimit: 10,
                    queueLimit: 0,
                });

                console.log("✅ Connected to MySQL successfully!");
                logger.info("✅ Connected to MySQL successfully!");
            }

            return;
        } catch (error) { // If either database connection attempt fails...
            retries++; // Increment retries
            console.error(`❌ Database connection failed (Attempt ${retries}/${MAX_RETRIES}):`, error);
            logger.error(`❌ Database connection failed (Attempt ${retries}/${MAX_RETRIES}): ${error}`);

            if (retries < MAX_RETRIES) { // If the retries are still less than the maximum
                console.log(`🔄 Retrying in ${RETRY_DELAY / 1000} seconds...`);
                await new Promise((res) => setTimeout(res, RETRY_DELAY)); // Delays the loop by the set amount using a Promise
            } else {
                console.error("❌ Max retries reached. Exiting...");
                logger.error("❌ Max retries reached. Exiting...");
                process.exit(1); // Stop the app if DB is unreachable
            }
        }
    }
};

/* 
    << closeDB() >>

    Summary: This function closes the database connection on shutdown
    Type: async
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
    if (db) {
        if (isPostgres) {
            await (db as Pool).end();
        } else {
            await (db as MySQLPool).end();
        }
        console.log("🔌 Database connection closed.");
        logger.info("🔌 Database connection closed.");
    }

    if (typeOrmDataSource) {
        await typeOrmDataSource.destroy();
        console.log('🔌 TypeORM connection closed.');
        logger.info('🔌 TypeORM connection closed.');
    }
};

// Wrapper function to log queries
export const query = async (text: string, params?: any[]) => {
    try {
        console.log(`📡 Executing Query: ${text} ${params ? JSON.stringify(params) : ""}`);
        logger.info(`📡 Executing Query: ${text} ${params ? JSON.stringify(params) : ""}`);

        if (isPostgres) {
            return await (db as Pool).query(text, params);
        } else {
            const [rows] = await (db as MySQLPool).query(text, params);
            return rows;
        }
    } catch (error) {
        console.error("❌ Query Error:", error);
        logger.error(`❌ Query Error: ${error}`);
        throw error;
    }
};

export { db, typeOrmDataSource, initDb, closeDb };
