# Environment Setup Guide for Kyrylo Dubovyk's Personal Website with AI Assistant

This guide provides detailed instructions for setting up the development environment for Kyrylo Dubovyk's personal website with AI assistant. Follow these steps to get the project running locally on your machine.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Environment Variables](#environment-variables)
4. [Running the Project](#running-the-project)
5. [Development Workflow](#development-workflow)
6. [Project Structure](#project-structure)
7. [Customization](#customization)

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** (version 18.x or later)
- **npm** (version 8.x or later) or **yarn** (version 1.22.x or later)
- **Git** for version control
- A code editor (VS Code recommended)
- API keys for the LLM providers you plan to use (OpenAI, Azure OpenAI, or Google Vertex AI)
- Pipedream account (optional, for workflow integration)

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/username/kir-dubovyk-website.git
   cd kir-dubovyk-website
   ```

2. **Install Dependencies**

   ```bash
   cd website
   npm install
   # or
   yarn install
   ```

3. **Create Environment Variables File**

   Create a `.env.local` file in the `website` directory:

   ```bash
   touch .env.local
   ```

   See the [Environment Variables](#environment-variables) section for the required variables.

## Environment Variables

Add the following environment variables to your `.env.local` file:

```
# LLM Configuration
# OpenAI
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4

# Azure OpenAI (optional)
AZURE_OPENAI_API_KEY=your_azure_openai_api_key
AZURE_OPENAI_ENDPOINT=https://your-resource-name.openai.azure.com
AZURE_OPENAI_DEPLOYMENT_NAME=deployment-name

# Google Vertex AI (optional)
GOOGLE_PROJECT_ID=your_project_id
GOOGLE_LOCATION=us-central1
GOOGLE_MODEL=gemini-pro

# Active Provider (choose one: openai, azure, vertex)
ACTIVE_LLM_PROVIDER=openai

# Pipedream Integration (optional)
PIPEDREAM_API_KEY=your_pipedream_api_key

# Security Configuration (optional)
ALLOWED_CLI_COMMANDS=ls,pwd,echo,date,cat,grep,find,head,tail,wc,sort,uniq,curl
ALLOWED_FILE_PATHS=/tmp,/home/data,/public
```

## Running the Project

1. **Start the Development Server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. **Access the Website**

   Open your browser and navigate to:
   - Website: [http://localhost:3000](http://localhost:3000)
   - Admin Panel: [http://localhost:3000/admin](http://localhost:3000/admin)
   - AI Assistant: [http://localhost:3000/ai-assistant](http://localhost:3000/ai-assistant)

3. **Build for Production**

   ```bash
   npm run build
   # or
   yarn build
   ```

4. **Start Production Server**

   ```bash
   npm run start
   # or
   yarn start
   ```

## Development Workflow

### Project Structure

The project follows a standard Next.js structure with additional directories for the AI assistant components:

```
website/
├── public/            # Static assets
├── src/
│   ├── app/           # Next.js app router pages
│   │   ├── api/       # API routes
│   │   ├── admin/     # Admin panel
│   │   ├── experience/# Experience page
│   │   ├── skills/    # Skills page
│   │   ├── contact/   # Contact page
│   │   └── ai-assistant/ # AI assistant page
│   ├── components/    # React components
│   │   ├── ui/        # UI components
│   │   ├── layout/    # Layout components
│   │   ├── ai-assistant/ # AI assistant components
│   │   └── admin/     # Admin panel components
│   ├── lib/           # Utility functions and libraries
│   │   ├── llm/       # LLM providers
│   │   ├── mcp/       # Model Context Protocol implementation
│   │   └── pipedream/ # Pipedream integration
│   └── data/          # Data files
│       └── knowledge_base.json # AI assistant knowledge base
├── .env.local         # Environment variables
└── package.json       # Project dependencies
```

### Making Changes

1. **Website Content**

   - Update pages in the `src/app/` directory
   - Modify components in the `src/components/` directory
   - Add or update styles using Tailwind CSS classes

2. **AI Assistant Knowledge Base**

   - Edit the knowledge base file at `src/data/knowledge_base.json`
   - Restart the development server to apply changes

3. **AI Assistant Tools**

   - Add or modify tools in the `src/lib/mcp/` directory
   - Register new tools in the MCP server

4. **API Routes**

   - Modify API routes in the `src/app/api/` directory
   - Test API endpoints using tools like Postman or the browser

## Customization

### Website Customization

1. **Personal Information**

   - Update the knowledge base file at `src/data/knowledge_base.json` with your personal information
   - Modify the content in the page components to reflect your details

2. **Styling**

   - Customize colors by modifying the Tailwind configuration in `tailwind.config.js`
   - Update the layout components in `src/components/layout/`

3. **Adding Pages**

   - Create new directories in the `src/app/` directory for additional pages
   - Add corresponding components and update the navigation

### AI Assistant Customization

1. **Knowledge Base**

   - Update the knowledge base file at `src/data/knowledge_base.json`
   - Add or modify sections as needed to reflect your expertise and experience

2. **Adding Tools**

   - Create new tool definitions in the `src/lib/mcp/` directory
   - Register the tools with the MCP server
   - Add UI components for the admin panel if needed

3. **LLM Providers**

   - Modify the LLM provider configuration in `src/lib/llm/providers.ts`
   - Add support for additional LLM providers if needed

## Troubleshooting

### Common Issues

1. **Next.js Build Errors**
   - Check for syntax errors in your components
   - Ensure all dependencies are correctly installed
   - Verify that environment variables are properly set

2. **AI Assistant Not Working**
   - Check that your LLM provider API keys are valid
   - Verify the knowledge base file is correctly formatted
   - Check browser console for JavaScript errors

3. **API Route Errors**
   - Verify that API routes are correctly implemented
   - Check server logs for error messages
   - Ensure environment variables are properly set

### Getting Help

If you encounter issues not covered in this guide:

1. Check the Next.js documentation at [nextjs.org/docs](https://nextjs.org/docs)
2. Review the project GitHub repository for known issues
3. Contact Kyrylo Dubovyk for project-specific assistance

---

This environment setup guide was created for Kyrylo Dubovyk's personal website with AI assistant. For more information, refer to the project documentation or contact Kyrylo directly.
