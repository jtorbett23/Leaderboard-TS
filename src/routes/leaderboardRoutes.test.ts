import request from 'supertest';
import app from '../app';
import * as db from '../db/database';
import { Score } from '../models/leaderboard';

describe('GET /leaderboard/:game', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    it('should provide empty array when no scores exist', async () => {
        const mockReturnGetLeaderboardForGame = new Promise<Score[]>(
            (resolve, reject) => {
                resolve([]);
            }
        );
        const mockGetLeaderboardForGame = jest
            .spyOn(db, 'getLeaderboardForGame')
            .mockReturnValue(mockReturnGetLeaderboardForGame);
        const mockGame: string = 'test';

        const res = await request(app)
            .get(`/leaderboard/${mockGame}`)
            .expect('Content-Type', /json/)
            .expect(200);
        expect(res.body).toStrictEqual([]);
        expect(mockGetLeaderboardForGame).toHaveBeenCalledTimes(1);
        expect(mockGetLeaderboardForGame).toHaveBeenCalledWith(mockGame);
    });

    it('should raise an error when database errors', async () => {
        const mockReturnGetLeaderboardForGame = new Promise<Score[]>(
            (resolve, reject) => {
                reject('Database failure');
            }
        );
        const mockGetLeaderboardForGame = jest
            .spyOn(db, 'getLeaderboardForGame')
            .mockReturnValue(mockReturnGetLeaderboardForGame);
        const mockGame: string = 'test';

        const res = await request(app)
            .get(`/leaderboard/${mockGame}`)
            .expect('Content-Type', /json/)
            .expect(500);

        expect(mockGetLeaderboardForGame).toHaveBeenCalledTimes(1);
        expect(mockGetLeaderboardForGame).toHaveBeenCalledWith(mockGame);
        expect(res.body).toStrictEqual({ message: 'Internal Server Error' });
    });
});

describe('POST /leaderboard/:game', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    it('should return true for valid inputs', async () => {
        const mockReturnSubmitLeaderboardScoreForGame = new Promise<boolean>(
            (resolve, reject) => {
                resolve(true);
            }
        );
        const mockSubmitLeaderboardScoreForGame = jest
            .spyOn(db, 'submitLeaderboardScoreForGame')
            .mockReturnValue(mockReturnSubmitLeaderboardScoreForGame);
        const mockGame: string = 'test';
        const mockName: string = 'tester';
        const mockScore: number = 100;
        const mockTime: undefined = undefined;

        const res = await request(app)
            .post(`/leaderboard/${mockGame}`)
            .send({ name: mockName, score: 100 })
            .expect('Content-Type', /json/)
            .expect(200);
        expect(res.body).toStrictEqual(true);
        expect(mockSubmitLeaderboardScoreForGame).toHaveBeenCalledTimes(1);
        expect(mockSubmitLeaderboardScoreForGame).toHaveBeenCalledWith(
            mockGame,
            mockName,
            mockScore,
            mockTime
        );
    });

    it('should raise an error when name is not sent in body', async () => {
        const mockSubmitLeaderboardScoreForGame = jest.spyOn(
            db,
            'submitLeaderboardScoreForGame'
        );
        const mockGame: string = 'test';
        const mockName: string = 'tester';

        const res = await request(app)
            .post(`/leaderboard/${mockGame}`)
            .send({ noName: mockName, score: 100 })
            .expect('Content-Type', /json/)
            .expect(422);

        expect(mockSubmitLeaderboardScoreForGame).toHaveBeenCalledTimes(0);
        expect(res.body).toStrictEqual({
            message: '"name" must be provided for leaderboard entry'
        });
    });

    it('should raise an error when both score and time are not sent in body', async () => {
        const mockSubmitLeaderboardScoreForGame = jest.spyOn(
            db,
            'submitLeaderboardScoreForGame'
        );
        const mockGame: string = 'test';
        const mockName: string = 'tester';

        const res = await request(app)
            .post(`/leaderboard/${mockGame}`)
            .send({ name: mockName })
            .expect('Content-Type', /json/)
            .expect(422);

        expect(mockSubmitLeaderboardScoreForGame).toHaveBeenCalledTimes(0);
        expect(res.body).toStrictEqual({
            message:
                'Either "score" or "time" must be provided for leaderboard entry'
        });
    });

    it('should raise an error when database errors', async () => {
        const mockReturnSubmitLeaderboardScoreForGame = new Promise<boolean>(
            (resolve, reject) => {
                reject('Database failure');
            }
        );
        const mockSubmitLeaderboardScoreForGame = jest
            .spyOn(db, 'submitLeaderboardScoreForGame')
            .mockReturnValue(mockReturnSubmitLeaderboardScoreForGame);
        const mockGame: string = 'test';
        const mockName: string = 'tester';
        const mockScore: number = 100;
        const mockTime: undefined = undefined;

        const res = await request(app)
            .post(`/leaderboard/${mockGame}`)
            .send({ name: mockName, score: 100 })
            .expect('Content-Type', /json/)
            .expect(500);

        expect(mockSubmitLeaderboardScoreForGame).toHaveBeenCalledTimes(1);
        expect(mockSubmitLeaderboardScoreForGame).toHaveBeenCalledWith(
            mockGame,
            mockName,
            mockScore,
            mockTime
        );
        expect(res.body).toStrictEqual({ message: 'Internal Server Error' });
    });
});
