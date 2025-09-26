import * as db from './database';
import mysql from 'mysql2/promise';
jest.mock('mysql2/promise');

describe('Database', () => {
    it('getPool', () => {
        const createPoolSpy: any = jest.spyOn(mysql, 'createPool');

        // pool is null so should create pool
        db.getPool();

        expect(createPoolSpy).toHaveBeenCalledTimes(1);
        // values are set my env vars
        expect(createPoolSpy).toHaveBeenCalledWith({
            connectionLimit: 10,
            database: undefined,
            host: undefined,
            password: undefined,
            user: undefined
        });

        // pool is created so should not recreate
        db.getPool();

        expect(createPoolSpy).toHaveBeenCalledTimes(1);
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
        const getPoolMock = jest.spyOn(db, 'getPool').mockReturnValue(mockPool);

        const executeQueryMock = jest.spyOn(db, 'executeQuery');
        executeQueryMock.mockResolvedValue([
            [mockResponseData] as mysql.RowDataPacket[],
            []
        ]);

        await db.getLeaderboardForGame(mockGame);

        expect(executeQueryMock).toHaveBeenCalledTimes(1);
        expect(getPoolMock).toHaveBeenCalledTimes(1);
        expect(executeQueryMock).toHaveBeenCalledWith(
            mockPool,
            `SELECT * FROM ${mockGame}`
        );
    });
});
