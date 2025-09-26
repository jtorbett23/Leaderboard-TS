import request from 'supertest';
import app from '../app';
import * as db from '../db/database';
import { QueryResult } from 'mysql2/promise';
import { Score } from '../models/leaderboard';

describe('GET /leaderboard/', () => {
    it('should provide empty array when no scores exist', async () => {
        const getLeaderboardForGameMock = new Promise<Score[]>(
            (resolve, reject) => {
                resolve([]);
            }
        );
        const mock = jest.spyOn(db, 'getLeaderboardForGame');
        mock.mockReturnValue(getLeaderboardForGameMock);

        const res = await request(app)
            .get('/leaderboard/test')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.body).toStrictEqual([]);
    });

    it('should raise an error when get_all_data errors', async () => {
        const getLeaderboardForGameMock = new Promise<Score[]>(
            (resolve, reject) => {
                reject('Database failure');
            }
        );
        const mock = jest.spyOn(db, 'getLeaderboardForGame');
        mock.mockReturnValue(getLeaderboardForGameMock);

        const res = await request(app)
            .get('/leaderboard/test')
            .expect('Content-Type', /json/)
            .expect(500);
    });
});
