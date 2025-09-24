import { Request, Response } from 'express';
import { getLeaderboard } from '../src/controllers/leaderboardController'
import { leaderboard } from '../src/models/leaderboard'

describe('Leaderboard Controller', () => {
  it('should return an empty array when no leaderboard items exist', () => {
    // Create mock objects for Request, Response, and NextFunction
    const req = {} as Request;
    const res = {
      json: jest.fn(),
    } as unknown as Response;

    // Ensure that our in-memory store is empty
    leaderboard.length = 0;

    // Execute our controller function
    getLeaderboard(req, res, jest.fn());

    // Expect that res.json was called with an empty array
    expect(res.json).toHaveBeenCalledWith([]);
  });
});