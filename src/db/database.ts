import mysql from 'mysql2/promise'

const db_config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS_ROOT,
    database: process.env.DB_NAME,
};

let pool: mysql.Pool | null = null

export const getPool = (): mysql.Pool | any => {
    if(pool === null)
        pool = mysql.createPool({ connectionLimit: 10, ...db_config })
    return pool
}

export const getLeaderboardForGame = async (game: string) =>
{
    const query = `SELECT * FROM ${game}`
    const currentPool : mysql.Pool = getPool()
    const results = await executeQuery(currentPool, query)
    return results
}

export const executeQuery = async (conn: mysql.Pool, query: string) => {
    const [rows, fields] = await conn.execute(query)
    return rows
}