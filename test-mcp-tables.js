// Simple script to test MCP database tables functionality
// For Node.js versions prior to v18, we need to use node-fetch as a module
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testGetTables() {
  console.log('Testing MCP get_tables functionality...');
  
  try {
    const response = await fetch('http://localhost:3004/api/mcp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'callTool',
        params: {
          name: 'database:get_tables',
          arguments: {}
        },
        id: '1'
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const result = await response.json();
    console.log('Response:', JSON.stringify(result, null, 2));
    
    if (result.error) {
      console.error('Error from MCP server:', result.error);
      return;
    }
    
    console.log('Success! Tables retrieved from database.');
  } catch (error) {
    console.error('Error testing MCP get_tables:', error);
  }
}

testGetTables();
