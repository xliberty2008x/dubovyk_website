import React, { useState } from 'react';
import { MCPTool } from '@/lib/mcp/server';

interface ToolFormProps {
  initialTool?: MCPTool;
  onSubmit: (tool: MCPTool) => void;
  onCancel: () => void;
}

const ToolForm: React.FC<ToolFormProps> = ({ initialTool, onSubmit, onCancel }) => {
  const [tool, setTool] = useState<MCPTool>(
    initialTool || {
      name: '',
      description: '',
      parameters: {
        type: 'object',
        properties: {}
      },
      execute: async () => ({})
    }
  );
  
  const [parametersJson, setParametersJson] = useState<string>(
    JSON.stringify(initialTool?.parameters || { type: 'object', properties: {} }, null, 2)
  );
  
  const [jsonError, setJsonError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTool(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleParametersChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setParametersJson(e.target.value);
    try {
      JSON.parse(e.target.value);
      setJsonError(null);
    } catch (error: any) {
      setJsonError(`Invalid JSON: ${error.message}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (jsonError) {
      return;
    }
    
    try {
      const parsedParameters = JSON.parse(parametersJson);
      
      // Create a new tool with the parsed parameters
      const newTool: MCPTool = {
        ...tool,
        parameters: parsedParameters,
        // This is a placeholder execute function that will be replaced by the actual implementation
        execute: async (args: any) => {
          console.log(`Executing tool ${tool.name} with args:`, args);
          return { result: `Simulated execution of ${tool.name}` };
        }
      };
      
      onSubmit(newTool);
    } catch (error: any) {
      setJsonError(`Error parsing JSON: ${error.message}`);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold mb-6">{initialTool ? 'Edit Tool' : 'Add New Tool'}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tool Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={tool.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="e.g., getCurrentWeather"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={tool.description}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Describe what this tool does..."
          ></textarea>
        </div>
        
        <div>
          <label htmlFor="parameters" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Parameters (JSON Schema)
          </label>
          <textarea
            id="parameters"
            name="parameters"
            value={parametersJson}
            onChange={handleParametersChange}
            required
            rows={10}
            className={`w-full px-4 py-2 border rounded-md font-mono text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${
              jsonError ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder='{"type": "object", "properties": {...}}'
          ></textarea>
          {jsonError && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{jsonError}</p>
          )}
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!!jsonError}
            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
              jsonError ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {initialTool ? 'Update Tool' : 'Add Tool'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ToolForm;
