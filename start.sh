#!/bin/bash

# Start the Next.js frontend, FastAPI backend, and MCP server
echo "Starting Dubovyk Website..."

# Kill any existing processes that might interfere with our ports
echo "Checking for existing processes..."

# Kill any process using the MCP server port (3004)
MCP_PORT=3004
MCP_PID=$(lsof -t -i:$MCP_PORT 2>/dev/null)
if [ -n "$MCP_PID" ]; then
  echo "Found existing MCP server on port $MCP_PORT (PID: $MCP_PID), killing it..."
  kill $MCP_PID 2>/dev/null || kill -9 $MCP_PID 2>/dev/null
  sleep 1
fi

# Kill any process using the FastAPI backend port (8000)
BACKEND_PORT=8000
BACKEND_PID=$(lsof -t -i:$BACKEND_PORT 2>/dev/null)
if [ -n "$BACKEND_PID" ]; then
  echo "Found existing FastAPI server on port $BACKEND_PORT (PID: $BACKEND_PID), killing it..."
  kill $BACKEND_PID 2>/dev/null || kill -9 $BACKEND_PID 2>/dev/null
  sleep 1
fi

# Kill any process using the Next.js frontend ports (3000, 3001)
NEXTJS_PORTS=(3000 3001)
for PORT in "${NEXTJS_PORTS[@]}"; do
  NEXTJS_PID=$(lsof -t -i:$PORT 2>/dev/null)
  if [ -n "$NEXTJS_PID" ]; then
    echo "Found existing Next.js server on port $PORT (PID: $NEXTJS_PID), killing it..."
    kill $NEXTJS_PID 2>/dev/null || kill -9 $NEXTJS_PID 2>/dev/null
    sleep 1
  fi
done

# Check if venv exists
if [ ! -d "venv" ]; then
  echo "Creating Python virtual environment..."
  python -m venv venv
  source venv/bin/activate
  pip install -r requirements.txt
else
  source venv/bin/activate
fi

# Start FastAPI backend in the background
echo "Starting FastAPI backend..."
uvicorn src.api.main:app --reload --port 8000 &
BACKEND_PID=$!

# Start unified MCP server in the background
echo "Starting unified MCP server..."
node src/mcp-server/express-bridge/index.js &
MCP_PID=$!

# Install npm dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
  echo "Installing npm dependencies..."
  npm install
fi

# Start Next.js frontend
echo "Starting Next.js frontend..."
npm run dev

# Kill both the backend and MCP processes when frontend is stopped
kill $BACKEND_PID
kill $MCP_PID
