require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');

if (!process.env.DB_PASSWORD_BASE64) {
  throw new Error("DB_PASSWORD_BASE64 is not set in your environment variables.");
}

const decodedPassword = Buffer.from(process.env.DB_PASSWORD_BASE64, 'base64').toString('utf-8');

//Set up PostgresSQL connection pool using .env variables
//.env file should be placed in the root of the project
//.env will not be committed to public repository
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: decodedPassword,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    ca: fs.readFileSync(process.env.DB_SSL_CA_PATH).toString(),
    rejectUnauthorized: false,
  },
});

module.exports = pool;