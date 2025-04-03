#!/usr/bin/env node
const readline = require('readline');
const path = require('path');
const { 
  isValidRequest, 
  createErrorResponse, 
  createSuccessResponse,
  formatMcpContent 
} = require('./utils');
const {
  registerTool,
  registerToolGroup,
  executeTool,
  listTools,
  listCategories
} = require('./registry');

/**
 * MCP Server class for handling JSON-RPC requests and routing to appropriate tools
 */
class McpServer {
  constructor() {
    // Create readline interface for stdio communication
    this.rl = readline.createInterface({
      input: process.stdin,
      output: null, // No stdout, we'll handle output manually
      terminal: false
    });

    // Initialize tools
    this.initTools();

    // Setup handlers
    this.setupHandlers();
  }

  /**
   * Initialize tools from all categories
   */
  async initTools() {
    try {
      // Import and register database tools
      const databaseTools = require('../tools/database');
      databaseTools.register();

      // Try loading other tool categories if they exist
      try {
        const weatherTools = require('../tools/weather');
        weatherTools.register();
      } catch (error) {
        console.error('Weather tools not available', error.message);
      }

      try {
        const searchTools = require('../tools/search');
        searchTools.register();
      } catch (error) {
        console.error('Search tools not available', error.message);
      }

      console.error('Available tools:');
      listTools().forEach(tool => {
        console.error(`- ${tool.category}:${tool.name}: ${tool.description}`);
      });
    } catch (error) {
      console.error('Error initializing tools:', error);
    }
  }

  /**
   * Set up event handlers
   */
  setupHandlers() {
    // Handle line-delimited JSON-RPC requests
    this.rl.on('line', async (line) => {
      try {
        const request = JSON.parse(line);
        const response = await this.processRequest(request);
        console.log(JSON.stringify(response));
      } catch (error) {
        console.error('Error processing request:', error);
        const errorResponse = createErrorResponse(null, -32700, 'Parse error');
        console.log(JSON.stringify(errorResponse));
      }
    });

    // Handle process termination
    process.on('SIGINT', async () => {
      console.error('Shutting down...');
      process.exit(0);
    });
  }

  /**
   * Process a JSON-RPC request
   * @param {Object} request The request object
   * @returns {Object} JSON-RPC response
   */
  async processRequest(request) {
    // Validate request format
    if (!isValidRequest(request)) {
      return createErrorResponse(
        request.id || null,
        -32600,
        'Invalid Request'
      );
    }

    // Handle different methods
    const { method, params, id } = request;

    try {
      if (method === 'callTool') {
        // Extract tool information from params
        const { name, arguments: args = {} } = params;

        // Check if tool name is provided
        if (!name) {
          return createErrorResponse(id, -32602, 'Tool name is required');
        }

        // Parse tool category and name
        let category = 'database'; // Default category for backward compatibility
        let toolName = name;

        // Check if the tool name includes a category prefix
        if (name.includes(':')) {
          [category, toolName] = name.split(':');
        }

        // Execute the tool
        try {
          const result = await executeTool(category, toolName, args);
          // Format result as MCP content
          return createSuccessResponse(id, formatMcpContent(result));
        } catch (error) {
          return createErrorResponse(id, -32603, `Tool execution error: ${error.message}`);
        }
      } else if (method === 'listTools') {
        // Return list of available tools
        const tools = listTools().map(tool => ({
          name: `${tool.category}:${tool.name}`,
          description: tool.description,
          inputSchema: tool.inputSchema
        }));
        return createSuccessResponse(id, { tools });
      } else if (method === 'listCategories') {
        // Return list of available categories
        return createSuccessResponse(id, { categories: listCategories() });
      } else if (method === 'ping') {
        // Simple ping method for testing
        return createSuccessResponse(id, 'pong');
      } else {
        return createErrorResponse(id, -32601, 'Method not found');
      }
    } catch (error) {
      return createErrorResponse(id, -32603, `Internal error: ${error.message}`);
    }
  }

  /**
   * Start the server
   */
  start() {
    console.error('MCP server running on stdio');
    console.error('Waiting for line-delimited JSON-RPC requests...');
  }
}

// Create and start the server
const server = new McpServer();
server.start();

module.exports = McpServer;
