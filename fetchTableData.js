const { db } = require('./db');

async function fetchTableInfo(schemaName) {
  try {
    // Fetch table information for the specified schema
    const tables = await db.any(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = $1
    `, schemaName);

    const tableInfo = {};

    // Iterate through tables and fetch primary key columns, column names, and row count for each table
    for (const table of tables) {
      const tableName = table.table_name;

      // Fetch primary key constraint name for the table
      const primaryKeyConstraint = await db.oneOrNone(`
        SELECT constraint_name
        FROM information_schema.table_constraints
        WHERE table_name = $1
          AND table_schema = $2
          AND constraint_type = 'PRIMARY KEY'
      `, [tableName, schemaName]);

      const constraintName = primaryKeyConstraint ? primaryKeyConstraint.constraint_name : null;

      // Fetch column names for the table
      const columns = await db.any(`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = $1
          AND table_schema = $2
      `, [tableName, schemaName]);

      // Fetch row count for the table
      const rowCount = await db.one(`
        SELECT COUNT(*) AS row_count
        FROM ${schemaName}.${tableName}
      `);

      // Store the table information
      tableInfo[tableName] = {
        primaryKeys: constraintName ? await fetchPrimaryKeyColumns(schemaName, tableName, constraintName) : [],
        columns: columns.map((col) => col.column_name),
        rowCount: rowCount.row_count,
      };
    }

    return tableInfo;
  } catch (error) {
    throw error;
  }
}

async function fetchPrimaryKeyColumns(schemaName, tableName, constraintName) {
  const primaryKeys = await db.any(`
    SELECT column_name
    FROM information_schema.key_column_usage
    WHERE table_name = $1
      AND constraint_name = $2
      AND table_schema = $3
  `, [tableName, constraintName, schemaName]);

  return primaryKeys.map((pk) => pk.column_name);
}

module.exports = { fetchTableInfo };
