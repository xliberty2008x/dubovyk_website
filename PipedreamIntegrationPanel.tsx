import React from 'react';
import { MCPTool } from '@/lib/mcp/server';
import { PipedreamClient } from '@/lib/pipedream/client';

interface PipedreamIntegrationPanelProps {
  apiKey: string;
}

const PipedreamIntegrationPanel: React.FC<PipedreamIntegrationPanelProps> = ({ apiKey }) => {
  const [workflows, setWorkflows] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedWorkflows, setSelectedWorkflows] = React.useState<string[]>([]);

  // Fetch Pipedream workflows on component mount
  React.useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        setIsLoading(true);
        
        // Create Pipedream client
        const client = new PipedreamClient({ apiKey });
        
        // Fetch workflows
        const workflowsData = await client.getWorkflows();
        setWorkflows(workflowsData);
        
        // Get already integrated workflows
        const response = await fetch('/api/admin/pipedream/tools');
        if (response.ok) {
          const data = await response.json();
          setSelectedWorkflows(data.tools.map((tool: any) => tool.workflowId));
        }
        
        setError(null);
      } catch (err: any) {
        setError(`Error loading Pipedream workflows: ${err.message}`);
        console.error('Error fetching Pipedream workflows:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (apiKey) {
      fetchWorkflows();
    } else {
      setError('Pipedream API key is required');
      setIsLoading(false);
    }
  }, [apiKey]);

  const handleToggleWorkflow = async (workflowId: string) => {
    const isSelected = selectedWorkflows.includes(workflowId);
    
    try {
      if (isSelected) {
        // Remove workflow integration
        const response = await fetch(`/api/admin/pipedream/tools/${encodeURIComponent(workflowId)}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error(`Failed to remove workflow integration: ${response.statusText}`);
        }
        
        setSelectedWorkflows(selectedWorkflows.filter(id => id !== workflowId));
      } else {
        // Add workflow integration
        const workflow = workflows.find(w => w.id === workflowId);
        if (!workflow) {
          throw new Error(`Workflow not found: ${workflowId}`);
        }
        
        const response = await fetch('/api/admin/pipedream/tools', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ workflowId: workflow.id }),
        });
        
        if (!response.ok) {
          throw new Error(`Failed to add workflow integration: ${response.statusText}`);
        }
        
        setSelectedWorkflows([...selectedWorkflows, workflowId]);
      }
    } catch (err: any) {
      setError(`Error ${isSelected ? 'removing' : 'adding'} workflow integration: ${err.message}`);
      console.error(`Error ${isSelected ? 'removing' : 'adding'} workflow integration:`, err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Pipedream Integration</h2>
        <a 
          href="https://pipedream.com/workflows" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Manage Workflows
        </a>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-200 p-4 rounded-md">
          {error}
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Available Workflows</h3>
        
        {isLoading ? (
          <div className="text-center py-8">
            <svg className="animate-spin h-8 w-8 mx-auto text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Loading Pipedream workflows...</p>
          </div>
        ) : workflows.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-gray-600 dark:text-gray-300">No workflows found. Create workflows in your Pipedream account first.</p>
            <a 
              href="https://pipedream.com/workflows/new" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Create Workflow
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {workflows.map((workflow) => (
              <div 
                key={workflow.id} 
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div>
                  <h4 className="font-medium">{workflow.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {workflow.description || 'No description'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    ID: {workflow.id} • Updated: {new Date(workflow.updated_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    workflow.active 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                  }`}>
                    {workflow.active ? 'Active' : 'Inactive'}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={selectedWorkflows.includes(workflow.id)}
                      onChange={() => handleToggleWorkflow(workflow.id)}
                      disabled={!workflow.active}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                      {selectedWorkflows.includes(workflow.id) ? 'Integrated' : 'Not Integrated'}
                    </span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-md">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">How It Works</h3>
        <p className="text-blue-700 dark:text-blue-300">
          Integrating Pipedream workflows allows your AI assistant to trigger workflows as tools. 
          When integrated, each workflow becomes available as a tool that the AI can use to perform actions.
        </p>
      </div>
    </div>
  );
};

export default PipedreamIntegrationPanel;
