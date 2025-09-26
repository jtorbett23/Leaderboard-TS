import { Request, Response, NextFunction } from 'express';
import { validAPIKeys } from '../utils/apiKey';

export const authenticateKey = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.header('x-api-key'))
        return res.status(403).json({
            message: 'Unauthorised'
        });
    const apiKey: string = String(req.header('x-api-key')); //Get API key from headers
    if (isValidApiKey(apiKey, req.params.game)) {
        next();
    } else {
        return res.status(403).json({
            message: 'Unauthorised'
        });
    }
};

export const isValidApiKey = (apiKey: string, game: string): boolean => {
    if (validAPIKeys.includes(apiKey)) return true;
    return false;
};
