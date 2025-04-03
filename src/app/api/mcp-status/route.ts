import { NextRequest, NextResponse } from 'next/server';

/**
 * API endpoint to check the status of the MCP Postgres connection
 * This is used to verify that the MCP connection is working correctly
 */
export async function GET(request: NextRequest) {
  console.log('MCP status check requested');
  
  try {
    // Set up AbortController for timeout
    const controller = new AbortController();
    const signal = controller.signal;
    
    // Set a timeout of 5 seconds
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.log('MCP status check timed out after 5 seconds');
    }, 5000);
    
    try {
      // Attempt to connect to the MCP server with timeout
      console.log('Attempting to connect to MCP server at http://localhost:3004/api/mcp');
      const response = await fetch('http://localhost:3004/api/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'ping',
          params: {},
          id: Date.now().toString(),
        }),
        signal, // Use the AbortController signal for timeout
      });
      
      // Clear the timeout as we got a response
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`MCP server returned error: ${response.status} - ${errorText}`);
        return NextResponse.json({
          status: 'error',
          message: 'Failed to connect to MCP server',
          details: errorText,
        }, { status: response.status });
      }
      
      const data = await response.json();
      console.log('MCP server response:', data);
      
      // Return success response
      return NextResponse.json({
        status: 'connected',
        message: 'MCP Postgres server is connected and responding',
      });
    } catch (fetchError: any) {
      // Clear the timeout as we got an error
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        console.error('MCP connection timed out');
        return NextResponse.json({
          status: 'error',
          message: 'MCP connection timed out after 5 seconds',
        }, { status: 504 });
      }
      
      throw fetchError; // Re-throw for the outer catch block
    }
  } catch (error: any) {
    console.error('Error checking MCP status:', error);
    
    // Determine if it's a connection error
    if (error.code === 'ECONNREFUSED') {
      return NextResponse.json({
        status: 'error',
        message: 'Could not connect to the MCP server - server might not be running',
        error: error.message,
      }, { status: 503 });
    }
    
    return NextResponse.json({
      status: 'error',
      message: 'Error checking MCP connection',
      error: error.message,
    }, { status: 500 });
  }
}
