// MCP (Model Context Protocol) Implementation
// Based on https://github.com/modelcontextprotocol/servers

export interface MCPTool {
  name: string;
  description: string;
  parameters: any; // JSON Schema
  execute: (args: any) => Promise<any>;
}

export interface MCPContext {
  tools: MCPTool[];
  addTool: (tool: MCPTool) => void;
  removeTool: (name: string) => void;
  getTool: (name: string) => MCPTool | undefined;
  getAllTools: () => MCPTool[];
}

export class MCPServer {
  private context: MCPContext;
  
  constructor() {
    this.context = {
      tools: [],
      
      addTool: (tool: MCPTool) => {
        // Check if tool with same name already exists
        const existingToolIndex = this.context.tools.findIndex(t => t.name === tool.name);
        if (existingToolIndex >= 0) {
          this.context.tools[existingToolIndex] = tool;
        } else {
          this.context.tools.push(tool);
        }
      },
      
      removeTool: (name: string) => {
        this.context.tools = this.context.tools.filter(tool => tool.name !== name);
      },
      
      getTool: (name: string) => {
        return this.context.tools.find(tool => tool.name === name);
      },
      
      getAllTools: () => {
        return [...this.context.tools];
      }
    };
    
    // Add some default tools
    this.addDefaultTools();
  }
  
  private addDefaultTools() {
    // Example tool: Get current date and time
    this.context.addTool({
      name: 'getCurrentDateTime',
      description: 'Get the current date and time',
      parameters: {
        type: 'object',
        properties: {
          format: {
            type: 'string',
            description: 'Date format (optional)',
            default: 'YYYY-MM-DD HH:mm:ss'
          }
        }
      },
      execute: async (args: any) => {
        const now = new Date();
        return {
          iso: now.toISOString(),
          formatted: now.toLocaleString(),
          timestamp: now.getTime()
        };
      }
    });
  }
  
  // Process a request from the LLM
  async processRequest(request: any): Promise<any> {
    // If the request is a tool call
    if (request.type === 'tool_call') {
      const { name, arguments: args } = request;
      const tool = this.context.getTool(name);
      
      if (!tool) {
        return {
          error: `Tool '${name}' not found`,
          available_tools: this.context.getAllTools().map(t => t.name)
        };
      }
      
      try {
        const result = await tool.execute(args);
        return {
          result,
          tool: name
        };
      } catch (error) {
        return {
          error: `Error executing tool '${name}': ${error}`,
          tool: name
        };
      }
    }
    
    // If the request is for available tools
    if (request.type === 'get_tools') {
      return {
        tools: this.context.getAllTools().map(tool => ({
          name: tool.name,
          description: tool.description,
          parameters: tool.parameters
        }))
      };
    }
    
    return {
      error: 'Invalid request type',
      supported_types: ['tool_call', 'get_tools']
    };
  }
  
  // Register a new tool
  registerTool(tool: MCPTool): void {
    this.context.addTool(tool);
  }
  
  // Unregister a tool
  unregisterTool(name: string): void {
    this.context.removeTool(name);
  }
  
  // Get all registered tools
  getTools(): MCPTool[] {
    return this.context.getAllTools();
  }
}

// Export a singleton instance
export const mcpServer = new MCPServer();
