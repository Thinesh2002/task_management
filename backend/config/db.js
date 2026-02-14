const mysql = require("mysql2/promise");
require("dotenv").config();

const taskmanagement_db = mysql.createPool({
  host: process.env.TM_DB_HOST,
  user: process.env.TM_DB_USER,   
  password: process.env.TM_DB_PASS,
  database: process.env.TM_DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  timezone: "Z",
});

async function testConnection() {
  try {
    const conn = await taskmanagement_db.getConnection();
    await conn.ping();
    conn.release();
    console.log("Task Management DB connected successfully.");
  } catch (err) {
    console.error("Task Management DB connection error:", err.message);
  }
}

testConnection();

module.exports = taskmanagement_db;
