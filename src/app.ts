import express, { Application } from 'express';
import leaderboardRoutes from './routes/leaderboardRoutes';
import healthRoutes from './routes/healthRoutes';
import { errorHandler } from './middlewares/errorHandler';

const app: Application = express();

app.use(express.json());

// Routes
app.use('/health', healthRoutes);
app.use('/leaderboard', leaderboardRoutes);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
