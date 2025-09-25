import { Request, Response, NextFunction } from 'express';
import { getLeaderboardForGame } from '../db/database';


export const getLeaderboard  = async (req: Request, res: Response, next: NextFunction) => {
    try{
        let data = await getLeaderboardForGame("test")
        return res.json(data)
    }
    catch (error){
        next(error)
    }
}