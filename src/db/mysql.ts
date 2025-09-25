import mysql from 'mysql2/promise'

const db_config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS_ROOT,
    database: process.env.DB_NAME,
};


export const get_all_data = async () =>
{
    let pool = mysql.createPool({ connectionLimit: 5, ...db_config })
    const conn = await pool.getConnection()
    var connectionString = `SELECT * FROM test`
    const [rows, fields] = await conn.execute(connectionString)
    conn.release()
    return rows

}