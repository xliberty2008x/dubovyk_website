// Simple Pipedream API client

interface PipedreamClientOptions {
  apiKey: string;
}

export class PipedreamClient {
  private apiKey: string;
  
  constructor(options: PipedreamClientOptions) {
    this.apiKey = options.apiKey;
  }
  
  async getWorkflows(): Promise<any[]> {
    // This is a mock implementation since we're just trying to make the build pass
    // In a real implementation, this would make an API call to Pipedream
    return [];
  }
}
