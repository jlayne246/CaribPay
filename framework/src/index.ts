// export {default as logger} from './utils/logger';

// import {logger} from './index';

import logger from './utils/logger';
import { startup } from './config/startup';

export {logger};

logger.info("Framework building.");

// export function initialiseFramework() {
//     console.log('Framework Initialised!');
//     logger.info("Framework initialised.");
// }

const startApp = async () => {
    await startup(); // Ensure DB is connected before starting
    console.log('🌍 App is now ready to accept requests!');
};

startApp().catch((err) => {
    console.error('❌ Critical Startup Error:', err);
    process.exit(1);
});

