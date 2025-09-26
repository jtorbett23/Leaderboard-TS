import mysql, { QueryResult } from 'mysql2/promise';
import { Score } from '../models/leaderboard';

const db_config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS_ROOT,
    database: process.env.DB_NAME
};

let pool: mysql.Pool | null = null;

export const getPool = (): mysql.Pool => {
    if (pool === null)
        pool = mysql.createPool({ connectionLimit: 10, ...db_config });
    return pool;
};

export const executeQuery = async (conn: mysql.Pool, query: string): Promise<QueryResult> => {
    const [rows, fields] = await conn.execute(query);
    return rows;
};

export const submitLeaderboardScoreForGame = async (game: string, name: string): Promise<boolean> => {
    const query = `INSERT INTO ${game} (name) VALUES ("${name}");`;
    await executeQuery(getPool(), query)
    return true
}

export const getLeaderboardForGame = async (game: string): Promise<Score[]> => {
    const query = `SELECT * FROM ${game}`;
    const currentPool: mysql.Pool = getPool();
    const results = await executeQuery(currentPool, query) as Score[]
    return results;
};


