import * as db from './database';
import mysql from 'mysql2/promise';
jest.mock('mysql2/promise');

describe('Database', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    it('getPool', () => {
        const mockCreatePool: any = jest.spyOn(mysql, 'createPool');

        // pool is null so should create pool
        db.getPool();

        expect(mockCreatePool).toHaveBeenCalledTimes(1);
        // values are set my env vars
        expect(mockCreatePool).toHaveBeenCalledWith({
            connectionLimit: 10,
            database: undefined,
            host: undefined,
            password: undefined,
            user: undefined
        });

        // pool is created so should not recreate
        db.getPool();

        expect(mockCreatePool).toHaveBeenCalledTimes(1);
    });
    it('executeQuery', async () => {
        const mockGame: string = 'test';
        const mockResponseData = [
            [
                {
                    field_1: 123,
                    field_2: 456
                },
                {
                    field_1: 124,
                    field_2: 457
                }
            ],
            []
        ];

        const mockQuery: string = `SELECT * FROM ${mockGame};`;
        const mockPool = {
            execute: jest.fn(() => {
                return new Promise((resolve) => {
                    resolve(mockResponseData);
                });
            })
        } as unknown as mysql.Pool;

        const result = await db.executeQuery(mockPool, mockQuery);

        expect(mockPool.execute).toHaveBeenCalledTimes(1);
        expect(mockPool.execute).toHaveBeenCalledWith(mockQuery, []);
        expect(result).toBe(mockResponseData[0]);
    });

    it('getLeaderboardForGame', async () => {
        const mockGame: string = 'test';
        const mockResponseData = [
            {
                field_1: 123,
                field_2: 456
            }
        ];
        const mockPool = {} as mysql.Pool;
        const mockGetPool = jest.spyOn(db, 'getPool').mockReturnValue(mockPool);
        const mockExecuteQuery = jest.spyOn(db, 'executeQuery');
        mockExecuteQuery.mockResolvedValue(
            mockResponseData as mysql.RowDataPacket[]
        );
        const expectedQuery = `SELECT * FROM ${mockGame};`;

        const result = await db.getLeaderboardForGame(mockGame);

        expect(mockExecuteQuery).toHaveBeenCalledTimes(1);
        expect(mockGetPool).toHaveBeenCalledTimes(1);
        expect(mockExecuteQuery).toHaveBeenCalledWith(mockPool, expectedQuery);
        expect(result).toBe(mockResponseData);
    });

    it('getLeaderboardKeyForGame success', async () => {
        const mockGame: string = 'test';
        const mockApiKey: string = 'test-key';
        const mockResponseData = [
            {
                apiKey: mockApiKey
            }
        ];
        const mockPool = {} as mysql.Pool;
        const mockGetPool = jest.spyOn(db, 'getPool').mockReturnValue(mockPool);
        const mockExecuteQuery = jest.spyOn(db, 'executeQuery');
        mockExecuteQuery.mockResolvedValue(
            mockResponseData as mysql.RowDataPacket[]
        );
        const expectedQuery = 'SELECT apiKey FROM apiKeys WHERE game=?;';

        const result = await db.getLeaderboardKeyForGame(mockGame);

        expect(mockExecuteQuery).toHaveBeenCalledTimes(1);
        expect(mockGetPool).toHaveBeenCalledTimes(1);
        expect(mockExecuteQuery).toHaveBeenCalledWith(mockPool, expectedQuery, [
            mockGame
        ]);
        expect(result).toBe(mockApiKey);
    });

    it('getLeaderboardKeyForGame fails with no key found', async () => {
        const mockGame: string = 'test';
        const mockResponseData: mysql.RowDataPacket[] = [];
        const mockPool = {} as mysql.Pool;
        const mockGetPool = jest.spyOn(db, 'getPool').mockReturnValue(mockPool);
        const mockExecuteQuery = jest.spyOn(db, 'executeQuery');
        mockExecuteQuery.mockResolvedValue(mockResponseData);
        const expectedQuery = 'SELECT apiKey FROM apiKeys WHERE game=?;';

        try {
            await db.getLeaderboardKeyForGame(mockGame);
        } catch (err) {
            expect(err).toStrictEqual({
                message: 'Unauthorised',
                status: 403
            });
        }

        expect(mockExecuteQuery).toHaveBeenCalledTimes(1);
        expect(mockGetPool).toHaveBeenCalledTimes(1);
        expect(mockExecuteQuery).toHaveBeenCalledWith(mockPool, expectedQuery, [
            mockGame
        ]);
    });

    it('submitLeaderboardScoreForGame with score', async () => {
        const mockGame: string = 'test';
        const mockName: string = 'tester';
        const mockScore: number = 100;
        const mockResponseData = [
            {
                field_1: 123,
                field_2: 456
            }
        ];
        const mockPool = {} as mysql.Pool;
        const mockGetPool = jest.spyOn(db, 'getPool').mockReturnValue(mockPool);
        const mockExecuteQuery = jest.spyOn(db, 'executeQuery');
        mockExecuteQuery.mockResolvedValue(
            mockResponseData as mysql.RowDataPacket[]
        );
        const expectedQuery = `INSERT INTO ${mockGame} (name, score) VALUES (?, ?);`;

        const result = await db.submitLeaderboardScoreForGame(
            mockGame,
            mockName,
            mockScore
        );

        expect(mockExecuteQuery).toHaveBeenCalledTimes(1);
        expect(mockGetPool).toHaveBeenCalledTimes(1);
        expect(mockExecuteQuery).toHaveBeenCalledWith(mockPool, expectedQuery, [
            mockName,
            mockScore
        ]);
        expect(result).toBe(true);
    });

    it('submitLeaderboardScoreForGame with time', async () => {
        const mockGame: string = 'test';
        const mockName: string = 'tester';
        const mockScore: undefined = undefined;
        const mockTime: number = 60;
        const mockResponseData = [
            {
                field_1: 123,
                field_2: 456
            }
        ];
        const mockPool = {} as mysql.Pool;
        const mockGetPool = jest.spyOn(db, 'getPool').mockReturnValue(mockPool);
        const mockExecuteQuery = jest.spyOn(db, 'executeQuery');
        mockExecuteQuery.mockResolvedValue(
            mockResponseData as mysql.RowDataPacket[]
        );
        const expectedQuery = `INSERT INTO ${mockGame} (name, time) VALUES (?, ?);`;

        const result = await db.submitLeaderboardScoreForGame(
            mockGame,
            mockName,
            mockScore,
            mockTime
        );

        expect(mockExecuteQuery).toHaveBeenCalledTimes(1);
        expect(mockGetPool).toHaveBeenCalledTimes(1);
        expect(mockExecuteQuery).toHaveBeenCalledWith(mockPool, expectedQuery, [
            mockName,
            mockTime
        ]);
        expect(result).toBe(true);
    });

    it('submitLeaderboardScoreForGame with score and time', async () => {
        const mockGame: string = 'test';
        const mockName: string = 'tester';
        const mockScore: number = 100;
        const mockTime: number = 60;
        const mockResponseData = [
            {
                field_1: 123,
                field_2: 456
            }
        ];
        const mockPool = {} as mysql.Pool;
        const mockGetPool = jest.spyOn(db, 'getPool').mockReturnValue(mockPool);
        const mockExecuteQuery = jest.spyOn(db, 'executeQuery');
        mockExecuteQuery.mockResolvedValue(
            mockResponseData as mysql.RowDataPacket[]
        );
        const expectedQuery = `INSERT INTO ${mockGame} (name, score, time) VALUES (?, ?, ?);`;

        const result = await db.submitLeaderboardScoreForGame(
            mockGame,
            mockName,
            mockScore,
            mockTime
        );

        expect(mockExecuteQuery).toHaveBeenCalledTimes(1);
        expect(mockGetPool).toHaveBeenCalledTimes(1);
        expect(mockExecuteQuery).toHaveBeenCalledWith(mockPool, expectedQuery, [
            mockName,
            mockScore,
            mockTime
        ]);
        expect(result).toBe(true);
    });
});
