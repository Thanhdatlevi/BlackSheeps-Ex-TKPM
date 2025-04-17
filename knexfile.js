require('dotenv').config();

const prod_conn = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false },
};
const test_conn = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME_TEST,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false },
};
let conn;

function areWeTestingWithJest() {
    return process.env.JEST_WORKER_ID !== undefined;
}
function areWeUsingTestDB(){
    return process.env.DB_CONFIG !== undefined;
}
if(areWeTestingWithJest() || areWeUsingTestDB()){
    console.log('knex testing database');
    conn = test_conn;
}
else {
    conn = prod_conn;
}

module.exports = {
  development: {
    client: 'pg',
    connection: conn,
    migrations: {
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    }
  }
};
