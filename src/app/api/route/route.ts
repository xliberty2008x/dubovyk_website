import { NextRequest, NextResponse } from 'next/server';
import { initializeCLITools } from '@/lib/mcp/cli-tools-init';

// API route for initializing CLI tools
export async function GET() {
  try {
    // Initialize CLI tools
    const result = initializeCLITools();
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: result.message,
        count: result.count
      });
    } else {
      return NextResponse.json(
        { error: result.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error initializing CLI tools:', error);
    return NextResponse.json(
      { error: `Error initializing CLI tools: ${error.message}` },
      { status: 500 }
    );
  }
}

// API route for testing CLI tools
export async function POST(request: NextRequest) {
  try {
    const { tool, args } = await request.json();
    
    // Validate request
    if (!tool) {
      return NextResponse.json(
        { error: 'Tool name is required' },
        { status: 400 }
      );
    }
    
    // Initialize CLI tools if not already initialized
    initializeCLITools();
    
    // Import MCP server
    const { mcpServer } = await import('@/lib/mcp/server');
    
    // Process the tool request through MCP
    const result = await mcpServer.processRequest({
      type: 'tool_call',
      name: tool,
      arguments: args || {}
    });
    
    return NextResponse.json({ result });
  } catch (error: any) {
    console.error('Error testing CLI tool:', error);
    return NextResponse.json(
      { error: `Error testing CLI tool: ${error.message}` },
      { status: 500 }
    );
  }
}
