# Kyrylo Dubovyk's Personal Website with AI Assistant - Demo Guide

This document provides a walkthrough of the key features and capabilities of Kyrylo Dubovyk's personal website with AI assistant. Use this guide to explore and demonstrate the functionality of the website and AI assistant.

## Website Features Demonstration

### Homepage

1. **Professional Summary**: The homepage showcases Kyrylo's professional summary, highlighting his expertise as an AI Solutions Architect and AI Engineer.
2. **Experience Highlights**: Scroll down to see key positions and achievements from Kyrylo's career.
3. **Skills Overview**: View the categorized skills section showing Kyrylo's technical proficiencies.
4. **Services Section**: Explore the professional services Kyrylo offers to clients.
5. **Projects Showcase**: See highlighted projects demonstrating Kyrylo's expertise.

### Experience Page

1. **Interactive Timeline**: Navigate through the timeline to see Kyrylo's professional journey.
2. **Detailed Job Descriptions**: Click on timeline points to view detailed information about each position.
3. **Achievements**: Note the key achievements and responsibilities in each role.
4. **Company Information**: See details about the companies Kyrylo has worked with.

### Skills Page

1. **Categorized Skills**: Explore skills organized by categories (AI/ML, Cloud, Programming, etc.).
2. **Certifications**: View Kyrylo's professional certifications and credentials.
3. **Projects by Skill**: See projects that demonstrate specific technical skills.
4. **Skill Level Indicators**: Note the visual representation of proficiency levels.

### Contact Page

1. **Contact Form**: Try filling out the contact form (no actual submission in demo).
2. **Meeting Booking**: Explore the meeting booking functionality for AI solution consultations.
3. **Social Links**: Check the links to Kyrylo's professional profiles (LinkedIn, GitHub, etc.).
4. **Email Contact**: Note the direct email contact option.

## AI Assistant Demonstration

### Basic Functionality

1. **Navigate to AI Assistant**: Go to the AI Assistant page from the navigation menu.
2. **Start a Conversation**: Type a greeting or question in the chat input.
3. **Knowledge Base Queries**: Try asking questions about Kyrylo's background, such as:
   - "What is Kyrylo's professional background?"
   - "What are Kyrylo's key skills in AI engineering?"
   - "Tell me about Kyrylo's experience at Big Sister AI."
   - "What services does Kyrylo offer?"
   - "How can I book a meeting with Kyrylo?"

### Tool Calling Capabilities

1. **Show CLI Help**: Click the "Show CLI Help" button to see available CLI commands.
2. **Execute Commands**: Try using the CLI tools with commands like:
   - `/tool {"name": "executeCommand", "arguments": {"command": "date"}}`
   - `/tool {"name": "getSystemInfo", "arguments": {"type": "os"}}`
   - `/tool {"name": "networkInfo", "arguments": {"action": "interfaces"}}`

### Admin Panel Demonstration

1. **Navigate to Admin Panel**: Go to the Admin Panel page (/admin).
2. **Tools Management**: Explore the Tools tab to see how tools can be managed.
3. **Pipedream Integration**: View the Pipedream Integration tab to see how external services can be connected.
4. **LLM Configuration**: Check the LLM Configuration tab to see how different LLM providers can be configured.
5. **CLI Tools Testing**: Try the CLI Tools tab to test CLI commands directly.

## Key Technical Features

### LLM-Agnostic Design

The AI assistant is designed to work with multiple LLM providers:
- OpenAI (default)
- Azure OpenAI
- Google Vertex AI

Configuration is managed through environment variables or the admin panel.

### Model Context Protocol (MCP)

The AI assistant uses MCP for tool calling capabilities, allowing it to:
- Execute commands
- Read files
- Get system information
- Perform network operations
- Integrate with Pipedream workflows

### Pipedream Integration

The AI assistant can connect to Pipedream workflows, enabling:
- Integration with third-party services
- Custom workflow automation
- Extended functionality through API connections

### CLI Access

The AI assistant has CLI access capabilities with security restrictions:
- Limited to safe commands
- Restricted file access
- Controlled network operations

## Deployment Options

The project includes configuration files for multiple deployment platforms:
- Vercel (vercel.json)
- Netlify (netlify.toml)
- Cloudflare Pages (wrangler.toml)
- Docker (Dockerfile and docker-compose.yml)

## Documentation Overview

Comprehensive documentation is available in the docs directory:
- User Manual
- Deployment Guide
- Environment Setup Guide
- Test Plan and Results

## Customization Possibilities

The website and AI assistant can be customized in various ways:
- Content updates through the knowledge base
- Styling changes with Tailwind CSS
- Tool additions through the admin panel
- LLM provider switching
- Pipedream workflow integration

---

This demo guide provides an overview of the key features and capabilities of Kyrylo Dubovyk's personal website with AI assistant. For more detailed information, refer to the comprehensive documentation in the docs directory.
