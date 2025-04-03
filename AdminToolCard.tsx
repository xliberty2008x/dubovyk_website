import React from 'react';
import { MCPTool } from '@/lib/mcp/server';

interface AdminToolCardProps {
  tool: MCPTool;
  onDelete: (name: string) => void;
  onEdit: (tool: MCPTool) => void;
}

const AdminToolCard: React.FC<AdminToolCardProps> = ({ tool, onDelete, onEdit }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold">{tool.name}</h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => onEdit(tool)}
            className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            aria-label="Edit tool"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
          </button>
          <button 
            onClick={() => onDelete(tool.name)}
            className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            aria-label="Delete tool"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
      </div>
      
      <p className="text-gray-600 dark:text-gray-300 mb-4">{tool.description}</p>
      
      <div className="bg-gray-50 dark:bg-gray-700 rounded p-3 mb-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Parameters:</h4>
        <pre className="text-xs overflow-x-auto">
          {JSON.stringify(tool.parameters, null, 2)}
        </pre>
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={() => onEdit(tool)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Edit Tool
        </button>
      </div>
    </div>
  );
};

export default AdminToolCard;
