import { Request, Response, NextFunction } from 'express';
import { getLeaderboardForGame } from '../db/database';

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
