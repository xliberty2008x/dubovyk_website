/**
 * Tool registry for the MCP server
 * This module handles registration and discovery of tools from different categories
 */

// Store all registered tools
const toolRegistry = new Map();
// Store tool categories
const categories = new Set();

/**
 * Register a tool with the registry
 * @param {string} category The category the tool belongs to (e.g., 'database', 'weather')
 * @param {string} name The name of the tool
 * @param {Function} handler The function that implements the tool
 * @param {Object} schema JSON schema describing the tool's input parameters
 * @param {string} description Human-readable description of the tool
 */
function registerTool(category, name, handler, schema, description) {
  if (!category || !name || !handler) {
    throw new Error('Category, name, and handler are required to register a tool');
  }

  // Add the category to the set of categories
  categories.add(category);

  // Create a full tool definition
  const toolDef = {
    category,
    name,
    handler,
    schema: schema || { type: 'object', properties: {} },
    description: description || `${category}/${name} tool`
  };

  // Register the tool
  const toolKey = `${category}:${name}`;
  toolRegistry.set(toolKey, toolDef);

  console.log(`Registered tool: ${toolKey}`);
}

/**
 * Get a tool by category and name
 * @param {string} category The tool category
 * @param {string} name The tool name
 * @returns {Object|undefined} The tool definition or undefined if not found
 */
function getTool(category, name) {
  return toolRegistry.get(`${category}:${name}`);
}

/**
 * Execute a tool by category and name
 * @param {string} category The tool category
 * @param {string} name The tool name
 * @param {Object} args The arguments to pass to the tool
 * @returns {Promise<Object>} The result of executing the tool
 */
async function executeTool(category, name, args = {}) {
  const tool = getTool(category, name);
  
  if (!tool) {
    throw new Error(`Tool not found: ${category}:${name}`);
  }

  // Execute the tool handler with the provided arguments
  return await tool.handler(args);
}

/**
 * List all available tools
 * @returns {Array<Object>} Array of tool definitions
 */
function listTools() {
  return Array.from(toolRegistry.values()).map(tool => ({
    id: `${tool.category}:${tool.name}`,
    category: tool.category,
    name: tool.name,
    description: tool.description,
    inputSchema: tool.schema
  }));
}

/**
 * List all categories
 * @returns {Array<string>} Array of category names
 */
function listCategories() {
  return Array.from(categories);
}

/**
 * List tools by category
 * @param {string} category The category to filter by
 * @returns {Array<Object>} Array of tool definitions in the category
 */
function listToolsByCategory(category) {
  return listTools().filter(tool => tool.category === category);
}

/**
 * Register multiple tools at once
 * @param {string} category The category for all tools in the group
 * @param {Object} toolDefinitions Object mapping tool names to handlers and metadata
 */
function registerToolGroup(category, toolDefinitions) {
  Object.entries(toolDefinitions).forEach(([name, def]) => {
    registerTool(
      category,
      name,
      def.handler,
      def.schema,
      def.description
    );
  });
}

module.exports = {
  registerTool,
  getTool,
  executeTool,
  listTools,
  listCategories,
  listToolsByCategory,
  registerToolGroup
};
