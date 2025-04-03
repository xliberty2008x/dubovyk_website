import { NextRequest, NextResponse } from 'next/server';
import { getChatCompletion, ChatMessage, useMcpServer } from '@/lib/azure-openai';

// Handle POST requests to /api/chat
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { message, history, enableTools = true, useMcp = false } = body;

    // Enable MCP if requested
    if (useMcp) {
      useMcpServer(true);
      console.log('MCP enabled for chat request');
    } else {
      console.log('MCP disabled for chat request');
    }
    
    // Log the request parameters
    console.log(`Chat request with enableTools=${enableTools}, useMcp=${useMcp}`);

    // Format messages for Azure OpenAI
    const messages: ChatMessage[] = [
      // Add a system message to provide context about Kyrylo and database access
      {
        role: 'system',
        content: `You are an AI assistant for Kyrylo Dubovyk's personal website. Provide helpful and concise responses about Kyrylo's skills, experience, projects, and other professional information. Be friendly and professional.
        
        You have access to external tools (like weather, search) which you can use when appropriate.
        
        Additionally, when the user enables the 'Database Connection (MCP)' setting, you gain access to Kyrylo's professional profile data stored in a PostgreSQL database (Supabase). You can query this database using MCP tools:
        - \`execute_sql(query: string)\`: Execute a read-only SQL query. Use this to fetch data.
        - \`list_tables()\`: List available tables and their row counts.
        - \`describe_table(table_name: string)\`: Get the schema, columns, keys, and sample data for a table.
        
        The relevant tables for Kyrylo's profile are:
        - \`experience\`: Contains work history (job_title, company, start_date, end_date, description, location, display_order).
        - \`skills\`: Contains technical skills (name, category, proficiency, display_order).
        - \`projects\`: Contains portfolio projects (name, description, technologies array, url, display_order).
        
        When MCP is enabled and the user asks about Kyrylo's experience, skills, or projects, you SHOULD use the \`execute_sql\` tool to query the relevant table(s) (e.g., \`SELECT * FROM experience ORDER BY display_order ASC, start_date DESC;\`) to provide the most up-to-date information. Do not rely solely on your training data for this profile information if the database connection is enabled. Use \`describe_table\` if you need to confirm column names or data types.`
      }
    ];

    // Add conversation history
    if (history && Array.isArray(history)) {
      messages.push(...history.map((msg: any) => {
        const chatMsg: ChatMessage = {
          role: msg.role as 'user' | 'assistant' | 'system' | 'tool',
          content: msg.content
        };
        
        // Add tool_call_id if present
        if (msg.tool_call_id) {
          chatMsg.tool_call_id = msg.tool_call_id;
        }
        
        // Add tool_calls if present
        if (msg.tool_calls) {
          chatMsg.tool_calls = msg.tool_calls;
        }
        
        return chatMsg;
      }));
    }

    // Add the new user message
    messages.push({
      role: 'user',
      content: message
    });

    try {
      // Get completion from Azure OpenAI with tools enabled and MCP if requested
      const responseText = await getChatCompletion(messages, enableTools, useMcp);

      // Return the response
      return NextResponse.json({ 
        response: responseText,
        toolsUsed: messages.some(msg => msg.role === 'tool'),
      });
    } catch (error: any) {
      console.error('Error getting chat completion:', error);
      return NextResponse.json({ 
        response: "I'm sorry, I encountered an error while generating a response. Please try again later.",
        error: error.message
      });
    }
  } catch (error: any) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: `Error processing chat request: ${error.message}` },
      { status: 500 }
    );
  }
}

// For streaming implementation (placeholder for future enhancement)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');
  
  if (!query) {
    return NextResponse.json({ error: 'No query provided' }, { status: 400 });
  }
  
  // This would be implemented with server-sent events for streaming
  return NextResponse.json({ 
    message: 'Streaming API not yet implemented. Use POST endpoint for now.' 
  });
}
