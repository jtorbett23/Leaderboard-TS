import { Request, Response, NextFunction } from 'express';
import { validAPIKeys } from '../utils/apiKey';

export const authenticateKey = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let api_key: string = String(req.header('x-api-key')); //Add API key to headers
    if (validAPIKeys.includes(api_key)) {
        next();
    } else {
        res.status(403).json({
            message: 'Unauthorised'
        });
    }
};
