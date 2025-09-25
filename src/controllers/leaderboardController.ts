import { Request, Response, NextFunction } from 'express';
import { leaderboard } from '../models/leaderboard';
import { get_all_data } from '../db/mysql';


export const getLeaderboard  = async (req: Request, res: Response, next: NextFunction) => {
    try{
        let data = await get_all_data()
        return res.json(data)
    }
    catch (error){
        next(error)
    }
}