// Pipedream API Integration
// Based on https://pipedream.com/docs/

export interface PipedreamConfig {
  apiKey: string;
  baseUrl?: string;
}

export interface PipedreamWorkflow {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PipedreamTool {
  workflowId: string;
  name: string;
  description: string;
  parameters: any; // JSON Schema
}

export class PipedreamClient {
  private apiKey: string;
  private baseUrl: string;
  
  constructor(config: PipedreamConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://api.pipedream.com/v1';
  }
  
  // Get all workflows
  async getWorkflows(): Promise<PipedreamWorkflow[]> {
    // In a real implementation, this would make an API call to Pipedream
    console.log('Fetching workflows from Pipedream');
    
    // Return mock data for demonstration
    return [
      {
        id: 'p_abc123',
        name: 'Email Notification Workflow',
        description: 'Sends email notifications when triggered',
        active: true,
        created_at: '2025-01-15T10:30:00Z',
        updated_at: '2025-02-20T14:45:00Z'
      },
      {
        id: 'p_def456',
        name: 'Data Processing Workflow',
        description: 'Processes and transforms data',
        active: true,
        created_at: '2025-02-01T08:15:00Z',
        updated_at: '2025-03-05T11:20:00Z'
      },
      {
        id: 'p_ghi789',
        name: 'Calendar Integration',
        description: 'Manages calendar events and appointments',
        active: false,
        created_at: '2025-02-10T16:45:00Z',
        updated_at: '2025-02-28T09:30:00Z'
      }
    ];
  }
  
  // Trigger a workflow
  async triggerWorkflow(workflowId: string, data: any): Promise<any> {
    // In a real implementation, this would make an API call to Pipedream
    console.log(`Triggering Pipedream workflow ${workflowId} with data:`, data);
    
    // Return mock response
    return {
      success: true,
      execution_id: `exec_${Math.random().toString(36).substring(2, 15)}`,
      message: 'Workflow triggered successfully'
    };
  }
  
  // Get workflow execution status
  async getExecutionStatus(executionId: string): Promise<any> {
    // In a real implementation, this would make an API call to Pipedream
    console.log(`Checking status of execution ${executionId}`);
    
    // Return mock status
    return {
      id: executionId,
      status: 'completed',
      started_at: new Date(Date.now() - 5000).toISOString(),
      completed_at: new Date().toISOString(),
      steps: [
        { name: 'trigger', status: 'success' },
        { name: 'process', status: 'success' },
        { name: 'respond', status: 'success' }
      ]
    };
  }
  
  // Convert Pipedream workflows to MCP tools
  convertWorkflowsToTools(workflows: PipedreamWorkflow[]): PipedreamTool[] {
    return workflows.filter(wf => wf.active).map(workflow => ({
      workflowId: workflow.id,
      name: `pipedream_${workflow.name.toLowerCase().replace(/\s+/g, '_')}`,
      description: workflow.description || `Pipedream workflow: ${workflow.name}`,
      parameters: {
        type: 'object',
        properties: {
          // Generic parameter structure, would be customized in a real implementation
          data: {
            type: 'object',
            description: 'Data to send to the workflow'
          }
        }
      }
    }));
  }
}

// Factory function to create a Pipedream client
export function createPipedreamClient(config: PipedreamConfig): PipedreamClient {
  return new PipedreamClient(config);
}

// Helper function to register Pipedream workflows as MCP tools
export async function registerPipedreamWorkflowsAsMCPTools(
  pipedreamClient: PipedreamClient, 
  registerTool: (tool: any) => void
): Promise<void> {
  try {
    // Get workflows from Pipedream
    const workflows = await pipedreamClient.getWorkflows();
    
    // Convert workflows to tools
    const tools = pipedreamClient.convertWorkflowsToTools(workflows);
    
    // Register each tool
    tools.forEach(tool => {
      registerTool({
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters,
        execute: async (args: any) => {
          // Trigger the workflow
          const result = await pipedreamClient.triggerWorkflow(tool.workflowId, args.data);
          return result;
        }
      });
    });
    
    console.log(`Registered ${tools.length} Pipedream workflows as MCP tools`);
  } catch (error) {
    console.error('Error registering Pipedream workflows:', error);
    throw error;
  }
}
