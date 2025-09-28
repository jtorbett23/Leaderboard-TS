import { Request, Response, NextFunction } from 'express';
import { getLeaderboardKeyForGame } from '../db/database';

export const authenticateKey = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.header('x-api-key'))
        throw { message: 'Unauthorised', status: 403 };

    const apiKey: string = String(req.header('x-api-key')); //Get API key from headers
    if (await isValidApiKey(apiKey, req.params.game)) {
        next();
    } else {
        throw { message: 'Unauthorised', status: 403 };
    }
};

export const isValidApiKey = async (
    apiKey: string,
    game: string
): Promise<boolean> => {
    if (apiKey === (await getLeaderboardKeyForGame(game))) return true;
    return false;
};
