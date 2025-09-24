import express, {Application} from 'express';
import leaderboardRoutes from './routes/leaderboardRoutes';
import { errorHandler } from './middlewares/errorHandler';

const app: Application = express();

app.use(express.json());

// Routes
app.use('/leaderboard', leaderboardRoutes);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;