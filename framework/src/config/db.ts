import { Pool } from 'pg';
import { env } from './env';
import logger from '../utils/logger';

let db: Pool;

const MAX_RETRIES = 5;
const RETRY_DELAY = 2000; // 2 seconds

const initDb = async () => {
    let retries = 0;

    while (retries < MAX_RETRIES) {
        try {
            db = new Pool({
                connectionString: env.DB_URL,
                ssl: { rejectUnauthorized: false }, // Required for Neon
            });

            await db.connect();
            console.log('✅ Connected to Neon PostgreSQL successfully!');
            logger.info('✅ Connected to Neon PostgreSQL successfully!');
            return;
        } catch (error) {
            retries++;
            console.error(`❌ Database connection failed (Attempt ${retries}/${MAX_RETRIES}):`, error);
            logger.error(`❌ Database connection failed (Attempt ${retries}/${MAX_RETRIES}): ${error}`);

            if (retries < MAX_RETRIES) {
                console.log(`🔄 Retrying in ${RETRY_DELAY / 1000} seconds...`);
                await new Promise((res) => setTimeout(res, RETRY_DELAY));
            } else {
                console.error('❌ Max retries reached. Exiting...');
                logger.error('❌ Max retries reached. Exiting...');
                process.exit(1); // Stop the app if DB is unreachable
            }
        }
    }
};

// Wrapper function to log queries
export const query = async (text: string, params?: any[]) => {
    try {
        console.log(`📡 Executing Query: ${text} ${params ? JSON.stringify(params) : ''}`);
        logger.info(`📡 Executing Query: ${text} ${params ? JSON.stringify(params) : ''}`);
        const result = await db.query(text, params);
        return result;
    } catch (error) {
        console.error('❌ Query Error:', error);
        logger.error(`❌ Query Error: ${error}`);
        throw error;
    }
};

export { db, initDb };
