import mysql, { Connection } from 'mysql2/promise';

interface DbConfig {
  host: string;
  user: string;
  password: string;
  database: string;
}

const dbConfig: DbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: 'boilerplate_db',
};

async function setupDatabase(): Promise<void> {
  let connection: Connection | undefined;
  
  try {
    // Connect without database first
    connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
    });

    console.log('Connected to MySQL server');

    // Create database
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    console.log(`Database '${dbConfig.database}' ready`);

    // Use the database
    await connection.query(`USE ${dbConfig.database}`);

    // Create a simple table as an example
    await connection.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        content VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Table "messages" created');

    // Insert a sample record
    await connection.query(
      'INSERT INTO messages (content) VALUES (?)',
      ['Hello from MySQL!']
    );
    console.log('Sample data inserted');

    console.log('\nDatabase setup complete!');
    console.log('MySQL stores data in its data directory (typically /usr/local/mysql/data on macOS)');
    
  } catch (error) {
    const err = error as Error;
    console.error('Error setting up database:', err.message);
    console.log('\nMake sure MySQL is installed and running.');
    console.log('On macOS, you can start MySQL with: brew services start mysql');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();

