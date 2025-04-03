# Requirements Analysis for Kyrylo Dubovyk's Personal Website with AI Assistant

## Website Requirements

### Core Technologies
- **Frontend Framework**: Next.js
- **Styling**: Tailwind CSS
- **Responsiveness**: Mobile-first design approach for all devices

### Website Structure
1. **Homepage**
   - Professional summary highlighting Kyrylo's expertise in AI solutions architecture
   - Core expertise highlights (AI Engineering, LLM Applications, Prompt Engineering)
   - Professional photo and contact information
   - Call-to-action buttons for key sections

2. **Experience Page**
   - Detailed work history from LinkedIn profile
   - Chronological listing of positions with descriptions
   - Key achievements and metrics (e.g., 45% reduction in customer acquisition costs)
   - Skills demonstrated in each role

3. **Skills Page**
   - Technical proficiencies categorized by domain:
     - AI/ML Technologies (GPT models, Azure ML, etc.)
     - Cloud Platforms (AWS, Azure, Google Cloud)
     - Programming Languages (Python, TypeScript, etc.)
     - No-Code/Low-Code Tools (Flowise AI, n8n, etc.)
   - GitHub integration to showcase repositories
   - Certifications section

4. **Contact Page**
   - Meeting booking functionality for AI solution consultations
   - Contact form
   - Links to professional profiles (LinkedIn, GitHub, Upwork)

### Design Requirements
- Professional and modern aesthetic
- Color scheme aligned with AI/tech industry
- Emphasis on readability and user experience
- Animations and transitions for enhanced engagement

### Functional Requirements
- Fast page loading and navigation
- SEO optimization
- Analytics integration
- Meeting booking integration

## AI Assistant Requirements

### Core Technologies
- **LLM Integration**: LLM-agnostic approach supporting:
  - OpenAI (primary)
  - Azure OpenAI (primary)
  - Google Vertex AI (secondary)

### Tool Calling Capabilities
- **Model Context Protocol (MCP)** implementation
  - Reference implementation from https://github.com/modelcontextprotocol/servers
  - Function calling capabilities
  - Tool integration framework

### Pipedream API Integration
- Connection to Pipedream for third-party service integration
- Managed authentication implementation
- Webhook handling for real-time interactions

### Knowledge Base
- Information about Kyrylo's background, skills, and experience
- Ability to answer questions about Kyrylo's professional history
- Information about AI technologies and Kyrylo's expertise areas

### Admin Panel
- UI for managing tools available to the assistant
- Integration with Pipedream's Connect feature
- Tool configuration and management interface
- Authentication for admin access

### Deployment Requirements
- Environment variable configuration for different LLM providers
- API key management
- Secure handling of credentials

## Documentation Requirements

### Deployment Instructions
- Step-by-step guides for popular platforms:
  - Cloudflare
  - Vercel
  - Netlify

### Environment Setup
- Clear guidance on setting up environment variables
- LLM provider configuration
- API key setup instructions

### User Documentation
- How to use the website
- How to interact with the AI assistant
- How to book meetings

### Customization Documentation
- How to update content
- How to modify the AI assistant's capabilities
- How to add new tools to the assistant

## Technical Specifications

### Frontend
- Next.js 14+ with App Router
- Tailwind CSS for styling
- TypeScript for type safety
- Responsive design with mobile-first approach

### Backend
- Next.js API routes for backend functionality
- LLM integration via appropriate SDKs
- Serverless functions for API calls

### AI Assistant
- LLM-agnostic implementation with provider switching
- MCP for tool calling capabilities
- Knowledge base derived from Kyrylo's profile data
- Admin panel for tool management

### Integration Points
- Meeting booking service (e.g., Calendly)
- Pipedream for third-party service connections
- GitHub for repository display
- LLM providers (OpenAI, Azure OpenAI, Google Vertex)

### Deployment
- GitHub repository for version control
- CI/CD pipeline for automated deployment
- Environment variable configuration for different environments

This requirements analysis provides a comprehensive overview of the project scope, technical specifications, and deliverables for Kyrylo Dubovyk's personal website with AI assistant.
