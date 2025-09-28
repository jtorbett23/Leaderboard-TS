import { Router } from 'express';
import {
    getLeaderboard,
    submitScore
} from '../controllers/leaderboardController';
import { authenticateKey } from '../middlewares/validateApiKey';

const router = Router();

router.get('/:game', authenticateKey, getLeaderboard);

router.post('/:game', authenticateKey, submitScore);

export default router;
