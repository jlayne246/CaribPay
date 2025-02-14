import { db_mod, logger } from 'framework';
import { startServer } from './server';

const startApp = async () => {
    try {
        console.log('🚀 Starting application...');
        logger.info('🚀 Starting application...');

        await db_mod.initDb(); // Initialize DB first
        startServer(); // Start Express server

        // Handle shutdown signals (CTRL+C, Docker Stop)
        process.on('SIGINT', async () => {
            console.log('🛑 Received SIGINT. Shutting down...');
            logger.info('🛑 Received SIGINT. Shutting down...');
            await db_mod.closeDb();
            process.exit(0);
        });

        process.on('SIGTERM', async () => {
            console.log('🛑 Received SIGTERM. Shutting down...');
            logger.info('🛑 Received SIGTERM. Shutting down...');
            await db_mod.closeDb();
            process.exit(0);
        });
    } catch (error) {
        console.error('❌ Error starting application:', error);
        logger.error(`❌ Error starting application: ${error}`);
        process.exit(1); // Stop if startup fails
    }
};

startApp();