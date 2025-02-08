import express from 'express';
import { logger, initialiseFramework } from 'framework';

const app = express();
app.use(express.json());



export default app;