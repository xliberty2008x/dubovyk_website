/**
 * Database tools registration
 * This file exports all database tools and registers them with the MCP registry
 */
const { registerToolGroup } = require('../../core/registry');
const { executeQuery, insertRecord, updateRecord, deleteRecord, testConnection } = require('./query');
const { getTables, getTableSchema } = require('./schema');

// Tool definitions with handlers and schemas
const databaseTools = {
  // Query execution
  query: {
    handler: executeQuery,
    schema: {
      type: 'object',
      properties: {
        sql: { type: 'string', description: 'SQL query to execute' },
        params: { type: 'array', description: 'Query parameters' }
      },
      required: ['sql']
    },
    description: 'Execute a SQL query'
  },

  // Table listing
  get_tables: {
    handler: getTables,
    schema: {
      type: 'object',
      properties: {
        schema: { type: 'string', description: 'Database schema name (default: public)' }
      }
    },
    description: 'List all tables in the database'
  },

  // Table schema 
  get_table_schema: {
    handler: getTableSchema,
    schema: {
      type: 'object',
      properties: {
        table: { type: 'string', description: 'Table name' },
        schema: { type: 'string', description: 'Database schema name (default: public)' }
      },
      required: ['table']
    },
    description: 'Get schema information for a table'
  },

  // Record insertion
  insert_record: {
    handler: insertRecord,
    schema: {
      type: 'object',
      properties: {
        table: { type: 'string', description: 'Table name' },
        data: { type: 'object', description: 'Record data to insert' },
        schema: { type: 'string', description: 'Database schema name (default: public)' },
        returning: { 
          type: 'array', 
          items: { type: 'string' },
          description: 'Columns to return after insert' 
        }
      },
      required: ['table', 'data']
    },
    description: 'Insert a record into a table'
  },

  // Record update
  update_record: {
    handler: updateRecord,
    schema: {
      type: 'object',
      properties: {
        table: { type: 'string', description: 'Table name' },
        data: { type: 'object', description: 'Record data to update' },
        conditions: { type: 'object', description: 'WHERE conditions' },
        schema: { type: 'string', description: 'Database schema name (default: public)' },
        returning: { 
          type: 'array', 
          items: { type: 'string' },
          description: 'Columns to return after update' 
        }
      },
      required: ['table', 'data', 'conditions']
    },
    description: 'Update records in a table'
  },

  // Record deletion
  delete_record: {
    handler: deleteRecord,
    schema: {
      type: 'object',
      properties: {
        table: { type: 'string', description: 'Table name' },
        conditions: { type: 'object', description: 'WHERE conditions' },
        schema: { type: 'string', description: 'Database schema name (default: public)' },
        returning: { 
          type: 'array', 
          items: { type: 'string' },
          description: 'Columns to return after delete' 
        }
      },
      required: ['table', 'conditions']
    },
    description: 'Delete records from a table'
  }
};

/**
 * Register all database tools with the MCP registry
 */
function register() {
  // First test the database connection (non-blocking)
  testConnection().then(success => {
    console.error(`Database connection ${success ? 'successful' : 'failed'}`);
  });

  // Register all tools in the database category
  registerToolGroup('database', databaseTools);
}

module.exports = {
  register,
  tools: databaseTools
};
