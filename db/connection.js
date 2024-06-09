const { Pool } = require('pg');

const pool = new Pool(
    {
      user: 'postgres',
      password: 'rootroot',
      host: 'localhost',
      database: 'employee_db',
      port: 5432 // Default PostgreSQL port
    },
  )
  
  module.exports = pool;