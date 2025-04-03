import React, { useState, useEffect } from 'react';

interface CLIToolsTestPanelProps {
  onTestResult?: (result: any) => void;
}

const CLIToolsTestPanel: React.FC<CLIToolsTestPanelProps> = ({ onTestResult }) => {
  const [tools, setTools] = useState<any[]>([]);
  const [selectedTool, setSelectedTool] = useState<string>('');
  const [args, setArgs] = useState<string>('{}');
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize CLI tools on component mount
  useEffect(() => {
    const initializeTools = async () => {
      try {
        setIsInitializing(true);
        
        // Initialize CLI tools
        const initResponse = await fetch('/api/admin/cli');
        if (!initResponse.ok) {
          throw new Error(`Failed to initialize CLI tools: ${initResponse.statusText}`);
        }
        
        const initData = await initResponse.json();
        console.log('CLI tools initialized:', initData);
        
        // Get available tools
        const toolsResponse = await fetch('/api/chat');
        if (!toolsResponse.ok) {
          throw new Error(`Failed to fetch tools: ${toolsResponse.statusText}`);
        }
        
        const toolsData = await toolsResponse.json();
        
        // Filter CLI tools (those starting with 'execute', 'read', 'get', or 'network')
        const cliTools = toolsData.tools.filter((tool: any) => 
          tool.name === 'executeCommand' || 
          tool.name === 'readFile' || 
          tool.name === 'getSystemInfo' || 
          tool.name === 'networkInfo'
        );
        
        setTools(cliTools);
        if (cliTools.length > 0) {
          setSelectedTool(cliTools[0].name);
          
          // Set default args based on the selected tool
          setDefaultArgs(cliTools[0]);
        }
        
        setError(null);
      } catch (err: any) {
        console.error('Error initializing CLI tools:', err);
        setError(`Error initializing CLI tools: ${err.message}`);
      } finally {
        setIsInitializing(false);
      }
    };
    
    initializeTools();
  }, []);

  // Set default args based on the selected tool
  const setDefaultArgs = (tool: any) => {
    if (!tool) return;
    
    let defaultArgs: any = {};
    
    switch (tool.name) {
      case 'executeCommand':
        defaultArgs = { command: 'ls -la' };
        break;
      case 'readFile':
        defaultArgs = { path: '/tmp/example.txt' };
        break;
      case 'getSystemInfo':
        defaultArgs = { type: 'os' };
        break;
      case 'networkInfo':
        defaultArgs = { action: 'interfaces' };
        break;
      default:
        defaultArgs = {};
    }
    
    setArgs(JSON.stringify(defaultArgs, null, 2));
  };

  // Handle tool selection change
  const handleToolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const toolName = e.target.value;
    setSelectedTool(toolName);
    
    // Set default args based on the selected tool
    const tool = tools.find(t => t.name === toolName);
    setDefaultArgs(tool);
  };

  // Handle args change
  const handleArgsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setArgs(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Parse args
      let parsedArgs;
      try {
        parsedArgs = JSON.parse(args);
      } catch (err) {
        setError('Invalid JSON in arguments');
        return;
      }
      
      // Call the API to test the tool
      const response = await fetch('/api/admin/cli', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tool: selectedTool,
          args: parsedArgs
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setResult(data.result);
      
      // Call the onTestResult callback if provided
      if (onTestResult) {
        onTestResult(data.result);
      }
    } catch (err: any) {
      console.error('Error testing CLI tool:', err);
      setError(`Error testing CLI tool: ${err.message}`);
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-6">CLI Tools Test Panel</h2>
      
      {isInitializing ? (
        <div className="text-center py-8">
          <svg className="animate-spin h-8 w-8 mx-auto text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Initializing CLI tools...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-200 p-4 rounded-md mb-6">
          {error}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="tool" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Select Tool
            </label>
            <select
              id="tool"
              value={selectedTool}
              onChange={handleToolChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {tools.map((tool) => (
                <option key={tool.name} value={tool.name}>
                  {tool.name} - {tool.description}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="args" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Arguments (JSON)
            </label>
            <textarea
              id="args"
              value={args}
              onChange={handleArgsChange}
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
            ></textarea>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Testing...' : 'Test Tool'}
            </button>
          </div>
        </form>
      )}
      
      {result && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Result:</h3>
          <div className="bg-gray-50 dark:bg-gray-700 rounded p-4 overflow-auto max-h-80">
            <pre className="text-sm text-gray-800 dark:text-gray-200">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}
      
      <div className="mt-6 bg-blue-50 dark:bg-blue-900 p-4 rounded-md">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">Available CLI Tools</h3>
        <ul className="list-disc pl-5 text-blue-700 dark:text-blue-300 space-y-1">
          <li><strong>executeCommand</strong> - Run shell commands (limited to safe commands)</li>
          <li><strong>readFile</strong> - Read file contents (limited to safe directories)</li>
          <li><strong>getSystemInfo</strong> - Get system information (CPU, memory, disk, OS)</li>
          <li><strong>networkInfo</strong> - Get network information or make HTTP requests</li>
        </ul>
      </div>
    </div>
  );
};

export default CLIToolsTestPanel;
