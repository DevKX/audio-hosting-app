const { Pool } = require('pg');
const fs = require('fs');

const decodedPassword = Buffer.from(process.env.DB_PASSWORD_BASE64, 'base64').toString('utf-8');

const pool = new Pool({
  host: "audio-hosting-db.postgres.database.azure.com",
  user: "audiouser",
  password: decodedPassword,
  database: "postgres",
  port: 5432,
  ssl: {
    ca: fs.readFileSync(__dirname + '/../certs/ca-certificate.pem').toString(),
    rejectUnauthorized: false,
  },
});

module.exports = pool;