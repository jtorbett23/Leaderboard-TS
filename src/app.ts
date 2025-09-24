import express from 'express';
import apiKeyRoutes from './routes/apiKeyRoutes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(express.json());

// Routes
app.use('/key', apiKeyRoutes);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;