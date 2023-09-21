const fs = require('fs');
const { fetchDatabaseInfo } = require('./schemaInfo');
const { fetchTableInfo } = require('./fetchTableData'); // Import the modified fetchTableData module

async function main() {
  try {
    // Fetch and save database information
    const databaseInfo = await fetchDatabaseInfo();
    fs.writeFileSync('database_info.json', JSON.stringify(databaseInfo, null, 2));
    console.log('Database information has been fetched and saved to database_info.json');

    // Fetch and save table information for each schema
    const allTableInfo = {};
    for (const schemaName in databaseInfo) {
      const tableInfo = await fetchTableInfo(schemaName);
      allTableInfo[schemaName] = tableInfo;
    }
    fs.writeFileSync('table_info.json', JSON.stringify(allTableInfo, null, 2));
    console.log('Table information has been fetched and saved to table_info.json');

    // Add any other operations you have here

  } catch (error) {
    console.error('Error:', error);
  }
}

main();
