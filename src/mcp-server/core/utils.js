/**
 * Utility functions for the MCP server
 */

/**
 * Validates if an object is a valid JSON-RPC request
 * @param {Object} request The request object to validate
 * @returns {boolean} True if valid, false otherwise
 */
function isValidRequest(request) {
  return (
    request &&
    request.jsonrpc === '2.0' &&
    request.method &&
    typeof request.method === 'string' &&
    request.id !== undefined
  );
}

/**
 * Creates a JSON-RPC error response
 * @param {string} id The request ID
 * @param {number} code The error code
 * @param {string} message The error message
 * @returns {Object} A JSON-RPC error response
 */
function createErrorResponse(id, code, message) {
  return {
    jsonrpc: '2.0',
    error: {
      code,
      message
    },
    id
  };
}

/**
 * Creates a JSON-RPC success response
 * @param {string} id The request ID
 * @param {Object} result The result object
 * @returns {Object} A JSON-RPC success response
 */
function createSuccessResponse(id, result) {
  return {
    jsonrpc: '2.0',
    result,
    id
  };
}

/**
 * Creates a standard MCP content response
 * @param {any} content The content to format
 * @returns {Object} A formatted MCP content object
 */
function formatMcpContent(content) {
  // Ensure valid JSON formatting in the result
  return {
    content: [
      {
        type: 'text',
        text: typeof content === 'string' 
          ? content 
          : JSON.stringify(content, null, 2).replace(/,/g, ', ')
      }
    ]
  };
}

/**
 * Handles errors in async functions by wrapping them in try/catch
 * @param {Function} fn The async function to wrap
 * @returns {Function} A function that handles errors
 */
function asyncErrorHandler(fn) {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      return { error: error.message || 'Unknown error occurred' };
    }
  };
}

module.exports = {
  isValidRequest,
  createErrorResponse,
  createSuccessResponse,
  formatMcpContent,
  asyncErrorHandler
};
