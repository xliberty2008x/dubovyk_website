import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy API to communicate with the PostgreSQL MCP server.
 * This handles making JSON-RPC requests to the MCP server and transforming
 * the responses into a format that the client can easily consume.
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { tool, arguments: toolArgs } = body;
    
    // Log the request for debugging
    console.log('MCP Proxy API request received:');
    console.log(`Tool: ${tool}`);
    console.log(`Arguments: ${JSON.stringify(toolArgs)}`);

    // Validate the request
    if (!tool) {
      console.log('Error: Tool name is required');
      return NextResponse.json({ error: 'Tool name is required' }, { status: 400 });
    }

    // Prepare the MCP request
    const mcpRequest = {
      jsonrpc: '2.0',
      method: 'callTool',
      params: {
        name: tool,
        arguments: toolArgs || {},
      },
      id: Date.now().toString(),
    };

    try {
      console.log('Sending request to MCP server at: http://localhost:3004/api/mcp');
      // Call the MCP server
      const response = await fetch('http://localhost:3004/api/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mcpRequest),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`MCP server error: ${errorText}`);
      }

      const mcpResponse = await response.json();

      // Check for JSON-RPC errors
      if (mcpResponse.error) {
        console.error('MCP server error response:', mcpResponse.error);
        
        // Format the error as a JSON string that can be passed to the LLM
        // This creates a format similar to successful responses but with error flag
        const errorContent = JSON.stringify({
          error: true,
          message: mcpResponse.error.message || 'Unknown MCP error',
          code: mcpResponse.error.code || -1,
          details: mcpResponse.error.data || {}
        });
        
        // Return a 200 status but with error content formatted as a tool response
        // so the LLM can understand what went wrong and fix it
        return NextResponse.json({
          status: 'success',
          data: {
            content: [
              {
                type: 'text',
                text: errorContent
              }
            ]
          }
        });
      }

      // Return the result
      return NextResponse.json({
        status: 'success',
        data: mcpResponse.result || null,
      });
    } catch (error: any) {
      console.error('Error calling MCP server:', error);
      return NextResponse.json(
        { error: `Error calling MCP server: ${error.message}` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error in MCP proxy API:', error);
    return NextResponse.json(
      { error: `Error processing request: ${error.message}` },
      { status: 500 }
    );
  }
}

/**
 * Handle GET requests to the MCP proxy API.
 * This is just for health checking and documentation.
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'healthy',
    message: 'PostgreSQL MCP proxy API is running',
    usage: 'Send POST requests to this endpoint with "tool" and "arguments" properties',
    availableTools: [
      'database:query',
      'database:get_tables',
      'database:get_table_schema',
      'database:insert_record',
      'database:update_record',
      'database:delete_record',
      'weather:get_forecast',
      'search:search_web',
    ],
  });
}
