/**
 * MCP Proxy Debug Tool
 * This script helps diagnose issues with the MCP Postgres connection
 * Run with: node src/mcp-test/mcp-proxy-debug.js
 */

const http = require('http');

// Create a simple HTTP server to simulate the MCP server
const server = http.createServer((req, res) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  
  // Log headers
  console.log('Headers:', req.headers);
  
  // Handle POST requests
  if (req.method === 'POST') {
    let body = '';
    
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      console.log('Request body:', body);
      
      try {
        const requestData = JSON.parse(body);
        
        // Create a response based on the request method
        let responseData;
        
        if (requestData.method === 'ping') {
          responseData = {
            jsonrpc: '2.0',
            result: 'pong',
            id: requestData.id,
          };
        } else if (requestData.method === 'callTool') {
          // Handle tool calls
          if (requestData.params.name === 'get_tables') {
            responseData = {
              jsonrpc: '2.0',
              result: {
                content: [
                  {
                    type: 'text',
                    text: JSON.stringify({ tables: ['users', 'products', 'orders'] }),
                  },
                ],
              },
              id: requestData.id,
            };
          } else if (requestData.params.name === 'query') {
            responseData = {
              jsonrpc: '2.0',
              result: {
                content: [
                  {
                    type: 'text',
                    text: JSON.stringify({
                      rows: [
                        { id: 1, name: 'Test User', email: 'test@example.com' },
                      ],
                      rowCount: 1,
                    }),
                  },
                ],
              },
              id: requestData.id,
            };
          } else {
            responseData = {
              jsonrpc: '2.0',
              result: {
                content: [
                  {
                    type: 'text',
                    text: `Mock response for tool: ${requestData.params.name}`,
                  },
                ],
              },
              id: requestData.id,
            };
          }
        } else {
          responseData = {
            jsonrpc: '2.0',
            error: {
              code: -32601,
              message: `Method not found: ${requestData.method}`,
            },
            id: requestData.id,
          };
        }
        
        // Send the response
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(200);
        res.end(JSON.stringify(responseData));
        
      } catch (error) {
        console.error('Error processing request:', error);
        
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(400);
        res.end(JSON.stringify({
          jsonrpc: '2.0',
          error: {
            code: -32700,
            message: 'Parse error',
          },
          id: null,
        }));
      }
    });
  } else {
    // Handle all other request methods
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    res.end(JSON.stringify({
      status: 'MCP debug proxy is running',
    }));
  }
});

// Start the server on port 3001
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`MCP debug proxy server listening on port ${PORT}`);
  console.log('This server simulates the MCP Postgres server for debugging purposes');
  console.log('Press Ctrl+C to stop the server');
});
