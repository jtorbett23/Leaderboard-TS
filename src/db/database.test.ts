import * as db from './database';
import mysql from 'mysql2/promise';
jest.mock('mysql2/promise');

describe('Database', () => {
    beforeEach(()=> {
        jest.resetAllMocks()
    })
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

        const mockQuery: string = 'SELECT * FROM test';
        const mockPool = {
            execute: jest.fn(() => {
                return new Promise((resolve) => {
                    resolve(mockResponseData);
                });
            })
        } as unknown as mysql.Pool;

        const result = await db.executeQuery(mockPool, mockQuery);

        expect(mockPool.execute).toHaveBeenCalledTimes(1);
        expect(mockPool.execute).toHaveBeenCalledWith(mockQuery);
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
        mockExecuteQuery.mockResolvedValue(mockResponseData as mysql.RowDataPacket[])
        const expectedQuery = `SELECT * FROM ${mockGame}`

        const result = await db.getLeaderboardForGame(mockGame)

        expect(mockExecuteQuery).toHaveBeenCalledTimes(1)
        expect(mockGetPool).toHaveBeenCalledTimes(1)
        expect(mockExecuteQuery).toHaveBeenCalledWith(
            mockPool,
            expectedQuery   
        );
        expect(result).toBe(mockResponseData)
    });

    it('submitLeaderboardScoreForGame', async () => {
        const mockGame: string = 'test'
        const mockName: string = 'tester'
        const mockResponseData = [
            {
                field_1: 123,
                field_2: 456
            }
        ];
        const mockPool = {} as mysql.Pool;
        const mockGetPool = jest.spyOn(db, 'getPool').mockReturnValue(mockPool);
        const mockExecuteQuery = jest.spyOn(db, 'executeQuery');
        mockExecuteQuery.mockResolvedValue(mockResponseData as mysql.RowDataPacket[]);
        const expectedQuery = `INSERT INTO ${mockGame} (name) VALUES ("${mockName}");`;

        const result = await db.submitLeaderboardScoreForGame(mockGame, mockName);

        expect(mockExecuteQuery).toHaveBeenCalledTimes(1);
        expect(mockGetPool).toHaveBeenCalledTimes(1);
        expect(mockExecuteQuery).toHaveBeenCalledWith(
            mockPool,
            expectedQuery   
        );
        expect(result).toBe(true)
    })
});
