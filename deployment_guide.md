# Deployment Guide for Kyrylo Dubovyk's Personal Website with AI Assistant

This guide provides detailed instructions for deploying the personal website with AI assistant to various platforms. The website is built with Next.js and includes an AI assistant with tool calling capabilities, including CLI access.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variables](#environment-variables)
3. [Deployment Options](#deployment-options)
   - [Vercel Deployment](#vercel-deployment)
   - [Netlify Deployment](#netlify-deployment)
   - [Cloudflare Pages Deployment](#cloudflare-pages-deployment)
4. [Post-Deployment Configuration](#post-deployment-configuration)
5. [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:

- A GitHub account
- The project repository cloned locally
- Node.js 18.x or later installed
- npm or yarn package manager
- API keys for the LLM providers you plan to use (OpenAI, Azure OpenAI, or Google Vertex AI)
- Pipedream account (optional, for workflow integration)

## Environment Variables

The following environment variables need to be configured in your deployment platform:

### LLM Configuration

```
# OpenAI
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

# Active Provider (choose one: openai, azure, vertex)
ACTIVE_LLM_PROVIDER=openai
```

### Pipedream Integration (Optional)

```
PIPEDREAM_API_KEY=your_pipedream_api_key
```

### Security Configuration

```
# Admin panel access (optional)
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password

# CLI tools security (optional, defaults to secure settings)
ALLOWED_CLI_COMMANDS=ls,pwd,echo,date,cat,grep,find,head,tail,wc,sort,uniq,curl
ALLOWED_FILE_PATHS=/tmp,/home/data,/public
```

## Deployment Options

### Vercel Deployment

Vercel is the recommended deployment platform for Next.js applications.

1. **Create a Vercel Account**
   - Sign up at [vercel.com](https://vercel.com) if you don't have an account

2. **Install Vercel CLI** (optional)
   ```bash
   npm install -g vercel
   ```

3. **Deploy from GitHub**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Configure project settings:
     - Framework Preset: Next.js
     - Root Directory: ./website
     - Build Command: `npm run build`
     - Output Directory: .next
   - Add environment variables from the list above
   - Click "Deploy"

4. **Deploy from CLI** (alternative)
   ```bash
   cd /path/to/kir-dubovyk-website/website
   vercel
   ```
   - Follow the prompts to link to your Vercel account
   - Add environment variables when prompted or via the Vercel dashboard

### Netlify Deployment

1. **Create a Netlify Account**
   - Sign up at [netlify.com](https://netlify.com) if you don't have an account

2. **Deploy from GitHub**
   - Go to [app.netlify.com/start](https://app.netlify.com/start)
   - Connect to GitHub and select your repository
   - Configure build settings:
     - Base directory: website
     - Build command: `npm run build`
     - Publish directory: .next
   - Add environment variables in the "Environment" section
   - Click "Deploy site"

3. **Deploy from CLI** (alternative)
   ```bash
   npm install -g netlify-cli
   cd /path/to/kir-dubovyk-website/website
   netlify deploy
   ```

### Cloudflare Pages Deployment

1. **Create a Cloudflare Account**
   - Sign up at [cloudflare.com](https://cloudflare.com) if you don't have an account

2. **Deploy from GitHub**
   - Go to Cloudflare Dashboard > Pages > Create a project
   - Connect to GitHub and select your repository
   - Configure build settings:
     - Framework preset: Next.js
     - Build command: `npm run build`
     - Build output directory: .next
   - Add environment variables in the "Environment variables" section
   - Click "Save and Deploy"

## Post-Deployment Configuration

After deployment, complete these steps:

1. **Verify Environment Variables**
   - Check that all environment variables are correctly set
   - Test the AI assistant to ensure it can connect to the LLM provider

2. **Configure Admin Panel**
   - Access the admin panel at `/admin`
   - Configure LLM settings
   - Set up Pipedream integration (if using)
   - Test CLI tools functionality

3. **Update Knowledge Base** (Optional)
   - If needed, update the knowledge base file at `/data/knowledge_base.json`
   - Redeploy the application to apply changes

## Troubleshooting

### Common Issues

1. **AI Assistant Not Responding**
   - Check LLM provider environment variables
   - Verify API keys are valid and have sufficient credits
   - Check server logs for error messages

2. **CLI Tools Not Working**
   - Verify CLI tools are properly initialized
   - Check security restrictions in environment variables
   - Ensure the server has necessary permissions

3. **Deployment Build Failures**
   - Check build logs for specific errors
   - Ensure Node.js version is compatible (18.x or later)
   - Verify all dependencies are correctly installed

### Getting Help

If you encounter issues not covered in this guide:

1. Check the project GitHub repository for known issues
2. Review the Next.js documentation for deployment troubleshooting
3. Contact Kyrylo Dubovyk for project-specific assistance

---

This deployment guide was created for Kyrylo Dubovyk's personal website with AI assistant. For more information, refer to the project documentation or contact Kyrylo directly.
