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

export const executeQuery = async (
    conn: mysql.Pool,
    query: string
): Promise<QueryResult> => {
    const [rows, fields] = await conn.execute(query);
    return rows;
};

export const getLeaderboardForGame = async (game: string): Promise<Score[]> => {
    const query = `SELECT * FROM ${game}`;
    const currentPool: mysql.Pool = getPool();
    const results = (await executeQuery(currentPool, query)) as Score[];
    return results;
};

export const submitLeaderboardScoreForGame = async (
    game: string,
    name: string,
    score: number | undefined = undefined,
    time: number | undefined = undefined
): Promise<boolean> => {
    var fields = '(name';
    var values = `("${name}"`;
    if (score !== undefined) {
        fields += ', score';
        values += `, "${score}"`;
    }
    if (time !== undefined) {
        fields += ', time';
        values += `, "${time}"`;
    }
    fields += ')';
    values += ')';
    console.log(values);
    const query = `INSERT INTO ${game} ${fields} VALUES ${values};`;
    console.log(query);
    await executeQuery(getPool(), query);
    return true;
};
