import { Request, Response, NextFunction } from 'express';
import { getLeaderboardForGame, submitLeaderboardScoreForGame } from '../db/database';

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
        if(!req.body.name)
            throw({message: "No name provided for score", status: 422})
        const game = req.params.game
        const name = req.body.name
        const success = await submitLeaderboardScoreForGame(game, name)
        return res.json(success);
    } catch (error) {
        next(error);
    }
};
