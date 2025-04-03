# Setting Up Azure OpenAI for the Chat Component

This guide will help you set up Azure OpenAI integration for the chat component of the website.

## Prerequisites

- An Azure account with access to Azure OpenAI Service
- A deployed Azure OpenAI model (GPT-4 or GPT-3.5 Turbo recommended)

## Configuration Steps

### 1. Create an Azure OpenAI Resource

If you haven't already created an Azure OpenAI resource:

1. Go to the [Azure Portal](https://portal.azure.com)
2. Search for "Azure OpenAI" and select it
3. Click "Create" to start the resource creation process
4. Fill in the required details (subscription, resource group, region, name)
5. Complete the creation process

### 2. Deploy a Model

1. Navigate to your Azure OpenAI resource
2. Go to the "Model deployments" section
3. Click "Create new deployment"
4. Choose a model (e.g., gpt-4, gpt-35-turbo)
5. Give your deployment a name (this will be your `AZURE_OPENAI_DEPLOYMENT_NAME`)
6. Complete the deployment

### 3. Get Your API Key and Endpoint

1. In your Azure OpenAI resource, navigate to the "Keys and Endpoint" section
2. Copy one of the keys (either Key 1 or Key 2)
3. Copy the endpoint URL

### 4. Update Your .env File

Update the following variables in your `.env` file:

```
# Change the active provider to azure
ACTIVE_LLM_PROVIDER=azure

# Azure OpenAI configuration
AZURE_OPENAI_API_KEY=your-api-key-here
AZURE_OPENAI_ENDPOINT=https://your-resource-name.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT_NAME=your-deployment-name
AZURE_OPENAI_API_VERSION=2024-02-15-preview
```

Replace:
- `your-api-key-here` with the API key you copied
- `https://your-resource-name.openai.azure.com/` with your endpoint URL
- `your-deployment-name` with the name you gave to your model deployment

## Testing the Integration

1. Start your development server with `npm run dev`
2. Navigate to the chat component on your website
3. Try sending a message to test if the Azure OpenAI integration is working correctly

## Troubleshooting

If you encounter issues:

1. Check your `.env` file to ensure all values are set correctly
2. Verify that your Azure OpenAI deployment is active
3. Check the browser console and server logs for error messages
4. Ensure your Azure account has sufficient quota for the model you're using
