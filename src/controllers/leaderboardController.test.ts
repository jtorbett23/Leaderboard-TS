import { Request, Response } from 'express';
import { getLeaderboard } from './leaderboardController'
import { leaderboard } from '../models/leaderboard'
import * as db from '../db/mysql';
import { QueryResult } from 'mysql2/promise';

describe('Leaderboard Controller', () => {
  it('should return an empty array when no leaderboard items exist', async () => {
    // Create mock objects for Request, Response, and NextFunction
    const req = {} as Request;
    const res = {
      json: jest.fn(),
    } as unknown as Response;

    const get_all_data_mock = new Promise<QueryResult>((resolve, reject) => {
     resolve([])
    });
    const mock = jest.spyOn(db, 'get_all_data');
    mock.mockReturnValue(get_all_data_mock);
    // Ensure that our in-memory store is empty
    leaderboard.length = 0;

    // Execute our controller function
    await getLeaderboard(req, res, jest.fn())

    // Expect that res.json was called with an empty array
    expect(res.json).toHaveBeenCalledWith([]);
  });
});