# User Manual for Kyrylo Dubovyk's Personal Website with AI Assistant

This user manual provides comprehensive instructions for using and managing Kyrylo Dubovyk's personal website with AI assistant. It covers all features and functionality for both regular users and administrators.

## Table of Contents

1. [Introduction](#introduction)
2. [Website Navigation](#website-navigation)
3. [AI Assistant Usage](#ai-assistant-usage)
4. [CLI Access Features](#cli-access-features)
5. [Admin Panel](#admin-panel)
6. [Customization Options](#customization-options)
7. [Troubleshooting](#troubleshooting)

## Introduction

Kyrylo Dubovyk's personal website showcases his professional experience, skills, and services as an AI Solutions Architect and AI Engineer. The website features an integrated AI assistant that can answer questions about Kyrylo and demonstrate tool calling capabilities, including CLI access.

### Key Features

- Professional website with responsive design
- Interactive experience timeline and skills showcase
- Meeting booking functionality
- AI assistant with knowledge about Kyrylo's background
- Tool calling capabilities with CLI access
- Admin panel for managing AI tools and configurations

## Website Navigation

### Homepage

The homepage provides an overview of Kyrylo's professional background, highlighting his expertise in AI solutions architecture, AI engineering, and data engineering.

- **Hero Section**: Displays Kyrylo's name, title, and a brief introduction
- **Experience Highlights**: Shows key positions and achievements
- **Skills Overview**: Presents core technical skills and expertise
- **Services Section**: Outlines professional services offered
- **Projects Showcase**: Highlights notable projects and accomplishments

### Experience Page

The Experience page details Kyrylo's professional journey with an interactive timeline.

- **Timeline Navigation**: Click on timeline points to view details about each position
- **Company Information**: Displays company name, role, and duration
- **Responsibilities**: Lists key responsibilities and achievements in each role
- **Skills Utilized**: Shows relevant skills applied in each position

### Skills Page

The Skills page showcases Kyrylo's technical proficiencies and certifications.

- **Skills Grid**: Organized by categories (AI/ML, Cloud, Programming, etc.)
- **Skill Level Indicators**: Visual representation of proficiency levels
- **Certifications**: Lists formal certifications with issuing organizations
- **Projects**: Displays projects demonstrating specific skills

### Contact Page

The Contact page provides ways to get in touch with Kyrylo and book meetings.

- **Contact Form**: Send messages directly to Kyrylo
- **Meeting Booking**: Schedule consultations about AI solutions
- **Social Links**: Connect on LinkedIn, GitHub, and other platforms
- **Email Contact**: Direct email communication option

## AI Assistant Usage

The AI assistant can answer questions about Kyrylo's background, skills, experience, and services. It also demonstrates tool calling capabilities, including CLI access.

### Starting a Conversation

1. Navigate to the AI Assistant page
2. Type your question in the input field
3. Press Enter or click the Send button
4. The AI assistant will respond based on its knowledge base

### Example Questions

- "What is Kyrylo's professional background?"
- "What are Kyrylo's key skills in AI engineering?"
- "Tell me about Kyrylo's experience at Big Sister AI."
- "What services does Kyrylo offer?"
- "How can I book a meeting with Kyrylo?"

### Using Tool Calling

The AI assistant can use various tools to perform actions. To use a tool:

1. Type a command using the `/tool` prefix
2. Specify the tool name and arguments in JSON format
3. Press Enter to execute the tool

Example:
```
/tool {"name": "executeCommand", "arguments": {"command": "date"}}
```

## CLI Access Features

The AI assistant has CLI access capabilities that allow it to execute commands, read files, and retrieve system information.

### Available CLI Tools

1. **Execute Command**
   - Run shell commands (limited to safe commands)
   - Example: `/tool {"name": "executeCommand", "arguments": {"command": "ls -la"}}`

2. **Read File**
   - Read the contents of a file (limited to safe directories)
   - Example: `/tool {"name": "readFile", "arguments": {"path": "/tmp/example.txt", "maxLines": 10}}`

3. **System Information**
   - Get system information (CPU, memory, disk, OS)
   - Example: `/tool {"name": "getSystemInfo", "arguments": {"type": "os"}}`

4. **Network Information**
   - Get network information or make HTTP requests
   - Example: `/tool {"name": "networkInfo", "arguments": {"action": "interfaces"}}`

### Security Restrictions

For security reasons, CLI access is restricted:

- Only specific commands are allowed (ls, pwd, echo, date, cat, grep, find, head, tail, wc, sort, uniq, curl)
- File reading is limited to safe directories
- Network operations are restricted to safe actions

## Admin Panel

The admin panel allows administrators to manage AI tools, Pipedream integration, LLM configuration, and CLI tools.

### Accessing the Admin Panel

1. Navigate to `/admin` in your browser
2. If configured, enter your admin credentials

### Tools Management

The Tools tab allows you to manage the AI assistant's tools:

1. **View Tools**: See all registered tools and their descriptions
2. **Add Tool**: Create new tools with custom parameters
3. **Edit Tool**: Modify existing tool configurations
4. **Delete Tool**: Remove tools that are no longer needed

### Pipedream Integration

The Pipedream Integration tab allows you to connect with Pipedream workflows:

1. **Configure API Key**: Enter your Pipedream API key
2. **View Workflows**: See available workflows from your Pipedream account
3. **Integrate Workflows**: Enable workflows as tools for the AI assistant
4. **Test Integration**: Verify that workflows are correctly integrated

### LLM Configuration

The LLM Configuration tab allows you to set up and manage LLM providers:

1. **Select Provider**: Choose between OpenAI, Azure OpenAI, or Google Vertex AI
2. **Configure API Keys**: Enter API keys for the selected provider
3. **Set Model Parameters**: Configure model name and other settings
4. **Test Connection**: Verify that the LLM provider is correctly configured

### CLI Tools

The CLI Tools tab allows you to test and manage CLI access:

1. **Select Tool**: Choose from available CLI tools
2. **Configure Parameters**: Set command arguments
3. **Test Execution**: Run the command and view results
4. **Security Settings**: View and modify security restrictions

## Customization Options

The website and AI assistant can be customized in various ways:

### Website Customization

1. **Content Updates**
   - Modify the knowledge base file at `src/data/knowledge_base.json`
   - Update page content in the `src/app/` directory
   - Edit component content in the `src/components/` directory

2. **Styling Changes**
   - Modify Tailwind CSS classes in component files
   - Update the Tailwind configuration in `tailwind.config.js`
   - Customize colors, fonts, and other design elements

3. **Adding Pages**
   - Create new directories in the `src/app/` directory
   - Add corresponding components and update navigation

### AI Assistant Customization

1. **Knowledge Base Updates**
   - Edit the knowledge base file at `src/data/knowledge_base.json`
   - Add or modify sections to reflect updated information
   - Restart the server to apply changes

2. **Tool Configuration**
   - Add or modify tools in the admin panel
   - Create custom tools in the `src/lib/mcp/` directory
   - Configure tool parameters and security settings

3. **LLM Provider Changes**
   - Switch between OpenAI, Azure OpenAI, and Google Vertex AI
   - Update API keys and model parameters
   - Test new configurations before deployment

## Troubleshooting

### Common Issues

1. **AI Assistant Not Responding**
   - Check that LLM provider API keys are valid
   - Verify that the knowledge base file is correctly formatted
   - Check browser console for JavaScript errors

2. **Tool Calling Errors**
   - Ensure tool commands are correctly formatted
   - Verify that required parameters are provided
   - Check security restrictions for CLI tools

3. **Admin Panel Access Issues**
   - Verify admin credentials if configured
   - Check browser console for JavaScript errors
   - Clear browser cache and cookies

### Getting Help

If you encounter issues not covered in this manual:

1. Check the project documentation in the `docs/` directory
2. Review the GitHub repository for known issues
3. Contact Kyrylo Dubovyk for project-specific assistance

---

This user manual was created for Kyrylo Dubovyk's personal website with AI assistant. For more information, refer to the project documentation or contact Kyrylo directly.
