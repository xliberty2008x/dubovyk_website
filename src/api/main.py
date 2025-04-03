from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional, List
import os

app = FastAPI(title="Dubovyk Website API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    tool_calls: Optional[List[Dict[str, Any]]] = None

class ChatResponse(BaseModel):
    response: str
    tool_results: Optional[List[Dict[str, Any]]] = None

@app.get("/")
async def root():
    return {"message": "Dubovyk Website API is running"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/api/chat", response_model=ChatResponse)
async def process_chat(request: ChatRequest):
    """
    Process a chat message and return a response, optionally executing tools
    """
    # This is a placeholder implementation
    # In a real implementation, this would connect to an LLM API
    
    last_message = request.messages[-1] if request.messages else None
    
    if not last_message:
        raise HTTPException(status_code=400, detail="No messages provided")
    
    response = {
        "response": f"Echo: {last_message.content}",
        "tool_results": None
    }
    
    return response

@app.get("/api/projects")
async def get_projects():
    """
    Return a list of projects for the portfolio
    """
    projects = [
        {
            "id": "1",
            "title": "AI Assistant Framework",
            "description": "Created a versatile AI assistant framework with command-line capabilities and user privacy features",
            "technologies": ["Python", "TypeScript", "React", "FastAPI", "OpenAI API"],
            "image": "/images/ai-assistant.jpg",
            "url": "/projects/ai-assistant"
        },
        {
            "id": "2",
            "title": "Personal Portfolio Website",
            "description": "Built a modern, responsive portfolio website using Next.js and Tailwind CSS",
            "technologies": ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
            "image": "/images/portfolio.jpg",
            "url": "/projects/portfolio"
        }
    ]
    
    return {"projects": projects}

@app.get("/api/skills")
async def get_skills():
    """
    Return a list of skills
    """
    skills = [
        {"name": "Python", "level": 95, "category": "Programming Languages"},
        {"name": "TypeScript", "level": 90, "category": "Programming Languages"},
        {"name": "React", "level": 85, "category": "Frontend Frameworks"},
        {"name": "Next.js", "level": 80, "category": "Frontend Frameworks"},
        {"name": "TailwindCSS", "level": 90, "category": "Frontend Technologies"},
        {"name": "FastAPI", "level": 85, "category": "Backend Frameworks"},
        {"name": "OpenAI API", "level": 95, "category": "AI Integration"},
        {"name": "LangChain", "level": 85, "category": "AI Integration"},
        {"name": "AWS", "level": 80, "category": "Cloud Platforms"},
        {"name": "Docker", "level": 85, "category": "DevOps"}
    ]
    
    return {"skills": skills}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
