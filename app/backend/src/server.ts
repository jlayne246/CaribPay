import mongoose from "mongoose";
import app from "./app";
import {logger} from 'framework';
 
const PORT = process.env.PORT || 5000;

mongoose.connect('mongodb://localhost:27017/caribpay-db')
    .then(() => {
        console.log("Connected to MongoDB");
        logger.info("Database running!");
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}/api`);
            logger.info("Backend running!");
        })
    })
    .catch((err) => console.error('DB Connection Error: ', err));