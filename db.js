const initOptions = {
    // Specify initialization options here (if any).
  };
  
  const pgp = require('pg-promise')(initOptions);
  
  // Replace with your PostgreSQL connection details
  const dbConfig = {
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'manager',
  };
  
  const db = pgp(dbConfig);
  
  module.exports = { db, pgp };
  