var { Pool } = require('pg');

const pool = new Pool({
  port: process.env.PGPORT,
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE
})

module.exports = {
  query: async (text, params, callback) => {
    console.log(text);
    const result = await pool.query(text, params, callback);
    return result;
  }
}
