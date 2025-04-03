# PostgreSQL MCP Integration

This document explains how the PostgreSQL MCP (Model Context Protocol) server is integrated with the chat application.

## Overview

The integration allows the AI assistant to directly query your PostgreSQL database, enabling it to access and manipulate data to provide more accurate and contextual responses.

## Components

1. **PostgreSQL MCP Server**: Located at `/Users/cyrildubovik/Python_projects/mcp-postgres`
2. **MCP Client Library**: The `src/lib/mcp-client.ts` file provides functions for interacting with the database
3. **MCP Proxy API**: The `/api/mcp-proxy` endpoint acts as a bridge between the frontend and the MCP server
4. **Chat Component Integration**: The chat interface includes UI controls to enable/disable the MCP integration

## How It Works

1. When the user enables the PostgreSQL MCP toggle in the chat interface, the application attempts to connect to the MCP server
2. The MCP server connects to the PostgreSQL database using the credentials configured in the MCP settings
3. When the AI assistant needs to access database information, it makes requests through the MCP proxy API
4. The proxy API forwards these requests to the MCP server, which executes the SQL queries and returns the results
5. The AI assistant can use this data to enhance its responses

## Available Database Operations

The integration supports the following operations:

- **Query Execution**: Execute SQL queries against the database
- **Table Listing**: Get a list of all tables in the database
- **Schema Retrieval**: Get the schema of specific tables
- **Record Management**: Insert, update, and delete records

## Configuration

The MCP server is configured in the MCP settings file:
`/Users/cyrildubovik/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`

This configuration includes:
- Database connection details (host, port, name, user, password)
- MCP server port configuration
- Command to run the MCP server

## Usage in the Chat

To use the PostgreSQL database in the chat:

1. Click the settings gear icon in the chat interface
2. Enable the "Use PostgreSQL Database (MCP)" toggle
3. Wait for the connection status to change to "Connected"
4. Start asking questions that require database access

Example queries:
- "Show me all the tables in the database"
- "What columns are in the users table?"
- "How many records are in the products table?"
- "Find all orders placed in the last 30 days"

## MCP Client Functions

The MCP client library provides the following functions:

- `mcpExecuteQuery(sql, params)`: Execute a SQL query
- `mcpGetTables()`: Get a list of all tables
- `mcpGetTableSchema(tableName)`: Get the schema of a table
- `mcpInsertRecord(tableName, record)`: Insert a new record
- `mcpUpdateRecords(tableName, updates, condition)`: Update records
- `mcpDeleteRecords(tableName, condition)`: Delete records

## Troubleshooting

If the MCP connection fails:

1. Ensure the PostgreSQL MCP server is properly installed and configured
2. Check that the database credentials in the MCP settings are correct
3. Verify that the PostgreSQL server is running and accessible
4. Check the terminal output for any error messages from the MCP server
