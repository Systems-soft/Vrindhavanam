const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "MySql@12345", // put your MySQL password here
  database: "vrindhavanam_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.on('error', (err) => {
  console.error('MySQL Pool Error:', err);
});

pool.on('connection', (connection) => {
  connection.on('error', (err) => {
    console.error('MySQL Connection Error:', err.message || err);
  });
});

module.exports = pool;