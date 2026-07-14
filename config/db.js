const mysql = require("mysql2/promise");
const fs = require("fs");
require("dotenv").config();

if (!process.env.DB_CA_PATH) {
  throw new Error("DB_CA_PATH es obligatoria para validar TLS");
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    ca: fs.readFileSync(process.env.DB_CA_PATH),
    rejectUnauthorized: true,
  },
});

module.exports = pool;
