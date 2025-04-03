# Kyrylo Dubovyk Personal Website

A modern personal website and AI assistant showcasing Kyrylo Dubovyk's professional experience, skills, and services.

## Tech Stack

- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Backend**: FastAPI (Python)
- **AI Capabilities**: OpenAI integration with CLI tools access

## Features

- Modern, responsive UI using Next.js 14 and Tailwind CSS
- AI Assistant with chat capabilities
- CLI tools integration for demonstrating system access
- Portfolio showcasing projects and experience
- Contact form for potential clients
- Dark mode support

## Project Structure

```
dubovyk_website/
├── src/                    # Source code
│   ├── app/                # Next.js app directory
│   │   ├── api/            # Next.js API routes
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page
│   ├── components/         # React components
│   │   ├── ai-assistant/   # AI Assistant components
│   │   ├── layout/         # Layout components
│   │   └── ui/             # UI components
│   ├── lib/                # Utility functions and libraries
│   └── api/                # FastAPI backend
├── public/                 # Static assets
├── package.json            # Node.js dependencies
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
├── next.config.js          # Next.js configuration
└── requirements.txt        # Python dependencies
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install        # Install Node.js dependencies
   pip install -r requirements.txt  # Install Python dependencies
   ```
3. Run the development server:
   ```bash
   ./start.sh  # Starts both Next.js frontend and FastAPI backend
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Backend API

The FastAPI backend provides the following endpoints:

- `GET /api/health` - Health check endpoint
- `POST /api/chat` - Chat endpoint for the AI Assistant
- `GET /api/projects` - Projects data endpoint
- `GET /api/skills` - Skills data endpoint

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4
ACTIVE_LLM_PROVIDER=openai
```

## Deployment

This project can be deployed on Vercel for the frontend and any Python hosting service for the backend.

See `vercel.json` for Vercel configuration and `deployment_guide.md` for detailed deployment instructions.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
