# Project Architecture for Kyrylo Dubovyk's Personal Website with AI Assistant

## Overall Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                  Next.js Application                        │
│                                                             │
├─────────────┬─────────────────────────┬───────────────────┐ │
│             │                         │                   │ │
│  Frontend   │      API Routes         │  AI Assistant     │ │
│  (Pages)    │                         │  Integration      │ │
│             │                         │                   │ │
└─────────────┴─────────────────────────┴───────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
          │                   │                  │
          ▼                   ▼                  ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│                 │  │                 │  │                 │
│  Meeting        │  │  LLM Providers  │  │  Pipedream      │
│  Booking        │  │  - OpenAI       │  │  API            │
│  Service        │  │  - Azure OpenAI │  │  Integration    │
│                 │  │  - Vertex AI    │  │                 │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

## Frontend Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                  Next.js Frontend                           │
│                                                             │
├─────────────┬─────────────┬─────────────┬─────────────────┐ │
│             │             │             │                 │ │
│  Homepage   │  Experience │  Skills     │  Contact        │ │
│             │  Page       │  Page       │  Page           │ │
│             │             │             │                 │ │
└─────────────┴─────────────┴─────────────┴─────────────────┘ │
│                                                             │
│                  Shared Components                          │
│                                                             │
├─────────────┬─────────────┬─────────────┬─────────────────┐ │
│             │             │             │                 │ │
│  Navigation │  Footer     │  Layout     │  UI Components  │ │
│             │             │             │                 │ │
└─────────────┴─────────────┴─────────────┴─────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## AI Assistant Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                  AI Assistant                               │
│                                                             │
├─────────────┬─────────────────────────┬───────────────────┐ │
│             │                         │                   │ │
│  Chat UI    │      LLM Provider       │  Knowledge Base   │ │
│             │      Abstraction        │                   │ │
│             │                         │                   │ │
└─────────────┴─────────────────────────┴───────────────────┘ │
│                                                             │
│                  Tool Integration                           │
│                                                             │
├─────────────┬─────────────┬─────────────┬─────────────────┐ │
│             │             │             │                 │ │
│  MCP        │  Pipedream  │  Admin      │  Custom Tools   │ │
│  Framework  │  Connect    │  Panel      │                 │ │
│             │             │             │                 │ │
└─────────────┴─────────────┴─────────────┴─────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Architecture

```
┌───────────┐     ┌───────────┐     ┌───────────┐     ┌───────────┐
│           │     │           │     │           │     │           │
│  User     │────▶│  Frontend │────▶│  API      │────▶│  LLM      │
│  Input    │     │  UI       │     │  Routes   │     │  Provider │
│           │     │           │     │           │     │           │
└───────────┘     └───────────┘     └───────────┘     └───────────┘
                                          │                  │
                                          │                  │
                                          ▼                  ▼
                                    ┌───────────┐     ┌───────────┐
                                    │           │     │           │
                                    │  Tool     │◀───▶│  External │
                                    │  Calling  │     │  Services │
                                    │           │     │           │
                                    └───────────┘     └───────────┘
                                          │
                                          │
                                          ▼
                                    ┌───────────┐
                                    │           │
                                    │  Response │
                                    │  to User  │
                                    │           │
                                    └───────────┘
```

## Technology Stack

### Frontend
- Next.js 14+
- Tailwind CSS
- TypeScript
- React
- React Query (for data fetching)

### Backend
- Next.js API Routes
- Node.js

### AI Assistant
- LLM Provider SDKs:
  - OpenAI SDK
  - Azure OpenAI SDK
  - Google Vertex AI SDK
- Model Context Protocol (MCP)
- Pipedream API

### Deployment
- GitHub (version control)
- Vercel/Netlify/Cloudflare (hosting)
- Environment Variables (configuration)

## Directory Structure

```
kir-dubovyk-website/
├── public/                  # Static assets
│   ├── images/              # Images and photos
│   └── favicon.ico          # Website favicon
├── src/                     # Source code
│   ├── app/                 # Next.js App Router
│   │   ├── page.tsx         # Homepage
│   │   ├── experience/      # Experience page
│   │   ├── skills/          # Skills page
│   │   ├── contact/         # Contact page
│   │   ├── admin/           # Admin panel
│   │   └── layout.tsx       # Root layout
│   ├── components/          # Reusable components
│   │   ├── ui/              # UI components
│   │   ├── layout/          # Layout components
│   │   └── ai-assistant/    # AI assistant components
│   ├── lib/                 # Utility functions
│   │   ├── llm/             # LLM provider abstraction
│   │   ├── mcp/             # MCP implementation
│   │   └── pipedream/       # Pipedream integration
│   ├── api/                 # API routes
│   │   ├── chat/            # Chat API
│   │   ├── tools/           # Tool calling API
│   │   └── admin/           # Admin API
│   └── data/                # Static data and knowledge base
├── docs/                    # Documentation
│   ├── deployment/          # Deployment guides
│   ├── environment/         # Environment setup
│   ├── user-guide/          # User documentation
│   └── customization/       # Customization guides
├── .env.example             # Example environment variables
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── README.md                # Project overview
```

This architecture diagram provides a visual representation of the project structure, components, and data flow for Kyrylo Dubovyk's personal website with AI assistant.
