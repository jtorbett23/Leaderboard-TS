import { Router } from 'express';
import {
    getLeaderboard,
    submitScore
} from '../controllers/leaderboardController';
const router = Router();

router.get('/:game', getLeaderboard);

router.post('/:game', submitScore);

export default router;
