import express, { Request, Response } from 'express';
import path from 'path';
import mysql, { Pool, Connection } from 'mysql2/promise';

const distPath = import.meta.dirname;
const appPath = path.dirname(distPath);
const publicPath = path.join(appPath, 'public');

const app = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);

// Serve static files from public directory
app.use(express.static(publicPath));

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

async function initDatabase(): Promise<Pool> {
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

const pool: Pool = await initDatabase();

// API route example
app.get('/api/test', async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.query('SELECT 1 as test');
    res.json({ message: 'Database connection successful', data: rows });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
});

// Serve the main HTML page
app.get('/', (req: Request, res: Response): void => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Start
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
