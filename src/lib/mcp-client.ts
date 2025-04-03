/**
 * MCP Client for PostgreSQL integration
 * This file provides functions to interact with the PostgreSQL MCP server.
 */

// Interface for PostgreSQL query results
export interface PostgresQueryResult {
  rows: any[];
  rowCount: number;
  fields?: {
    name: string;
    dataTypeID: number;
    tableID: number;
  }[];
}

// Interface for table schema information
export interface TableSchema {
  tableName: string;
  columns: {
    name: string;
    dataType: string;
    isNullable: boolean;
    isPrimaryKey: boolean;
  }[];
}

/**
 * Execute a SQL query through the MCP PostgreSQL server
 * @param sql SQL query string
 * @param params Query parameters
 * @returns Query result as a string, including error information if applicable
 */
export async function mcpExecuteQuery(sql: string, params: any[] = []): Promise<string> {
  try {
    // Use the Next.js API proxy when running in the browser
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    
    // Use the MCP tool to execute the query
    const response = await fetch(`${baseUrl}/api/mcp-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tool: 'database:query',
        arguments: {
          sql,
          params,
        },
      }),
    });

    if (!response.ok) {
      return JSON.stringify({
        error: true,
        message: `HTTP error ${response.status} while executing query`,
        query: sql
      });
    }

    const result = await response.json();
    
    // Check for error in the result
    if (result.error) {
      console.error(`MCP server error for query: ${sql}`, result.error);
      // Return the error as a string to be passed to the LLM
      return JSON.stringify({
        error: true,
        message: `SQL error: ${result.error.message || 'Unknown error'}`,
        query: sql,
        params: params
      });
    }
    
    // Return the raw text without parsing
    if (result.data && result.data.content && result.data.content[0] && result.data.content[0].text) {
      console.log('Raw query result data: (returning as raw string)');
      // Return the raw text string directly without parsing
      return result.data.content[0].text;
    }
    
    // If no content, return empty result
    return JSON.stringify({ 
      error: true, 
      message: `No data returned for query: ${sql}` 
    });
  } catch (error) {
    console.error('Error executing MCP query:', error);
    return JSON.stringify({
      error: true,
      message: `Failed to execute query: ${error}`,
      query: sql
    });
  }
}

/**
 * Get a list of all tables in the database schema
 * @returns List of tables as a string, including error information if applicable
 */
export async function mcpGetTables(): Promise<string> {
  try {
    console.log('Fetching tables from MCP server...');
    // Use the Next.js API proxy when running in the browser
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/mcp-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tool: 'database:get_tables',
        arguments: {},
      }),
    });

    if (!response.ok) {
      return JSON.stringify({
        error: true,
        message: `HTTP error ${response.status} while getting tables`
      });
    }

    const result = await response.json();
    console.log('MCP get_tables response:', result);
    
    // Check for error in the result
    if (result.error) {
      console.error('MCP server error getting tables:', result.error);
      // Return error as string to LLM
      return JSON.stringify({
        error: true,
        message: `Error getting tables: ${result.error.message || 'Unknown error'}`
      });
    }
    
    // Return the raw text without parsing
    if (result.data && result.data.content && result.data.content[0] && result.data.content[0].text) {
      console.log('Raw tables data: (returning as raw string)');
      // Return the raw text string directly without parsing
      return result.data.content[0].text;
    }
    
    return JSON.stringify({ tables: [] });
  } catch (error) {
    console.error('Error getting MCP tables:', error);
    return JSON.stringify({
      error: true,
      message: `Failed to fetch tables: ${error}`
    });
  }
}

/**
 * Get the schema of a specific table
 * @param tableName Name of the table to retrieve schema for
 * @returns Table schema as a string, including error information if applicable
 */
export async function mcpGetTableSchema(tableName: string): Promise<string> {
  try {
    // Use the Next.js API proxy when running in the browser
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/mcp-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tool: 'database:get_table_schema',
        arguments: {
          table: tableName, // Use 'table' as the parameter name expected by the server
        },
      }),
    });

    if (!response.ok) {
      return JSON.stringify({
        error: true,
        message: `HTTP error ${response.status} while getting schema for table '${tableName}'`
      });
    }

    const result = await response.json();
    
    // Check for error in the result
    if (result.error) {
      console.error(`MCP server error for table ${tableName}:`, result.error);
      // Return error as string to LLM
      return JSON.stringify({
        error: true,
        message: `Error getting schema for table '${tableName}': ${result.error.message || 'Unknown error'}`
      });
    }
    
    // Return the raw text without parsing
    if (result.data && result.data.content && result.data.content[0] && result.data.content[0].text) {
      console.log(`Raw schema data for table ${tableName}: (returning as raw string)`);
      // Return the raw text string directly without parsing
      return result.data.content[0].text;
    }
    
    return JSON.stringify({ 
      error: true, 
      message: `No schema data returned for table '${tableName}'` 
    });
  } catch (error) {
    console.error(`Error getting schema for table ${tableName}:`, error);
    return JSON.stringify({
      error: true,
      message: `Failed to get schema for table '${tableName}': ${error}`
    });
  }
}

/**
 * Insert a new record into a table
 * @param tableName Name of the table
 * @param record Record data to insert
 * @returns Result as a string, including error information if applicable
 */
export async function mcpInsertRecord(tableName: string, record: Record<string, any>): Promise<string> {
  try {
    // Use the Next.js API proxy when running in the browser
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/mcp-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tool: 'database:insert_record',
        arguments: {
          tableName,
          record,
        },
      }),
    });

    if (!response.ok) {
      return JSON.stringify({
        error: true,
        message: `HTTP error ${response.status} while inserting record into table '${tableName}'`
      });
    }

    const result = await response.json();
    
    // Check for error in the result
    if (result.error) {
      console.error(`MCP server error inserting record into table ${tableName}:`, result.error);
      // Return error as string to LLM
      return JSON.stringify({
        error: true,
        message: `Error inserting record into table '${tableName}': ${result.error.message || 'Unknown error'}`
      });
    }
    
    // Return the raw text without parsing
    if (result.data && result.data.content && result.data.content[0] && result.data.content[0].text) {
      console.log(`Raw insert record data for table ${tableName}: (returning as raw string)`);
      // Return the raw text string directly without parsing
      return result.data.content[0].text;
    }
    
    return JSON.stringify({ 
      error: true, 
      message: `No data returned for insert into table '${tableName}'` 
    });
  } catch (error) {
    console.error(`Error inserting record into ${tableName}:`, error);
    return JSON.stringify({
      error: true,
      message: `Failed to insert record into table '${tableName}': ${error}`
    });
  }
}

/**
 * Update records in a table that match the specified condition
 * @param tableName Name of the table
 * @param updates Record with field updates
 * @param condition WHERE condition for the update
 * @returns Result as a string, including error information if applicable
 */
export async function mcpUpdateRecords(
  tableName: string,
  updates: Record<string, any>,
  condition: string
): Promise<string> {
  try {
    // Use the Next.js API proxy when running in the browser
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/mcp-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tool: 'database:update_record',
        arguments: {
          tableName,
          updates,
          condition,
        },
      }),
    });

    if (!response.ok) {
      return JSON.stringify({
        error: true,
        message: `HTTP error ${response.status} while updating records in table '${tableName}'`
      });
    }

    const result = await response.json();
    
    // Check for error in the result
    if (result.error) {
      console.error(`MCP server error updating records in table ${tableName}:`, result.error);
      // Return error as string to LLM
      return JSON.stringify({
        error: true,
        message: `Error updating records in table '${tableName}': ${result.error.message || 'Unknown error'}`
      });
    }
    
    // Return the raw text without parsing
    if (result.data && result.data.content && result.data.content[0] && result.data.content[0].text) {
      console.log(`Raw update records data for table ${tableName}: (returning as raw string)`);
      // Return the raw text string directly without parsing
      return result.data.content[0].text;
    }
    
    return JSON.stringify({ 
      error: true, 
      message: `No data returned for update in table '${tableName}'` 
    });
  } catch (error) {
    console.error(`Error updating records in ${tableName}:`, error);
    return JSON.stringify({
      error: true,
      message: `Failed to update records in table '${tableName}': ${error}`
    });
  }
}

/**
 * Delete records from a table that match the specified condition
 * @param tableName Name of the table
 * @param condition WHERE condition for the delete
 * @returns Result as a string, including error information if applicable
 */
export async function mcpDeleteRecords(
  tableName: string,
  condition: string
): Promise<string> {
  try {
    // Use the Next.js API proxy when running in the browser
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/mcp-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tool: 'database:delete_record',
        arguments: {
          tableName,
          condition,
        },
      }),
    });

    if (!response.ok) {
      return JSON.stringify({
        error: true,
        message: `HTTP error ${response.status} while deleting records from table '${tableName}'`
      });
    }

    const result = await response.json();
    
    // Check for error in the result
    if (result.error) {
      console.error(`MCP server error deleting records from table ${tableName}:`, result.error);
      // Return error as string to LLM
      return JSON.stringify({
        error: true,
        message: `Error deleting records from table '${tableName}': ${result.error.message || 'Unknown error'}`
      });
    }
    
    // Return the raw text without parsing
    if (result.data && result.data.content && result.data.content[0] && result.data.content[0].text) {
      console.log(`Raw delete records data for table ${tableName}: (returning as raw string)`);
      // Return the raw text string directly without parsing
      return result.data.content[0].text;
    }
    
    return JSON.stringify({ 
      error: true, 
      message: `No data returned for delete from table '${tableName}'` 
    });
  } catch (error) {
    console.error(`Error deleting records from ${tableName}:`, error);
    return JSON.stringify({
      error: true,
      message: `Failed to delete records from table '${tableName}': ${error}`
    });
  }
}
