import axios from 'axios';
import { databaseTools, DBTool } from './db-tools';

// Interface for tool definition
export interface Tool {
  name: string;
  description: string;
  execute: (args: any) => Promise<string>;
}

// Interface for tool call in Azure OpenAI API format
export interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

// Sample weather tool implementation
export const weatherTool: Tool = {
  name: 'get_weather',
  description: 'Get the current weather for a location',
  execute: async (args: { location: string }) => {
    try {
      // In a real implementation, this would call a weather API
      // For demonstration purposes, returning a mock response
      return `The weather in ${args.location} is currently 25°C and sunny.`;
    } catch (error) {
      console.error('Error executing weather tool:', error);
      return `Sorry, I couldn't get the weather for ${args.location}.`;
    }
  }
};

// Sample search tool implementation
export const searchTool: Tool = {
  name: 'search',
  description: 'Search for information on a given topic',
  execute: async (args: { query: string }) => {
    try {
      // In a real implementation, this would call a search API
      // For demonstration purposes, returning a mock response
      return `Here are some search results for "${args.query}": 1. Sample result 1, 2. Sample result 2`;
    } catch (error) {
      console.error('Error executing search tool:', error);
      return `Sorry, I couldn't search for "${args.query}".`;
    }
  }
};

// Collection of available tools
export const availableTools: Tool[] = [
  weatherTool,
  searchTool,
];

// Get available tools based on MCP status
export function getAvailableTools(useMcp: boolean = false): Tool[] {
  let tools = [...availableTools];
  
  // Add database tools if MCP is enabled
  if (useMcp) {
    // Convert DB tools to regular tools
    const dbToolsAsTools: Tool[] = databaseTools.map(dbTool => ({
      name: dbTool.name,
      description: dbTool.description,
      execute: dbTool.execute
    }));
    
    tools = [...tools, ...dbToolsAsTools];
  }
  
  return tools;
}

// Function to get tool by name
export function getToolByName(name: string, useMcp: boolean = false): Tool | undefined {
  // Get all available tools including MCP tools if enabled
  const tools = getAvailableTools(useMcp);
  return tools.find(tool => tool.name === name);
}

// Function to get Azure OpenAI tool definitions format
export function getToolDefinitions(useMcp: boolean = false) {
  // Get tools based on MCP status
  const tools = getAvailableTools(useMcp);
  
  return tools.map(tool => {
    let parameters;
    
    // Define parameters based on tool type
    switch (tool.name) {
      case 'get_weather':
        parameters = {
          type: 'object',
          properties: {
            location: {
              type: 'string',
              description: 'The city and state, e.g. San Francisco, CA',
            }
          },
          required: ['location'],
          examples: [
            { location: "San Francisco, CA" },
            { location: "New York, NY" }
          ]
        };
        break;
        
      case 'search':
        parameters = {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'The search query',
            }
          },
          required: ['query'],
          examples: [
            { query: "latest AI developments" },
            { query: "climate change solutions" }
          ]
        };
        break;
        
      case 'db_list_tables':
        parameters = {
          type: 'object',
          properties: {},
          required: [],
          examples: [
            {} // No parameters needed
          ]
        };
        break;
        
      case 'db_get_table_schema':
        parameters = {
          type: 'object',
          properties: {
            table: {
              type: 'string',
              description: 'The name of the table to get the schema for',
            }
          },
          required: ['table'],
          examples: [
            { table: "users" },
            { table: "products" },
            { table: "orders" },
            { table: "skill_accuracy_by_date" }
          ]
        };
        break;
        
      case 'db_query':
        parameters = {
          type: 'object',
          properties: {
            sql: {
              type: 'string',
              description: 'The SQL query to execute (SELECT queries only)',
            },
            params: {
              type: 'array',
              description: 'Parameters for the SQL query',
              items: {
                type: 'string'
              }
            }
          },
          required: ['sql'],
          examples: [
            { 
              sql: "SELECT * FROM users LIMIT 10",
              params: []
            },
            { 
              sql: "SELECT * FROM products WHERE category = $1",
              params: ["electronics"]
            },
            {
              sql: "SELECT * FROM skill_accuracy_by_date WHERE date > $1",
              params: ["2023-01-01"]
            }
          ]
        };
        break;
        
      case 'db_count_rows':
        parameters = {
          type: 'object',
          properties: {
            table: {
              type: 'string',
              description: 'The name of the table to count rows in',
            },
            condition: {
              type: 'string',
              description: 'Optional WHERE condition (without the WHERE keyword)',
            }
          },
          required: ['table'],
          examples: [
            { table: "users" },
            { table: "products", condition: "category = 'electronics'" },
            { table: "skill_accuracy_by_date", condition: "date > '2023-01-01'" }
          ]
        };
        break;
        
      default:
        parameters = {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'The query parameter',
            }
          },
          required: ['query']
        };
    }
    
    return {
      type: 'function',
      function: {
        name: tool.name,
        description: tool.description,
        parameters
      }
    };
  });
}

// Process tool calls from Azure OpenAI response
export async function processToolCalls(toolCalls: ToolCall[], useMcp: boolean = false): Promise<any[]> {
  const results = [];
  // Get all tools including MCP tools if enabled
  const allTools = getAvailableTools(useMcp);
  
  for (const toolCall of toolCalls) {
    const toolName = toolCall.function.name;
    // Try to find the tool in all available tools
    const tool = allTools.find(t => t.name === toolName);
    
    if (!tool) {
      results.push({
        tool_call_id: toolCall.id,
        role: 'tool',
        content: `Error: Tool '${toolName}' not found`,
      });
      continue;
    }
    
    try {
      const args = JSON.parse(toolCall.function.arguments);
      const result = await tool.execute(args);
      
      // Just pass the raw result string directly to the LLM
      results.push({
        tool_call_id: toolCall.id,
        role: 'tool',
        content: result, // This will be the raw JSON string from db-tools.ts
      });
    } catch (error) {
      console.error(`Error executing tool ${toolName}:`, error);
      results.push({
        tool_call_id: toolCall.id,
        role: 'tool',
        content: JSON.stringify({ error: `Error executing tool: ${error}` }),
      });
    }
  }
  
  return results;
}
