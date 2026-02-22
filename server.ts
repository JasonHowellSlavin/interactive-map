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

// Create connection pool
let pool: Pool | undefined;

async function initDatabase(): Promise<void> {
  try {
    // First, connect without specifying database to create it if needed
    const connection: Connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await connection.end();

    // Now create pool with database
    pool = mysql.createPool({
      ...dbConfig,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    console.log('Database connection pool created');
  } catch (error) {
    const err = error as Error;
    console.error('Database initialization error:', err.message);
    console.log('Make sure MySQL is running and credentials are correct');
  }
}

// API route example
app.get('/api/test', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!pool) {
      res.status(500).json({ error: 'Database not initialized' });
      return;
    }
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
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});
