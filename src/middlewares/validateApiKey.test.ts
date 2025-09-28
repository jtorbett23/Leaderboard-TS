import { Request, Response } from 'express';
import { authenticateKey } from './validateApiKey';
import * as db from '../db/database';
import * as auth from './validateApiKey';

describe('validApiKey Middleware - authenticateKey', () => {
    const mockReq: Request = {} as unknown as Request;
    const mockRes: Response = {} as unknown as Response;
    const mockGame: string = 'test';
    const mockApiKey = 'test-key';
    const mockNext = jest.fn();
    let mockIsValidApiKey = jest.spyOn(auth, 'isValidApiKey');

    beforeEach(() => {
        jest.resetAllMocks();
        mockIsValidApiKey = jest.spyOn(auth, 'isValidApiKey');
    });

    afterEach(() => {
        mockIsValidApiKey.mockRestore();
    });

    it('authenticateKey - should call next for valid api key ', async () => {
        mockIsValidApiKey.mockResolvedValue(true);
        mockReq.header = jest.fn().mockImplementation(() => mockApiKey);
        mockReq.params = { game: mockGame };

        await authenticateKey(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledTimes(1);
        expect(mockIsValidApiKey).toHaveBeenCalledTimes(1);
        expect(mockIsValidApiKey).toHaveBeenCalledWith(mockApiKey, mockGame);
    });

    it('authenticateKey - should throw 403 unauthorised with no x-api-key ', async () => {
        mockReq.header = jest.fn().mockImplementation(() => undefined);

        try {
            await authenticateKey(mockReq, mockRes, mockNext);
        } catch (err) {
            expect(err).toStrictEqual({ message: 'Unauthorised', status: 403 });
        }

        expect(mockNext).toHaveBeenCalledTimes(0);
        expect(mockIsValidApiKey).toHaveBeenCalledTimes(0);
    });

    it('authenticateKey - should throw 403 unauthorised if api-key is not valid', async () => {
        mockIsValidApiKey.mockResolvedValue(false);
        mockReq.header = jest.fn().mockImplementation(() => mockApiKey);
        mockReq.params = { game: mockGame };

        try {
            await authenticateKey(mockReq, mockRes, mockNext);
        } catch (err) {
            expect(err).toStrictEqual({ message: 'Unauthorised', status: 403 });
        }

        expect(mockNext).toHaveBeenCalledTimes(0);
        expect(mockIsValidApiKey).toHaveBeenCalledTimes(1);
        expect(mockIsValidApiKey).toHaveBeenCalledWith(mockApiKey, mockGame);
    });
});

describe('validApiKey Middleware - isValidApi', () => {
    const mockGame: string = 'test';
    const mockApiKey = 'test-key';
    const mockGetLeaderboardKeyForGame = jest.spyOn(
        db,
        'getLeaderboardKeyForGame'
    );

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('isValidApiKey - should return true if api key matches database', async () => {
        mockGetLeaderboardKeyForGame.mockResolvedValue(mockApiKey);

        const result = await auth.isValidApiKey(mockApiKey, mockGame);

        expect(result).toBe(true);
        expect(mockGetLeaderboardKeyForGame).toHaveBeenCalledTimes(1);
        expect(mockGetLeaderboardKeyForGame).toHaveBeenCalledWith(mockGame);
    });

    it('isValidApiKey - should return false if api key does not match database', async () => {
        const mockApiKeyInDB = 'test-key-1234';
        mockGetLeaderboardKeyForGame.mockResolvedValue(mockApiKeyInDB);

        const result = await auth.isValidApiKey(mockApiKey, mockGame);

        expect(result).toBe(false);
        expect(mockGetLeaderboardKeyForGame).toHaveBeenCalledTimes(1);
        expect(mockGetLeaderboardKeyForGame).toHaveBeenCalledWith(mockGame);
    });
});
