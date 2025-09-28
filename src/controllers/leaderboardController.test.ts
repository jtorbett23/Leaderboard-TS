import { getLeaderboard, submitScore } from './leaderboardController';
import { Score } from '../models/leaderboard';
import { Request, Response } from 'express';
import * as db from '../db/database';

describe('leaderboardController', () => {
    const mockGame: string = 'test';
    const mockName: string = 'tester';
    const mockLeaderboard: Score[] = [{ id: 1, name: 'John', score: 100 }];
    const mockReq = {} as Request;
    const mockRes = {} as unknown as Response;
    const mockNext = jest.fn();
    const mockGetLeaderboardForGame = jest.spyOn(db, 'getLeaderboardForGame');
    const mockSubmitLeaderboardScoreForGame = jest.spyOn(
        db,
        'submitLeaderboardScoreForGame'
    );

    beforeEach(() => {
        jest.resetAllMocks();
        mockRes.json = jest.fn();
    });

    it('getLeaderboard - should return leaderboard as json', async () => {
        mockReq.params = { game: mockGame };
        mockGetLeaderboardForGame.mockResolvedValue(mockLeaderboard);

        await getLeaderboard(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledTimes(0);
        expect(mockRes.json).toHaveBeenCalledTimes(1);
        expect(mockRes.json).toHaveBeenCalledWith(mockLeaderboard);
    });

    it('getLeaderboard - should call next on error', async () => {
        mockReq.params = { game: mockGame };
        mockGetLeaderboardForGame.mockRejectedValue('Database failure');

        await getLeaderboard(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledTimes(1);
        expect(mockNext).toHaveBeenCalledWith('Database failure');
        expect(mockRes.json).toHaveBeenCalledTimes(0);
    });

    it('submitScore - should return success result', async () => {
        const mockSubmitResult = true;
        const mockScore = 100;
        const mockTime = undefined;
        mockReq.params = { game: mockGame };
        mockReq.body = { name: mockName, score: mockScore };
        mockSubmitLeaderboardScoreForGame.mockResolvedValue(mockSubmitResult);

        await submitScore(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledTimes(0);
        expect(mockSubmitLeaderboardScoreForGame).toHaveBeenCalledTimes(1);
        expect(mockSubmitLeaderboardScoreForGame).toHaveBeenCalledWith(
            mockGame,
            mockName,
            mockScore,
            mockTime
        );
        expect(mockRes.json).toHaveBeenCalledTimes(1);
        expect(mockRes.json).toHaveBeenCalledWith(mockSubmitResult);
    });

    it('submitScore - should call next on missing name error', async () => {
        const mockScore = 100;
        mockReq.params = { game: mockGame };
        mockReq.body = { score: mockScore };

        await submitScore(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledTimes(1);
        expect(mockNext).toHaveBeenCalledWith({
            message: '"name" must be provided for leaderboard entry',
            status: 422
        });
        expect(mockSubmitLeaderboardScoreForGame).toHaveBeenCalledTimes(0);
        expect(mockRes.json).toHaveBeenCalledTimes(0);
    });

    it('submitScore - should call next on missing score and time error', async () => {
        mockReq.params = { game: mockGame };
        mockReq.body = { name: mockName };

        await submitScore(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledTimes(1);
        expect(mockNext).toHaveBeenCalledWith({
            message:
                'Either "score" or "time" must be provided for leaderboard entry',
            status: 422
        });
        expect(mockSubmitLeaderboardScoreForGame).toHaveBeenCalledTimes(0);
        expect(mockRes.json).toHaveBeenCalledTimes(0);
    });
});
