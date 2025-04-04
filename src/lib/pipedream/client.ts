/**
 * Mock Pipedream client for deployment
 * This is a simplified version that doesn't depend on external Pipedream API
 */

export interface PipedreamClientConfig {
  apiKey: string;
}

export class PipedreamClient {
  private apiKey: string;

  constructor(config: PipedreamClientConfig) {
    this.apiKey = config.apiKey;
  }

  /**
   * Mock method to get workflows
   * In a real implementation, this would fetch workflows from the Pipedream API
   */
  async getWorkflows(): Promise<any[]> {
    // Return an empty array for the mock implementation
    return [];
  }

  /**
   * Mock method to get a workflow by ID
   * In a real implementation, this would fetch a workflow from the Pipedream API
   */
  async getWorkflow(id: string): Promise<any> {
    // Return a mock workflow for the mock implementation
    return {
      id,
      name: 'Mock Workflow',
      description: 'This is a mock workflow for deployment',
      active: true,
      updated_at: new Date().toISOString(),
    };
  }

  /**
   * Mock method to trigger a workflow
   * In a real implementation, this would trigger a workflow in Pipedream
   */
  async triggerWorkflow(id: string, data: any): Promise<any> {
    // Return a mock response for the mock implementation
    return {
      success: true,
      message: 'Workflow triggered successfully',
      data,
    };
  }
}
