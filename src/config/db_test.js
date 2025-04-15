const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER_TEST,
    host: process.env.DB_HOST_TEST,
    database: process.env.DB_NAME_TEST,
    password: process.env.DB_PASSWORD_TEST,
    port: process.env.DB_PORT_TEST,
    ssl: { rejectUnauthorized: false },
    max: 200,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 20000,
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    connect: () => pool.connect(),
};
