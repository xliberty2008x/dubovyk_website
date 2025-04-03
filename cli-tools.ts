import { MCPTool } from '@/lib/mcp/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

// CLI Tool for executing shell commands
export const cliTool: MCPTool = {
  name: 'executeCommand',
  description: 'Execute a shell command and return the result',
  parameters: {
    type: 'object',
    properties: {
      command: {
        type: 'string',
        description: 'The shell command to execute'
      },
      timeout: {
        type: 'number',
        description: 'Timeout in milliseconds (optional, default: 10000)'
      }
    },
    required: ['command']
  },
  execute: async (args: any) => {
    try {
      // Security check - list of allowed commands
      const allowedCommands = [
        'ls', 'pwd', 'echo', 'date', 'cat', 'grep', 'find',
        'head', 'tail', 'wc', 'sort', 'uniq', 'curl'
      ];
      
      // Extract the base command (first word)
      const baseCommand = args.command.trim().split(' ')[0];
      
      // Check if the command is allowed
      if (!allowedCommands.includes(baseCommand)) {
        return {
          error: `Command '${baseCommand}' is not allowed for security reasons. Allowed commands: ${allowedCommands.join(', ')}`
        };
      }
      
      // Set timeout (default: 10 seconds)
      const timeout = args.timeout || 10000;
      
      // Execute the command with timeout
      const { stdout, stderr } = await execPromise(args.command, { timeout });
      
      if (stderr) {
        return {
          warning: stderr,
          result: stdout || 'Command executed with warnings.'
        };
      }
      
      return {
        result: stdout || 'Command executed successfully with no output.'
      };
    } catch (error: any) {
      return {
        error: `Error executing command: ${error.message}`
      };
    }
  }
};

// File System Tool for reading files
export const readFileTool: MCPTool = {
  name: 'readFile',
  description: 'Read the contents of a file',
  parameters: {
    type: 'object',
    properties: {
      path: {
        type: 'string',
        description: 'The path to the file to read'
      },
      maxLines: {
        type: 'number',
        description: 'Maximum number of lines to read (optional)'
      }
    },
    required: ['path']
  },
  execute: async (args: any) => {
    try {
      // Security check - only allow reading from certain directories
      const allowedPaths = [
        '/home/ubuntu/kir-dubovyk-website/data',
        '/home/ubuntu/kir-dubovyk-website/public',
        '/tmp'
      ];
      
      // Check if the path is allowed
      const isAllowed = allowedPaths.some(allowedPath => args.path.startsWith(allowedPath));
      
      if (!isAllowed) {
        return {
          error: `Reading from path '${args.path}' is not allowed for security reasons. Allowed paths: ${allowedPaths.join(', ')}`
        };
      }
      
      // Read the file
      const { stdout, stderr } = await execPromise(
        args.maxLines 
          ? `head -n ${args.maxLines} "${args.path}"` 
          : `cat "${args.path}"`
      );
      
      if (stderr) {
        return {
          error: stderr
        };
      }
      
      return {
        content: stdout
      };
    } catch (error: any) {
      return {
        error: `Error reading file: ${error.message}`
      };
    }
  }
};

// System Information Tool
export const systemInfoTool: MCPTool = {
  name: 'getSystemInfo',
  description: 'Get system information',
  parameters: {
    type: 'object',
    properties: {
      type: {
        type: 'string',
        enum: ['cpu', 'memory', 'disk', 'os', 'all'],
        description: 'Type of system information to retrieve'
      }
    },
    required: ['type']
  },
  execute: async (args: any) => {
    try {
      let command = '';
      
      switch (args.type) {
        case 'cpu':
          command = 'lscpu | grep -E "Model name|CPU\\(s\\)|Thread|Core"';
          break;
        case 'memory':
          command = 'free -h';
          break;
        case 'disk':
          command = 'df -h';
          break;
        case 'os':
          command = 'cat /etc/os-release';
          break;
        case 'all':
          command = 'lscpu | grep -E "Model name|CPU\\(s\\)|Thread|Core" && echo "\nMemory:" && free -h && echo "\nDisk:" && df -h && echo "\nOS:" && cat /etc/os-release';
          break;
        default:
          return {
            error: `Invalid type: ${args.type}`
          };
      }
      
      const { stdout, stderr } = await execPromise(command);
      
      if (stderr) {
        return {
          warning: stderr,
          result: stdout || 'Command executed with warnings.'
        };
      }
      
      return {
        result: stdout
      };
    } catch (error: any) {
      return {
        error: `Error getting system information: ${error.message}`
      };
    }
  }
};

// Network Tool
export const networkTool: MCPTool = {
  name: 'networkInfo',
  description: 'Get network information or make HTTP requests',
  parameters: {
    type: 'object',
    properties: {
      action: {
        type: 'string',
        enum: ['interfaces', 'ping', 'curl', 'dns'],
        description: 'Network action to perform'
      },
      target: {
        type: 'string',
        description: 'Target for the action (hostname, URL, etc.)'
      },
      count: {
        type: 'number',
        description: 'Count for ping (optional, default: 3)'
      }
    },
    required: ['action']
  },
  execute: async (args: any) => {
    try {
      let command = '';
      
      switch (args.action) {
        case 'interfaces':
          command = 'ip -br addr';
          break;
        case 'ping':
          if (!args.target) {
            return { error: 'Target is required for ping action' };
          }
          command = `ping -c ${args.count || 3} ${args.target}`;
          break;
        case 'curl':
          if (!args.target) {
            return { error: 'Target URL is required for curl action' };
          }
          command = `curl -s "${args.target}"`;
          break;
        case 'dns':
          if (!args.target) {
            return { error: 'Hostname is required for dns action' };
          }
          command = `dig ${args.target}`;
          break;
        default:
          return {
            error: `Invalid action: ${args.action}`
          };
      }
      
      const { stdout, stderr } = await execPromise(command);
      
      if (stderr) {
        return {
          warning: stderr,
          result: stdout || 'Command executed with warnings.'
        };
      }
      
      return {
        result: stdout
      };
    } catch (error: any) {
      return {
        error: `Error executing network action: ${error.message}`
      };
    }
  }
};

// Export all CLI tools
export const cliTools = [
  cliTool,
  readFileTool,
  systemInfoTool,
  networkTool
];
