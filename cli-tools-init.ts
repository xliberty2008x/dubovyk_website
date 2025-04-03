import { mcpServer } from '@/lib/mcp/server';
import { cliTools } from '@/lib/mcp/cli-tools';

// Register CLI tools with the MCP server
export function registerCLITools() {
  console.log('Registering CLI tools with MCP server...');
  
  cliTools.forEach(tool => {
    mcpServer.registerTool(tool);
    console.log(`Registered CLI tool: ${tool.name}`);
  });
  
  console.log(`Successfully registered ${cliTools.length} CLI tools`);
  return cliTools.length;
}

// Initialize CLI tools
export function initializeCLITools() {
  try {
    const count = registerCLITools();
    return {
      success: true,
      message: `Successfully initialized ${count} CLI tools`,
      count
    };
  } catch (error: any) {
    console.error('Error initializing CLI tools:', error);
    return {
      success: false,
      message: `Error initializing CLI tools: ${error.message}`,
      error
    };
  }
}
