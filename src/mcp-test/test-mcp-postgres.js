/**
 * Simple test script to check the PostgreSQL MCP connection
 * Run with: node src/mcp-test/test-mcp-postgres.js
 */

// Test the MCP connection by calling the mcp-status endpoint
async function testMcpConnection() {
  try {
    console.log('Testing MCP PostgreSQL connection...');
    
    // Call the MCP status endpoint
    const response = await fetch('http://localhost:3009/api/mcp-status');
    const data = await response.json();
    
    console.log('MCP Status Response:', data);
    
    if (data.status === 'connected') {
      console.log('✅ MCP PostgreSQL connection successful!');
    } else {
      console.log('❌ MCP PostgreSQL connection failed:', data.message);
    }
    
    return data;
  } catch (error) {
    console.error('Error testing MCP connection:', error);
    return { status: 'error', message: error.message };
  }
}

// Test getting database tables
async function testGetTables() {
  try {
    console.log('\nTesting MCP get_tables...');
    
    const response = await fetch('http://localhost:3009/api/mcp-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tool: 'get_tables',
        arguments: {},
      }),
    });
    
    const data = await response.json();
    console.log('MCP get_tables response:', data);
    
    if (data.status === 'success') {
      console.log('✅ Successfully retrieved tables');
    } else {
      console.log('❌ Failed to get tables:', data.error);
    }
    
    return data;
  } catch (error) {
    console.error('Error getting tables:', error);
    return { status: 'error', message: error.message };
  }
}

// Test querying the database
async function testQuery() {
  try {
    console.log('\nTesting MCP query...');
    
    const response = await fetch('http://localhost:3009/api/mcp-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tool: 'query',
        arguments: {
          sql: 'SELECT * FROM users LIMIT 5',
          params: [],
        },
      }),
    });
    
    const data = await response.json();
    console.log('MCP query response:', data);
    
    if (data.status === 'success') {
      console.log('✅ Successfully executed query');
    } else {
      console.log('❌ Failed to execute query:', data.error);
    }
    
    return data;
  } catch (error) {
    console.error('Error executing query:', error);
    return { status: 'error', message: error.message };
  }
}

// Run all tests
async function runTests() {
  // First test the connection
  const connectionResult = await testMcpConnection();
  
  // Only proceed with other tests if connection was successful
  if (connectionResult.status === 'connected') {
    await testGetTables();
    await testQuery();
  }
  
  console.log('\nAll tests completed');
}

// Run the tests
runTests().catch(console.error);
