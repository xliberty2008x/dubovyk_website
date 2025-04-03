#!/usr/bin/env node
/**
 * A simple MCP server mock for testing the PostgreSQL integration
 * This server simulates the PostgreSQL MCP server responses for testing purposes
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

class PostgresMockServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'postgres-mock-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    
    // Error handling
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'query',
          description: 'Execute a SQL query against the database',
          inputSchema: {
            type: 'object',
            properties: {
              sql: {
                type: 'string',
                description: 'SQL query to execute',
              },
              params: {
                type: 'array',
                description: 'Query parameters',
                items: {
                  type: 'string'
                }
              }
            },
            required: ['sql']
          },
        },
        {
          name: 'get_tables',
          description: 'Get a list of all tables in the database',
          inputSchema: {
            type: 'object',
            properties: {},
            required: []
          },
        },
        {
          name: 'get_table_schema',
          description: 'Get the schema of a table',
          inputSchema: {
            type: 'object',
            properties: {
              tableName: {
                type: 'string',
                description: 'Name of the table',
              }
            },
            required: ['tableName']
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      console.log(`Tool '${request.params.name}' called with arguments:`, request.params.arguments);
      
      switch (request.params.name) {
        case 'ping':
          return {
            content: [
              {
                type: 'text',
                text: 'pong',
              },
            ],
          };

        case 'query':
          return this.handleQuery(request.params.arguments);
          
        case 'get_tables':
          return this.handleGetTables();
          
        case 'get_table_schema':
          return this.handleGetTableSchema(request.params.arguments);
          
        default:
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Unknown tool: ${request.params.name}`
          );
      }
    });
  }
  
  private handleQuery(args: any) {
    try {
      if (!args.sql) {
        throw new McpError(ErrorCode.InvalidParams, 'SQL query is required');
      }
      
      console.log(`Executing mock SQL query: ${args.sql}`);
      
      // Return mock results based on the query
      if (args.sql.toLowerCase().includes('select')) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                rows: [
                  { id: 1, name: 'John Doe', email: 'john@example.com' },
                  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
                ],
                rowCount: 2,
                fields: [
                  { name: 'id', dataTypeID: 23, tableID: 100 },
                  { name: 'name', dataTypeID: 25, tableID: 100 },
                  { name: 'email', dataTypeID: 25, tableID: 100 }
                ]
              }),
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                rowCount: 2,
                command: 'UPDATE'
              }),
            },
          ],
        };
      }
    } catch (error) {
      console.error('Error handling query:', error);
      throw new McpError(ErrorCode.InternalError, `Query error: ${error}`);
    }
  }
  
  private handleGetTables() {
    try {
      console.log('Getting mock tables list');
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              tables: ['users', 'products', 'orders', 'categories']
            }),
          },
        ],
      };
    } catch (error) {
      console.error('Error getting tables:', error);
      throw new McpError(ErrorCode.InternalError, `Get tables error: ${error}`);
    }
  }
  
  private handleGetTableSchema(args: any) {
    try {
      if (!args.tableName) {
        throw new McpError(ErrorCode.InvalidParams, 'Table name is required');
      }
      
      console.log(`Getting mock schema for table: ${args.tableName}`);
      
      // Return mock schema based on the table name
      if (args.tableName === 'users') {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                tableName: 'users',
                columns: [
                  { name: 'id', dataType: 'integer', isNullable: false, isPrimaryKey: true },
                  { name: 'name', dataType: 'varchar(100)', isNullable: false, isPrimaryKey: false },
                  { name: 'email', dataType: 'varchar(100)', isNullable: false, isPrimaryKey: false },
                  { name: 'created_at', dataType: 'timestamp', isNullable: true, isPrimaryKey: false }
                ]
              }),
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                tableName: args.tableName,
                columns: [
                  { name: 'id', dataType: 'integer', isNullable: false, isPrimaryKey: true },
                  { name: 'name', dataType: 'varchar(100)', isNullable: false, isPrimaryKey: false },
                  { name: 'description', dataType: 'text', isNullable: true, isPrimaryKey: false }
                ]
              }),
            },
          ],
        };
      }
    } catch (error) {
      console.error('Error getting table schema:', error);
      throw new McpError(ErrorCode.InternalError, `Get table schema error: ${error}`);
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('PostgreSQL mock MCP server running on stdio');
  }
}

const server = new PostgresMockServer();
server.run().catch(console.error);
