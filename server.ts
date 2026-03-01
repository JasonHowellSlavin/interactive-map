import express, { Request, Response } from 'express';
import path from 'path';
import type { Pool } from 'mysql2/promise';
import database from './database.js';

const distPath = import.meta.dirname;
const appPath = path.dirname(distPath);
const publicPath = path.join(appPath, 'public');

const app = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);

// Serve static files from public directory
app.use(express.static(publicPath));

const pool: Pool = await database.init();

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
