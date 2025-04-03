# Unified MCP (Model Context Protocol) Integration Guide

This guide explains how the MCP system works in this project, how to run the MCP server, and how to add new tools. It's designed to be beginner-friendly while providing complete information for customization.

## What is MCP?

MCP (Model Context Protocol) is a protocol that allows AI assistants like the one in this project to interact with external systems, such as databases, APIs, or custom tools. It extends the capabilities of the AI by giving it access to data and functions beyond what's in its training data.

## How MCP Works in This Project

In this project, we've implemented a unified MCP server architecture that can support multiple tool categories. Here's a high-level overview of how it works:

1. **Unified MCP Server**: An integrated MCP server located at `src/mcp-server/` provides tools from multiple categories (database, weather, search, etc.).
2. **MCP Client**: The project includes a client library (`src/lib/mcp-client.ts`) that communicates with the MCP server.
3. **MCP Proxy**: A proxy API endpoint (`/api/mcp-proxy`) forwards requests from the frontend to the MCP server.
4. **Auto Connection**: The AI assistant automatically connects to the MCP server when loaded, enabling database and other tool capabilities by default.

### MCP Architecture

The unified MCP server is organized into the following components:

- **Core**: The core server framework that loads and manages tools
  - `server.js`: Main MCP server implementation
  - `registry.js`: Tool registration system
  - `utils.js`: Shared utility functions

- **Tools**: Tool implementations organized by category
  - `database/`: Database-related tools (PostgreSQL)
  - `weather/`: Weather-related tools
  - `search/`: Search-related tools

- **Express Bridge**: HTTP server that interfaces with the MCP server

### Flow of Data

1. When the user enables the MCP toggle, the client attempts to connect to the MCP server.
2. When the AI assistant needs database information, it calls functions from the MCP client library.
3. These functions make requests to the MCP proxy API endpoint.
4. The proxy forwards these requests to the MCP server.
5. The MCP server executes the requests (e.g., SQL queries) and returns the results.
6. The results flow back through the proxy to the client, where they're used by the AI assistant.

## Setting Up and Running the MCP Server

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database (local or remote)

### Configuration

1. The MCP server is configured in the file:
   - For VSCode extension: `/Users/cyrildubovik/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`
   - For Claude desktop app: `~/Library/Application Support/Claude/claude_desktop_config.json`

2. The configuration looks like this:
   ```json
   {
     "mcpServers": {
       "postgres": {
         "command": "node",
         "args": ["/Users/cyrildubovik/Python_projects/mcp-postgres/src/express-bridge/index.js"],
         "env": {
           "DB_HOST": "your-db-host",
           "DB_PORT": "5432",
           "DB_NAME": "your-db-name",
           "DB_USER": "your-db-user",
           "DB_PASSWORD": "your-db-password",
           "DB_SCHEMA": "public",
           "PGSSLMODE": "require",
           "MCP_SERVER_PORT": "3001"
         },
         "disabled": false,
         "autoApprove": []
       }
     }
   }
   ```

3. Modify the environment variables to match your PostgreSQL database connection details.

### Running the Server

**Method 1: Manual Start**

Navigate to the MCP server directory and run the Express bridge:

```bash
cd /Users/cyrildubovik/Python_projects/mcp-postgres
node src/express-bridge/index.js
```

**Method 2: Using VSCode Extension or Claude Desktop App**

If you've configured the MCP server in the settings file, it will automatically start when you use the VSCode extension or Claude desktop app.

### Verifying the Server is Running

1. Once started, the server should output: `PostgreSQL MCP Bridge server listening on port 3001`
2. You can check if the server is running with: `lsof -i:3001 | grep LISTEN`

## Running the Application with MCP

1. Make sure the MCP server is running (see above).
2. Start the application:
   ```bash
   ./start.sh
   ```
3. Open the application in a browser: `http://localhost:3000` (or another port if 3000 is in use)
4. In the chat interface, click the settings gear icon.
5. Enable the "Use PostgreSQL Database (MCP)" toggle.
6. You should see a "Connected" status and a message indicating the database tools are ready.

## Adding New MCP Tools

You can extend the MCP functionality by adding new tools. Here's how:

### 1. Create a New MCP Server (or Extend the Existing One)

Create a new MCP server project:

```bash
# Install the MCP SDK
npm install @modelcontextprotocol/sdk

# Create a new directory for your MCP server
mkdir my-custom-mcp-server
cd my-custom-mcp-server

# Initialize a Node.js project
npm init -y

# Add TypeScript
npm install typescript ts-node @types/node --save-dev

# Create a tsconfig.json file
echo '{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "outDir": "build",
    "strict": true
  },
  "include": ["src/**/*"]
}' > tsconfig.json
```

### 2. Implement Your MCP Server

Create a file at `src/index.ts`:

```typescript
#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

class MyCustomMcpServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'my-custom-mcp-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    
    // Error handling
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    // Define available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'my_custom_tool', // Tool name
          description: 'Description of what this tool does', // Human-readable description
          inputSchema: {
            // JSON Schema for parameters
            type: 'object',
            properties: {
              param1: {
                type: 'string',
                description: 'First parameter',
              },
              param2: {
                type: 'number',
                description: 'Second parameter',
              },
            },
            required: ['param1'], // Array of required property names
          },
        },
      ],
    }));

    // Implement tool functionality
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (request.params.name !== 'my_custom_tool') {
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${request.params.name}`
        );
      }

      // Validate and extract parameters
      const { param1, param2 = 0 } = request.params.arguments;
      
      try {
        // Implement your tool's functionality here
        const result = `Processed ${param1} with value ${param2}`;
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ result }),
            },
          ],
        };
      } catch (error: any) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Custom MCP server running on stdio');
  }
}

const server = new MyCustomMcpServer();
server.run().catch(console.error);
```

### 3. Create an Express Bridge (Optional, for HTTP access)

If you want to access your MCP server via HTTP (like the PostgreSQL server in this project), create a file at `src/express-bridge/index.js`:

```javascript
#!/usr/bin/env node
const { spawn } = require('child_process');
const express = require('express');
const cors = require('cors');
const path = require('path');

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// Port from environment variable or default to 3002
const PORT = process.env.MCP_SERVER_PORT || 3002;

// Start the MCP server process
const mcpServerPath = path.join(__dirname, '../build/index.js');
console.log(`Starting MCP server: ${mcpServerPath}`);

// Log environment variables (without sensitive data)
console.log('Environment variables:');
Object.keys(process.env).forEach(key => {
  if (!key.includes('PASSWORD') && !key.includes('SECRET')) {
    console.log(`${key}: ${process.env[key]}`);
  }
});

const mcpProcess = spawn('node', [mcpServerPath], {
  stdio: ['pipe', 'pipe', 'pipe'],
  env: process.env
});

// Handle MCP process stderr (log messages)
mcpProcess.stderr.on('data', (data) => {
  console.log(`MCP stderr: ${data}`);
});

// Handle MCP process stdout (JSON-RPC messages)
let currentResponse = '';
mcpProcess.stdout.on('data', (data) => {
  currentResponse += data.toString();
  
  // Extract full JSON objects
  while (true) {
    const match = currentResponse.match(/^.*}\s*(.*)/s);
    if (!match) break;
    
    const jsonStr = currentResponse.substring(0, 
      currentResponse.length - match[1].length);
    currentResponse = match[1];
    
    try {
      const parsed = JSON.parse(jsonStr);
      console.log(`MCP stdout: ${jsonStr}`);
      
      // Store the response to send to clients
      if (parsed.id && pendingRequests[parsed.id]) {
        const { res } = pendingRequests[parsed.id];
        res.json(parsed);
        delete pendingRequests[parsed.id];
      }
    } catch (e) {
      console.error(`Error parsing JSON: ${e.message}`);
    }
  }
});

// Store pending requests by ID
const pendingRequests = {};

// API endpoint for MCP calls
app.post('/api/mcp', (req, res) => {
  const rpcRequest = req.body;
  
  // Store the response object for later use
  pendingRequests[rpcRequest.id] = { res };
  
  // Send the request to the MCP server
  mcpProcess.stdin.write(JSON.stringify(rpcRequest) + '\n');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'Custom MCP server bridge is running'
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Custom MCP Bridge server listening on port ${PORT}`);
  console.log(`API endpoint available at http://localhost:${PORT}/api/mcp`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
  console.log('Press Ctrl+C to stop the server');
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down...');
  mcpProcess.kill();
  process.exit(0);
});
```

### 4. Install Dependencies and Build

```bash
# Install Express for the bridge
npm install express cors

# Build the project
npx tsc
```

### 5. Add Your MCP Server to the Configuration

Add your custom MCP server to the MCP settings file:

```json
{
  "mcpServers": {
    "postgres": { ... },
    "my-custom-server": {
      "command": "node",
      "args": ["/path/to/my-custom-mcp-server/src/express-bridge/index.js"],
      "env": {
        "MY_ENV_VAR": "my-value",
        "MCP_SERVER_PORT": "3002"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

### 6. Integrate with the Application

1. Add client functions to interact with your new tools in `src/lib/mcp-client.ts`:

```typescript
/**
 * Call the custom tool
 * @param param1 First parameter
 * @param param2 Second parameter
 * @returns Result from the custom tool
 */
export async function mcpCallCustomTool(param1: string, param2?: number): Promise<any> {
  try {
    // Construct absolute URL to handle both client and server-side calls
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3002';
    
    const response = await fetch(`${baseUrl}/api/mcp-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tool: 'my_custom_tool',
        arguments: {
          param1,
          param2,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error calling custom MCP tool:', error);
    return null;
  }
}
```

2. Update `src/lib/db-tools.ts` or create a new file for your custom tools:

```typescript
import { mcpCallCustomTool } from './mcp-client';

export function executeCustomTool(param1: string, param2?: number) {
  return {
    name: 'execute_custom_tool',
    description: 'Execute the custom tool',
    parameters: {
      param1: { type: 'string', description: 'First parameter' },
      param2: { type: 'number', description: 'Second parameter', optional: true },
    },
    execute: async ({ param1, param2 }) => {
      const result = await mcpCallCustomTool(param1, param2);
      return `Result: ${JSON.stringify(result)}`;
    },
  };
}
```

3. Register your tool in `src/lib/ai-tools.ts`:

```typescript
import { executeCustomTool } from './your-tools-file';

const availableTools = [
  // ...existing tools
  executeCustomTool,
];
```

## Troubleshooting

### MCP Server Won't Start

- Check the path to your MCP server in the configuration file
- Ensure you have the correct permissions to run the file
- Check if the port (e.g., 3001) is already in use

### Connection Issues

- Verify the MCP server is running (`lsof -i:3001 | grep LISTEN`)
- Check the database connection details in the environment variables
- Look for error messages in the terminal output

### Integration Issues

- Make sure the fetch URLs in the client code are correct
  - For server-side rendering, relative URLs won't work; use absolute URLs
  - For example: `const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3002';`
- Ensure the tool names match between the MCP server and client code

## Best Practices

1. **Error Handling**: Always include proper error handling in both the MCP server and client code.
2. **URL Resolution**: Use absolute URLs for fetch requests to handle both client and server-side rendering.
3. **Tool Names**: Use consistent naming conventions for tools across all components.
4. **Documentation**: Document your tools well, including parameter descriptions and examples.
5. **Security**: Be careful with database credentials and consider using environment variables or a .env file.
6. **Testing**: Test your MCP tools thoroughly before integrating them into the application.

## Conclusion

MCP integration allows you to extend the capabilities of your AI assistant with custom tools and data sources. By following this guide, you should be able to run the existing MCP server and add your own custom tools to enhance the functionality of your application.
