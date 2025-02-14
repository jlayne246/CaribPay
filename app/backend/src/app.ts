import express from 'express';
// import cors from 'cors';
// import helmet from 'helmet';
// import morgan from 'morgan';
// import routes from './routes'; // Import all routes

const createApp = () => {
    const app = express();

    // Middleware
    // app.use(cors()); // Enable CORS
    // app.use(helmet()); // Security headers
    // app.use(morgan('dev')); // Logging
    app.use(express.json()); // Parse JSON requests
    app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

    // Register Routes
    // app.use('/api', routes); // Mount API routes

    return app;
};

export { createApp };
