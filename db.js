const mysql = require('mysql2');

// Create the database connection pool
const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'admin123', // Replace with your MySQL Workbench password
  database: 'idremis',            // Matches your Workbench schema
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection
db.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err.message);
    return;
  }
  console.log('Successfully connected to the idremis database!');
  connection.release();
});

module.exports = db.promise();