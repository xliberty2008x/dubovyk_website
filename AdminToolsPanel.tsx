import React, { useState, useEffect } from 'react';
import AdminToolCard from '@/components/admin/AdminToolCard';
import ToolForm from '@/components/admin/ToolForm';
import { MCPTool } from '@/lib/mcp/server';

const AdminToolsPanel: React.FC = () => {
  const [tools, setTools] = useState<MCPTool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTool, setEditingTool] = useState<MCPTool | undefined>(undefined);

  // Fetch tools on component mount
  useEffect(() => {
    const fetchTools = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/tools');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch tools: ${response.statusText}`);
        }
        
        const data = await response.json();
        setTools(data.tools || []);
        setError(null);
      } catch (err: any) {
        setError(`Error loading tools: ${err.message}`);
        console.error('Error fetching tools:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTools();
  }, []);

  const handleAddTool = () => {
    setEditingTool(undefined);
    setShowForm(true);
  };

  const handleEditTool = (tool: MCPTool) => {
    setEditingTool(tool);
    setShowForm(true);
  };

  const handleDeleteTool = async (name: string) => {
    if (!window.confirm(`Are you sure you want to delete the tool "${name}"?`)) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/tools/${encodeURIComponent(name)}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete tool: ${response.statusText}`);
      }
      
      // Remove the tool from the state
      setTools(tools.filter(tool => tool.name !== name));
    } catch (err: any) {
      setError(`Error deleting tool: ${err.message}`);
      console.error('Error deleting tool:', err);
    }
  };

  const handleSubmitTool = async (tool: MCPTool) => {
    try {
      const isEditing = !!editingTool;
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing 
        ? `/api/admin/tools/${encodeURIComponent(editingTool.name)}`
        : '/api/admin/tools';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: tool.name,
          description: tool.description,
          parameters: tool.parameters,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${isEditing ? 'update' : 'create'} tool: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (isEditing) {
        // Update the tool in the state
        setTools(tools.map(t => t.name === editingTool.name ? data.tool : t));
      } else {
        // Add the new tool to the state
        setTools([...tools, data.tool]);
      }
      
      setShowForm(false);
      setEditingTool(undefined);
    } catch (err: any) {
      setError(`Error ${editingTool ? 'updating' : 'creating'} tool: ${err.message}`);
      console.error(`Error ${editingTool ? 'updating' : 'creating'} tool:`, err);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTool(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">AI Assistant Tools</h2>
        <button
          onClick={handleAddTool}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Add New Tool
        </button>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-200 p-4 rounded-md">
          {error}
        </div>
      )}
      
      {showForm ? (
        <ToolForm 
          initialTool={editingTool} 
          onSubmit={handleSubmitTool} 
          onCancel={handleCancelForm} 
        />
      ) : (
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-8">
              <svg className="animate-spin h-8 w-8 mx-auto text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Loading tools...</p>
            </div>
          ) : tools.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <svg className="h-12 w-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
              <p className="mt-2 text-gray-600 dark:text-gray-300">No tools found. Add your first tool to get started.</p>
              <button
                onClick={handleAddTool}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Tool
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tools.map((tool) => (
                <AdminToolCard
                  key={tool.name}
                  tool={tool}
                  onDelete={handleDeleteTool}
                  onEdit={handleEditTool}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminToolsPanel;
