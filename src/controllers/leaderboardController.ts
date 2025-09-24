import { Request, Response, NextFunction } from 'express';
import { leaderboard } from '../models/leaderboard';

export const getLeaderboard  = (req: Request, res: Response, next: NextFunction) => {
    try{
        return res.json(leaderboard)
    }
    catch (error){
        next(error)
    }
}