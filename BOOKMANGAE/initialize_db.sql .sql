-- Initialize the database
CREATE DATABASE IF NOT EXISTS book_management;

-- Use the created database
USE book_management;

-- Create the books table
CREATE TABLE IF NOT EXISTS books (
    book_id INT AUTO_INCREMENT PRIMARY KEY,
    book_name VARCHAR(100) NOT NULL,
    author VARCHAR(100) NOT NULL,
    publish_date DATE NOT NULL
);