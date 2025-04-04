/**
 * Mock database tools for deployment
 * This is a simplified version that doesn't depend on MCP
 */

export interface DBTool {
  name: string;
  description: string;
  execute: (args: any) => Promise<string>;
}

// Mock implementation of database tools
const mockResponse = JSON.stringify({
  message: "Database functionality is not available in this deployment.",
  status: "mock"
});

// Tool to list all database tables (mock)
export const listTablesDBTool: DBTool = {
  name: 'db_list_tables',
  description: 'Get a list of all tables in the PostgreSQL database',
  execute: async () => {
    return mockResponse;
  }
};

// Tool to get a table schema (mock)
export const getTableSchemaDBTool: DBTool = {
  name: 'db_get_table_schema',
  description: 'Get the schema of a specific table in the PostgreSQL database',
  execute: async (args: { table: string }) => {
    return mockResponse;
  }
};

// Tool to query the database (mock)
export const queryDatabaseDBTool: DBTool = {
  name: 'db_query',
  description: 'Execute a SQL query against the PostgreSQL database',
  execute: async (args: { sql: string; params?: any[] }) => {
    return mockResponse;
  }
};

// Tool to get row count (mock)
export const countRowsDBTool: DBTool = {
  name: 'db_count_rows',
  description: 'Count the number of rows in a table',
  execute: async (args: { table: string; condition?: string }) => {
    return mockResponse;
  }
};

// Collection of all database tools
export const databaseTools: DBTool[] = [
  listTablesDBTool,
  getTableSchemaDBTool,
  queryDatabaseDBTool,
  countRowsDBTool
];

// Get a database tool by name
export function getDBToolByName(name: string): DBTool | undefined {
  return databaseTools.find(tool => tool.name === name);
}
