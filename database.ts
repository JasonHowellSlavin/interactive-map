import mysql, { Pool, Connection } from 'mysql2/promise';

interface DbConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  waitForConnections?: boolean;
  connectionLimit?: number;
  queueLimit?: number;
}

const dbConfig: DbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: 'boilerplate_db',
};

async function init(): Promise<Pool> {
  try {
    // First, connect without specifying database to create it if needed
    const connection: Connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await connection.end();

    return mysql.createPool({
      ...dbConfig,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  } catch (error) {
    throw new Error('Database initialization failed', { cause: error });
  }
}

export default {
  init,
};
