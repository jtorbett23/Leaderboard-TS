import { Request, Response, NextFunction } from 'express';
import { getLeaderboardKeyForGame } from '../db/database';

export const authenticateKey = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.header('x-api-key'))
        return res.status(403).json({
            message: 'Unauthorised'
        });
    const apiKey: string = String(req.header('x-api-key')); //Get API key from headers
    if (await isValidApiKey(apiKey, req.params.game)) {
        next();
    } else {
        return res.status(403).json({
            message: 'Unauthorised'
        });
    }
};

export const isValidApiKey = async (
    apiKey: string,
    game: string
): Promise<boolean> => {
    if (apiKey === (await getLeaderboardKeyForGame(game))) return true;
    return false;
};
