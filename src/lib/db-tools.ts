import { mcpExecuteQuery, mcpGetTables, mcpGetTableSchema } from './mcp-client';

/**
 * Database tools for AI assistant to use when MCP is enabled
 * These tools provide structured access to the PostgreSQL database
 */

export interface DBTool {
  name: string;
  description: string;
  execute: (args: any) => Promise<string>;
}

// Tool to list all database tables
export const listTablesDBTool: DBTool = {
  name: 'db_list_tables',
  description: 'Get a list of all tables in the PostgreSQL database',
  execute: async () => {
    try {
      console.log('Executing db_list_tables tool');
      const tables = await mcpGetTables();
      console.log('Tables received:', tables);
      
      // We'll just return the raw string directly now
      if (!tables) {
        return JSON.stringify({ 
          message: "No tables found in the database.", 
          tables: [] 
        });
      }
      
      return tables;
    } catch (error) {
      console.error('Error listing tables:', error);
      return JSON.stringify({ 
        error: `Failed to list tables: ${error}` 
      });
    }
  }
};

// Tool to get a table schema
export const getTableSchemaDBTool: DBTool = {
  name: 'db_get_table_schema',
  description: 'Get the schema of a specific table in the PostgreSQL database',
  execute: async (args: { table: string }) => {
    try {
      if (!args.table) {
        return JSON.stringify({ error: "Please specify a table name." });
      }
      
      const schemaStr = await mcpGetTableSchema(args.table);
      if (!schemaStr) {
        return JSON.stringify({ 
          error: `Failed to get schema for table '${args.table}'` 
        });
      }
      
      // No need to stringify again, just pass through the raw string
      return schemaStr;
    } catch (error) {
      console.error(`Error getting schema for table ${args.table}:`, error);
      return JSON.stringify({ 
        error: `Failed to get schema for table '${args.table}': ${error}` 
      });
    }
  }
};

// Tool to query the database
export const queryDatabaseDBTool: DBTool = {
  name: 'db_query',
  description: 'Execute a SQL query against the PostgreSQL database',
  execute: async (args: { sql: string; params?: any[] }) => {
    try {
      if (!args.sql) {
        return JSON.stringify({ error: "Please provide an SQL query." });
      }
      
      // Safety check: only allow SELECT queries through this tool
      if (!args.sql.trim().toLowerCase().startsWith('select')) {
        return JSON.stringify({ 
          error: "For security reasons, only SELECT queries are allowed. For data modification, please use specific tools."
        });
      }
      
      // Try to extract table name from the query for better error messages
      const sqlLower = args.sql.toLowerCase();
      const fromMatch = sqlLower.match(/from\s+([a-z0-9_]+)/i);
      const tableName = fromMatch ? fromMatch[1] : "the table";
      
      const resultStr = await mcpExecuteQuery(args.sql, args.params || []);
      if (!resultStr) {
        return JSON.stringify({ 
          message: `The query executed successfully but returned no results. The ${tableName} table exists but currently has no data.`,
          rows: []
        });
      }
      
      // Pass through the raw string result
      return resultStr;
    } catch (error) {
      console.error('Error executing query:', error);
      return JSON.stringify({ 
        error: `Failed to execute query: ${error}` 
      });
    }
  }
};

// Tool to get row count
export const countRowsDBTool: DBTool = {
  name: 'db_count_rows',
  description: 'Count the number of rows in a table',
  execute: async (args: { table: string; condition?: string }) => {
    try {
      if (!args.table) {
        return JSON.stringify({ error: "Please specify a table name." });
      }
      
      const condition = args.condition ? ` WHERE ${args.condition}` : '';
      const sql = `SELECT COUNT(*) as count FROM ${args.table}${condition}`;
      
      const resultStr = await mcpExecuteQuery(sql);
      if (!resultStr) {
        return JSON.stringify({ 
          error: `Couldn't count rows in '${args.table}'. The table might not exist.` 
        });
      }
      
      // Simply pass through the raw string result
      return resultStr;
    } catch (error) {
      console.error(`Error counting rows in table ${args.table}:`, error);
      return JSON.stringify({ 
        error: `Failed to count rows in table '${args.table}': ${error}` 
      });
    }
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
