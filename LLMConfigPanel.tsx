import React, { useState } from 'react';
import { LLMManager } from './src/lib/llm/providers';

interface LLMConfigPanelProps {
  initialConfig: {
    activeProvider: string;
    providers: {
      [key: string]: any;
    };
  };
  onSave: (config: any) => void;
}

const LLMConfigPanel: React.FC<LLMConfigPanelProps> = ({ initialConfig, onSave }) => {
  const [config, setConfig] = useState(initialConfig);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({
    type: null,
    message: ''
  });

  const handleActiveProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setConfig({
      ...config,
      activeProvider: e.target.value
    });
  };

  const handleProviderConfigChange = (provider: string, field: string, value: string) => {
    setConfig({
      ...config,
      providers: {
        ...config.providers,
        [provider]: {
          ...config.providers[provider],
          [field]: value
        }
      }
    });
  };

  const handleTestConnection = async (provider: string) => {
    setIsLoading(true);
    setStatus({
      type: null,
      message: ''
    });

    try {
      const response = await fetch('/api/admin/llm/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider,
          config: config.providers[provider]
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({
          type: 'success',
          message: `Successfully connected to ${provider}: ${data.message}`
        });
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (error: any) {
      setStatus({
        type: 'error',
        message: `Failed to connect to ${provider}: ${error.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    setIsLoading(true);
    
    try {
      await onSave(config);
      
      setStatus({
        type: 'success',
        message: 'LLM configuration saved successfully'
      });
    } catch (error: any) {
      setStatus({
        type: 'error',
        message: `Failed to save configuration: ${error.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">LLM Configuration</h2>
      </div>
      
      {status.type && (
        <div className={`p-4 rounded-md ${
          status.type === 'success' 
            ? 'bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-200' 
            : 'bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          {status.message}
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div className="mb-6">
          <label htmlFor="activeProvider" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Active Provider
          </label>
          <select
            id="activeProvider"
            value={config.activeProvider}
            onChange={handleActiveProviderChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            {Object.keys(config.providers).map((provider) => (
              <option key={provider} value={provider}>
                {provider}
              </option>
            ))}
          </select>
        </div>
        
        <div className="space-y-8">
          {/* OpenAI Configuration */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold mb-4">OpenAI Configuration</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="openai-apiKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  API Key
                </label>
                <input
                  type="password"
                  id="openai-apiKey"
                  value={config.providers.openai?.apiKey || ''}
                  onChange={(e) => handleProviderConfigChange('openai', 'apiKey', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="sk-..."
                />
              </div>
              <div>
                <label htmlFor="openai-model" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Model
                </label>
                <select
                  id="openai-model"
                  value={config.providers.openai?.model || 'gpt-4'}
                  onChange={(e) => handleProviderConfigChange('openai', 'model', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-4-turbo">GPT-4 Turbo</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                </select>
              </div>
              <div>
                <button
                  onClick={() => handleTestConnection('openai')}
                  disabled={isLoading}
                  className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Test Connection
                </button>
              </div>
            </div>
          </div>
          
          {/* Azure OpenAI Configuration */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold mb-4">Azure OpenAI Configuration</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="azure-apiKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  API Key
                </label>
                <input
                  type="password"
                  id="azure-apiKey"
                  value={config.providers.azure?.apiKey || ''}
                  onChange={(e) => handleProviderConfigChange('azure', 'apiKey', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Azure OpenAI API Key"
                />
              </div>
              <div>
                <label htmlFor="azure-endpoint" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Endpoint
                </label>
                <input
                  type="text"
                  id="azure-endpoint"
                  value={config.providers.azure?.endpoint || ''}
                  onChange={(e) => handleProviderConfigChange('azure', 'endpoint', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="https://your-resource-name.openai.azure.com"
                />
              </div>
              <div>
                <label htmlFor="azure-deploymentName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Deployment Name
                </label>
                <input
                  type="text"
                  id="azure-deploymentName"
                  value={config.providers.azure?.deploymentName || ''}
                  onChange={(e) => handleProviderConfigChange('azure', 'deploymentName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="deployment-name"
                />
              </div>
              <div>
                <button
                  onClick={() => handleTestConnection('azure')}
                  disabled={isLoading}
                  className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Test Connection
                </button>
              </div>
            </div>
          </div>
          
          {/* Google Vertex AI Configuration */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold mb-4">Google Vertex AI Configuration</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="vertex-projectId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Project ID
                </label>
                <input
                  type="text"
                  id="vertex-projectId"
                  value={config.providers.vertex?.projectId || ''}
                  onChange={(e) => handleProviderConfigChange('vertex', 'projectId', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="your-project-id"
                />
              </div>
              <div>
                <label htmlFor="vertex-location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  id="vertex-location"
                  value={config.providers.vertex?.location || 'us-central1'}
                  onChange={(e) => handleProviderConfigChange('vertex', 'location', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="us-central1"
                />
              </div>
              <div>
                <label htmlFor="vertex-model" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Model
                </label>
                <select
                  id="vertex-model"
                  value={config.providers.vertex?.model || 'gemini-pro'}
                  onChange={(e) => handleProviderConfigChange('vertex', 'model', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="gemini-pro">Gemini Pro</option>
                  <option value="gemini-pro-vision">Gemini Pro Vision</option>
                  <option value="text-bison">Text Bison</option>
                </select>
              </div>
              <div>
                <button
                  onClick={() => handleTestConnection('vertex')}
                  disabled={isLoading}
                  className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Test Connection
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleSaveConfig}
            disabled={isLoading}
            className={`px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-md">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">Environment Variables</h3>
        <p className="text-blue-700 dark:text-blue-300 mb-2">
          For production deployment, you can set these environment variables instead of using this configuration panel:
        </p>
        <pre className="bg-white dark:bg-gray-800 p-3 rounded text-sm overflow-x-auto">
{`# OpenAI
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4

# Azure OpenAI
AZURE_OPENAI_API_KEY=your_azure_openai_api_key
AZURE_OPENAI_ENDPOINT=https://your-resource-name.openai.azure.com
AZURE_OPENAI_DEPLOYMENT_NAME=deployment-name

# Google Vertex AI
GOOGLE_PROJECT_ID=your_project_id
GOOGLE_LOCATION=us-central1
GOOGLE_MODEL=gemini-pro

# Active Provider
ACTIVE_LLM_PROVIDER=openai|azure|vertex`}
        </pre>
      </div>
    </div>
  );
};

export default LLMConfigPanel;
