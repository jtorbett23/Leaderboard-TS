import mysql, { QueryResult } from 'mysql2/promise';
import { Score } from '../models/leaderboard';
import { APIKeyDatabaseResponse } from '../models/apiKey';

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
    query: string,
    values: (string | number)[] = []
): Promise<QueryResult> => {
    const [rows, fields] = await conn.execute(query, values);
    return rows;
};

export const getLeaderboardForGame = async (game: string): Promise<Score[]> => {
    const query = `SELECT * FROM ${game};`;
    const currentPool: mysql.Pool = getPool();
    const results = (await executeQuery(currentPool, query)) as Score[];
    return results;
};

export const getLeaderboardKeyForGame = async (
    game: string
): Promise<string> => {
    // add check that game table exists in DB
    const query = 'SELECT apiKey FROM apiKeys WHERE game=?;';
    const currentPool: mysql.Pool = getPool();
    const results = (await executeQuery(currentPool, query, [
        game
    ])) as APIKeyDatabaseResponse[];
    if (results.length === 0) throw { message: 'Unauthorised', status: 403 };

    return results[0].apiKey;
};

export const submitLeaderboardScoreForGame = async (
    game: string,
    name: string,
    score: number | undefined = undefined,
    time: number | undefined = undefined
): Promise<boolean> => {
    // Build the query depending on which inputs exist
    var fields: string = '(name';
    var valuesStr: string = `(?`;
    var values: (string | number)[] = [name];
    if (score !== undefined) {
        fields += ', score';
        valuesStr += `, ?`;
        values.push(score);
    }
    if (time !== undefined) {
        fields += ', time';
        valuesStr += `, ?`;
        values.push(time);
    }
    fields += ')';
    valuesStr += ')';

    const query = `INSERT INTO ${game} ${fields} VALUES ${valuesStr};`;
    await executeQuery(getPool(), query, values);
    return true;
};
