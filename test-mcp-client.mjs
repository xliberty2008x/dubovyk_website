// Simple script to test MCP client through the Next.js API proxy
import fetch from 'node-fetch';

async function testMcpProxy() {
  console.log('Testing MCP proxy API...');
  
  try {
    const response = await fetch('http://localhost:3000/api/mcp-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tool: 'database:get_tables',
        arguments: {},
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const result = await response.json();
    console.log('Response from MCP proxy:', JSON.stringify(result, null, 2));
    
    console.log('Success! Response received from MCP proxy.');
  } catch (error) {
    console.error('Error testing MCP proxy:', error);
  }
}

testMcpProxy();
