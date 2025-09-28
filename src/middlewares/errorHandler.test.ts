import { errorHandler } from './errorHandler';
import { AppError } from './errorHandler';
import { Request, Response } from 'express';

describe('errorHandler middlware', () => {
    const mockReq = {} as Request;
    const mockRes = {} as unknown as Response;
    const mockNext = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
        mockRes.status = jest.fn().mockReturnValue(mockRes);
        mockRes.json = jest.fn().mockReturnValue(mockRes);
    });

    it('should return a generic 500 error if no message/code given', () => {
        const mockAppError = {} as unknown as AppError;

        errorHandler(mockAppError, mockReq, mockRes, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: 'Internal Server Error'
        });
    });

    it('should return a specfic error message if given', () => {
        const mockAppError = { message: 'test failure' } as unknown as AppError;

        errorHandler(mockAppError, mockReq, mockRes, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'test failure' });
    });

    it('should return a specfic error status if given', () => {
        const mockAppError = { status: 403 } as unknown as AppError;

        errorHandler(mockAppError, mockReq, mockRes, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(403);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: 'Internal Server Error'
        });
    });

    it('should return a specfic error status and message if given', () => {
        const mockAppError = {
            message: 'Unauthorised',
            status: 403
        } as unknown as AppError;

        errorHandler(mockAppError, mockReq, mockRes, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(403);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Unauthorised' });
    });
});
