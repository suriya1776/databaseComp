const { db } = require('./db');

async function fetchDatabaseInfo() {
  try {
    const databaseInfo = {};

    // Fetch schema information, excluding default system schemas
    const schemas = await db.any(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_temp_1', 'pg_toast', 'pg_toast_temp_1')
    `);

    for (const schema of schemas) {
      const schemaName = schema.schema_name;

      // Initialize an object to store information for this schema
      databaseInfo[schemaName] = {};

      // Fetch tables for the schema
      const tables = await db.any(`SELECT table_name FROM information_schema.tables WHERE table_schema = $1`, schemaName);
      databaseInfo[schemaName].tables = tables.map((table) => table.table_name);

      // Fetch procedures for the schema
      const procedures = await db.any(`SELECT routine_name FROM information_schema.routines WHERE routine_schema = $1`, schemaName);
      databaseInfo[schemaName].procedures = procedures.map((procedure) => procedure.routine_name);

      // Fetch views for the schema
      const views = await db.any(`SELECT table_name FROM information_schema.views WHERE table_schema = $1`, schemaName);
      databaseInfo[schemaName].views = views.map((view) => view.table_name);

      // Fetch indexes for the schema
      const indexes = await db.any(`SELECT indexname FROM pg_indexes WHERE schemaname = $1`, schemaName);
      databaseInfo[schemaName].indexes = indexes.map((index) => index.indexname);

      // Fetch sequences for the schema
      const sequences = await db.any(`SELECT sequence_name FROM information_schema.sequences WHERE sequence_schema = $1`, schemaName);
      databaseInfo[schemaName].sequences = sequences.map((sequence) => sequence.sequence_name);
    }

    return databaseInfo;
  } catch (error) {
    throw error;
  }
}

module.exports = { fetchDatabaseInfo };
