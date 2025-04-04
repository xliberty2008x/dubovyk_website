/**
 * Mock LLM providers for deployment
 * This is a simplified version that doesn't depend on external LLM services
 */

export class LLMManager {
  private config: any;

  constructor(config: any) {
    this.config = config;
  }

  // Mock method to get the active provider
  getActiveProvider(): string {
    return this.config.activeProvider || 'mock';
  }

  // Mock method to set the active provider
  setActiveProvider(provider: string): void {
    this.config.activeProvider = provider;
  }

  // Mock method to get the configuration for a specific provider
  getProviderConfig(provider: string): any {
    return this.config.providers[provider] || {};
  }

  // Mock method to set the configuration for a specific provider
  setProviderConfig(provider: string, config: any): void {
    this.config.providers[provider] = config;
  }

  // Mock method to test a connection to a provider
  async testConnection(provider: string): Promise<{ success: boolean; message: string }> {
    // In a real implementation, this would actually test the connection
    return {
      success: true,
      message: `Mock connection to ${provider} successful`
    };
  }

  // Mock method to save the configuration
  async saveConfig(): Promise<void> {
    // In a real implementation, this would save the configuration to a database or file
    console.log('Mock saving LLM configuration:', this.config);
  }
}
