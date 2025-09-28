import request from 'supertest';
import app from '../app';
import * as db from '../db/database';

// Testing the full routing behaviour including middlware

describe('GET /leaderboard/:game', () => {
    const mockGame: string = 'test';
    const mockApiKey: string = 'test-key';
    const mockGetLeaderboardKeyForGame = jest.spyOn(
        db,
        'getLeaderboardKeyForGame'
    );
    const mockGetLeaderboardForGame = jest.spyOn(db, 'getLeaderboardForGame');

    beforeEach(() => {
        jest.resetAllMocks();
    });

    // 200
    it('should provide empty array when no scores exist', async () => {
        mockGetLeaderboardKeyForGame.mockResolvedValue(mockApiKey);
        mockGetLeaderboardForGame.mockResolvedValue([]);

        const res = await request(app)
            .get(`/leaderboard/${mockGame}`)
            .set('x-api-key', mockApiKey)
            .expect('Content-Type', /json/)
            .expect(200);

        expect(mockGetLeaderboardKeyForGame).toHaveBeenCalledTimes(1);
        expect(mockGetLeaderboardKeyForGame).toHaveBeenCalledWith(mockGame);
        expect(mockGetLeaderboardForGame).toHaveBeenCalledTimes(1);
        expect(mockGetLeaderboardForGame).toHaveBeenCalledWith(mockGame);
        expect(res.body).toStrictEqual([]);
    });

    // 500
    it('should raise 500 with generic error on if no message', async () => {
        mockGetLeaderboardKeyForGame.mockRejectedValue({});

        const res = await request(app)
            .get(`/leaderboard/${mockGame}`)
            .set('x-api-key', mockApiKey)
            .expect('Content-Type', /json/)
            .expect(500);

        expect(mockGetLeaderboardKeyForGame).toHaveBeenCalledTimes(1);
        expect(mockGetLeaderboardKeyForGame).toHaveBeenCalledWith(mockGame);
        expect(res.body).toStrictEqual({ message: 'Internal Server Error' });
    });

    it('should raise 500 with specific database error on getting leaderboard', async () => {
        mockGetLeaderboardKeyForGame.mockResolvedValue(mockApiKey);
        mockGetLeaderboardForGame.mockRejectedValue({
            message: 'Database failure'
        });

        const res = await request(app)
            .get(`/leaderboard/${mockGame}`)
            .set('x-api-key', mockApiKey)
            .expect('Content-Type', /json/)
            .expect(500);

        expect(mockGetLeaderboardKeyForGame).toHaveBeenCalledTimes(1);
        expect(mockGetLeaderboardKeyForGame).toHaveBeenCalledWith(mockGame);
        expect(mockGetLeaderboardForGame).toHaveBeenCalledTimes(1);
        expect(mockGetLeaderboardForGame).toHaveBeenCalledWith(mockGame);
        expect(res.body).toStrictEqual({ message: 'Database failure' });
    });

    it('should raise 500 with specific database error on getting leaderboard key', async () => {
        mockGetLeaderboardKeyForGame.mockRejectedValue({
            message: 'Database failure'
        });

        const res = await request(app)
            .get(`/leaderboard/${mockGame}`)
            .set('x-api-key', mockApiKey)
            .expect('Content-Type', /json/)
            .expect(500);

        expect(mockGetLeaderboardKeyForGame).toHaveBeenCalledTimes(1);
        expect(mockGetLeaderboardKeyForGame).toHaveBeenCalledWith(mockGame);
        expect(res.body).toStrictEqual({ message: 'Database failure' });
    });

    // 403
    it('should return 403 when x-api-key not set', async () => {
        const res = await request(app)
            .get(`/leaderboard/${mockGame}`)
            .expect('Content-Type', /json/)
            .expect(403);

        expect(res.body).toStrictEqual({ message: 'Unauthorised' });
    });

    it('should return 403 when x-api-key does not match', async () => {
        const mockApiKeyFromDB: string = 'test-key-123';
        mockGetLeaderboardKeyForGame.mockResolvedValue(mockApiKeyFromDB);

        const res = await request(app)
            .get(`/leaderboard/${mockGame}`)
            .set('x-api-key', mockApiKey)
            .expect('Content-Type', /json/)
            .expect(403);

        expect(mockGetLeaderboardKeyForGame).toHaveBeenCalledTimes(1);
        expect(mockGetLeaderboardKeyForGame).toHaveBeenCalledWith(mockGame);
        expect(res.body).toStrictEqual({ message: 'Unauthorised' });
    });
});

describe('POST /leaderboard/:game', () => {
    const mockGame: string = 'test';
    const mockName: string = 'tester';
    const mockScore: number = 100;
    const mockTime: number = 60;
    const mockApiKey = 'test-key';
    const mockSubmitLeaderboardScoreForGame = jest.spyOn(
        db,
        'submitLeaderboardScoreForGame'
    );
    const mockGetLeaderboardKeyForGame = jest.spyOn(
        db,
        'getLeaderboardKeyForGame'
    );

    beforeEach(() => {
        jest.resetAllMocks();
    });

    // 200
    it('should return true for valid inputs with only score', async () => {
        mockGetLeaderboardKeyForGame.mockResolvedValue(mockApiKey);
        mockSubmitLeaderboardScoreForGame.mockResolvedValue(true);

        const res = await request(app)
            .post(`/leaderboard/${mockGame}`)
            .set('x-api-key', mockApiKey)
            .send({ name: mockName, score: mockScore })
            .expect('Content-Type', /json/)
            .expect(200);

        expect(mockGetLeaderboardKeyForGame).toHaveBeenCalledTimes(1);
        expect(mockGetLeaderboardKeyForGame).toHaveBeenCalledWith(mockGame);
        expect(mockSubmitLeaderboardScoreForGame).toHaveBeenCalledTimes(1);
        expect(mockSubmitLeaderboardScoreForGame).toHaveBeenCalledWith(
            mockGame,
            mockName,
            mockScore,
            undefined
        );
        expect(res.body).toStrictEqual(true);
    });

    it('should return true for valid inputs with only time', async () => {
        mockGetLeaderboardKeyForGame.mockResolvedValue(mockApiKey);
        mockSubmitLeaderboardScoreForGame.mockResolvedValue(true);

        const res = await request(app)
            .post(`/leaderboard/${mockGame}`)
            .set('x-api-key', mockApiKey)
            .send({ name: mockName, time: mockTime })
            .expect('Content-Type', /json/)
            .expect(200);

        expect(mockGetLeaderboardKeyForGame).toHaveBeenCalledTimes(1);
        expect(mockGetLeaderboardKeyForGame).toHaveBeenCalledWith(mockGame);
        expect(mockSubmitLeaderboardScoreForGame).toHaveBeenCalledTimes(1);
        expect(mockSubmitLeaderboardScoreForGame).toHaveBeenCalledWith(
            mockGame,
            mockName,
            undefined,
            mockTime
        );
        expect(res.body).toStrictEqual(true);
    });

    // 422
    it('should raise an error when name is not sent in body', async () => {
        mockGetLeaderboardKeyForGame.mockResolvedValue(mockApiKey);

        const res = await request(app)
            .post(`/leaderboard/${mockGame}`)
            .set('x-api-key', mockApiKey)
            .send({ noName: mockName })
            .expect('Content-Type', /json/)
            .expect(422);

        expect(mockGetLeaderboardKeyForGame).toHaveBeenCalledTimes(1);
        expect(mockGetLeaderboardKeyForGame).toHaveBeenCalledWith(mockGame);
        expect(mockSubmitLeaderboardScoreForGame).toHaveBeenCalledTimes(0);
        expect(res.body).toStrictEqual({
            message: '"name" must be provided for leaderboard entry'
        });
    });

    it('should raise an error when both score and time are not sent in body', async () => {
        mockGetLeaderboardKeyForGame.mockResolvedValue(mockApiKey);

        const res = await request(app)
            .post(`/leaderboard/${mockGame}`)
            .set('x-api-key', mockApiKey)
            .send({ name: mockName })
            .expect('Content-Type', /json/)
            .expect(422);

        expect(mockGetLeaderboardKeyForGame).toHaveBeenCalledTimes(1);
        expect(mockGetLeaderboardKeyForGame).toHaveBeenCalledWith(mockGame);
        expect(mockSubmitLeaderboardScoreForGame).toHaveBeenCalledTimes(0);
        expect(res.body).toStrictEqual({
            message:
                'Either "score" or "time" must be provided for leaderboard entry'
        });
    });

    // 500
    it('should raise 500 with generic error on if no message', async () => {
        mockGetLeaderboardKeyForGame.mockRejectedValue({});

        const res = await request(app)
            .post(`/leaderboard/${mockGame}`)
            .set('x-api-key', mockApiKey)
            .expect('Content-Type', /json/)
            .expect(500);

        expect(mockGetLeaderboardKeyForGame).toHaveBeenCalledTimes(1);
        expect(mockGetLeaderboardKeyForGame).toHaveBeenCalledWith(mockGame);
        expect(res.body).toStrictEqual({ message: 'Internal Server Error' });
    });
    it('should raise 500 with specific database error on submitting score', async () => {
        mockGetLeaderboardKeyForGame.mockResolvedValue(mockApiKey);
        mockSubmitLeaderboardScoreForGame.mockRejectedValue({
            message: 'Database failure'
        });

        const res = await request(app)
            .post(`/leaderboard/${mockGame}`)
            .set('x-api-key', mockApiKey)
            .send({ name: mockName, score: mockScore })
            .expect('Content-Type', /json/)
            .expect(500);

        expect(mockGetLeaderboardKeyForGame).toHaveBeenCalledTimes(1);
        expect(mockGetLeaderboardKeyForGame).toHaveBeenCalledWith(mockGame);
        expect(mockSubmitLeaderboardScoreForGame).toHaveBeenCalledTimes(1);
        expect(mockSubmitLeaderboardScoreForGame).toHaveBeenCalledWith(
            mockGame,
            mockName,
            mockScore,
            undefined
        );
        expect(res.body).toStrictEqual({ message: 'Database failure' });
    });

    it('should raise 500 with specific database error on getting leaderboard key', async () => {
        mockGetLeaderboardKeyForGame.mockRejectedValue({
            message: 'Database failure'
        });

        const res = await request(app)
            .post(`/leaderboard/${mockGame}`)
            .set('x-api-key', mockApiKey)
            .send({ name: mockName, score: mockScore })
            .expect('Content-Type', /json/)
            .expect(500);

        expect(mockGetLeaderboardKeyForGame).toHaveBeenCalledTimes(1);
        expect(mockGetLeaderboardKeyForGame).toHaveBeenCalledWith(mockGame);
        expect(res.body).toStrictEqual({ message: 'Database failure' });
    });

    // 403
    it('should return 403 when x-api-key not set', async () => {
        const res = await request(app)
            .post(`/leaderboard/${mockGame}`)
            .expect('Content-Type', /json/)
            .expect(403);

        expect(res.body).toStrictEqual({ message: 'Unauthorised' });
    });

    it('should return 403 when x-api-key does not match', async () => {
        const mockApiKeyFromDB: string = 'test-key-123';
        mockGetLeaderboardKeyForGame.mockResolvedValue(mockApiKeyFromDB);

        const res = await request(app)
            .post(`/leaderboard/${mockGame}`)
            .set('x-api-key', mockApiKey)
            .expect('Content-Type', /json/)
            .expect(403);

        expect(mockGetLeaderboardKeyForGame).toHaveBeenCalledTimes(1);
        expect(mockGetLeaderboardKeyForGame).toHaveBeenCalledWith(mockGame);
        expect(res.body).toStrictEqual({ message: 'Unauthorised' });
    });
});
