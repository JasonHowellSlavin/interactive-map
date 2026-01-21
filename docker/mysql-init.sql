-- Initialize database and create tables
CREATE DATABASE IF NOT EXISTS boilerplate_db;
USE boilerplate_db;

CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  content VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO messages (content) VALUES ('Hello from MySQL!');

