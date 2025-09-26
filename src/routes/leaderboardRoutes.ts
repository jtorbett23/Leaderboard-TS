import { Router } from 'express';
import { getLeaderboard } from '../controllers/leaderboardController';
const router = Router();

router.get('/:game', getLeaderboard);

export default router;
