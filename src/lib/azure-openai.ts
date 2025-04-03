import { default as axios } from 'axios';
import { getToolDefinitions, processToolCalls, ToolCall } from './ai-tools';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  tool_call_id?: string;
  tool_calls?: ToolCall[];
}

export async function getChatCompletion(messages: ChatMessage[], enableTools: boolean = true, useMcp: boolean = false) {
  const apiKey = process.env.AZURE_OPENAI_API_KEY;
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
  const apiVersion = process.env.AZURE_OPENAI_API_VERSION || '2024-02-15-preview';
  
  if (!apiKey || !endpoint || !deploymentName) {
    throw new Error("Azure OpenAI configuration is incomplete");
  }
  
  const url = `${endpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=${apiVersion}`;

  // Prepare request payload
  const payload: any = {
    messages: messages,
    temperature: 0.7,
    max_tokens: 800,
  };
  
  // Add tools if enabled
  if (enableTools) {
    payload.tools = getToolDefinitions(useMcp);
    payload.tool_choice = "auto"; // Let the model decide when to use tools
  }

  try {
    const response = await axios.post(
      url,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey,
        },
      }
    );
    
    if (!response.data.choices || response.data.choices.length === 0) {
      throw new Error("No response generated");
    }
    
    const assistantMessage = response.data.choices[0].message;
    
    // Handle tool calls if any
    if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
      // Add the assistant message with tool calls to the conversation
      messages.push({
        role: 'assistant',
        content: assistantMessage.content || '',
        tool_calls: assistantMessage.tool_calls
      });
      
      // Process tool calls and get results (pass MCP flag)
      const toolResults = await processToolCalls(assistantMessage.tool_calls, useMcp);
      
      // Add tool results to the conversation
      messages.push(...toolResults);
      
      // Get a new completion with the tool results
      return getChatCompletion(messages, enableTools, useMcp);
    }
    
    // Return the text response if no tool calls
    return assistantMessage.content || '';
  } catch (error) {
    console.error("Error getting chat completion:", error);
    if (axios.isAxiosError(error) && error.response) {
      console.error("Azure OpenAI API error:", error.response.data);
    }
    throw error;
  }
}

// Function to enable/disable MCP integration
export function useMcpServer(enable: boolean = false): boolean {
  if (enable) {
    console.log('PostgreSQL MCP server integration enabled');
    // In a production environment, this might do something like
    // initializing a connection pool or setting up a client
  } else {
    console.log('PostgreSQL MCP server integration disabled');
  }
  return enable;
}

// Interface for MCP PostgreSQL query results
export interface PostgresQueryResult {
  rows: any[];
  rowCount: number;
  fields: {
    name: string;
    dataTypeID: number;
    tableID: number;
  }[];
}

// Function to execute a PostgreSQL query via MCP
export async function executePostgresQuery(sql: string, params: any[] = []): Promise<PostgresQueryResult | null> {
  try {
    // This would be an actual MCP call
    // For now, we'll just log the query
    console.log(`Executing PostgreSQL query via MCP: ${sql}`);
    console.log(`Query parameters: ${JSON.stringify(params)}`);
    
    // The actual implementation would use the MCP SDK to call the tool
    // For demo purposes, just returning a mock result
    return null;
  } catch (error) {
    console.error('Error executing PostgreSQL query via MCP:', error);
    throw error;
  }
}

// Function to get database tables via MCP
export async function getPostgresTables(): Promise<string[]> {
  try {
    console.log('Getting PostgreSQL tables via MCP');
    // The actual implementation would use the MCP SDK to call the tool
    // For demo purposes, just returning a mock result
    return [];
  } catch (error) {
    console.error('Error getting PostgreSQL tables via MCP:', error);
    throw error;
  }
}

// Function to get a table schema via MCP
export async function getPostgresTableSchema(tableName: string): Promise<any> {
  try {
    console.log(`Getting PostgreSQL table schema for ${tableName} via MCP`);
    // The actual implementation would use the MCP SDK to call the tool
    // For demo purposes, just returning a mock result
    return null;
  } catch (error) {
    console.error('Error getting PostgreSQL table schema via MCP:', error);
    throw error;
  }
}
