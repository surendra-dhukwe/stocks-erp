const mysql = require('mysql2');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'surendra@123',
  database: 'stockerp',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = db;