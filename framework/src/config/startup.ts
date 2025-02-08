import { initDb } from './db';

import logger from '../utils/logger';

export const startup = async () => {
    console.log('🚀 Starting Application...');
    logger.info("Starting application framework!")
    await initDb(); // Initialize database connection
    console.log('✅ Framework initialized successfully!');
    logger.info('Framework initialized successfully!');
};
