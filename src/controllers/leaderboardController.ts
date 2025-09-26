import { Request, Response, NextFunction } from 'express';
import {
    getLeaderboardForGame,
    submitLeaderboardScoreForGame
} from '../db/database';

export const getLeaderboard = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const data = await getLeaderboardForGame(req.params.game);
        return res.json(data);
    } catch (error) {
        next(error);
    }
};

export const submitScore = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.body.name)
            throw {
                message: '"name" must be provided for leaderboard entry',
                status: 422
            };
        if (!req.body.score && !req.body.time)
            throw {
                message:
                    'Either "score" or "time" must be provided for leaderboard entry',
                status: 422
            };
        const game = req.params.game;
        const name = req.body.name;
        const score = req.body.score;
        const time = req.body.time;
        const success = await submitLeaderboardScoreForGame(
            game,
            name,
            score,
            time
        );
        return res.json(success);
    } catch (error) {
        next(error);
    }
};
