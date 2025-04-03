"use client";

"use client";

import React, { useState, useEffect, useRef } from 'react';
import { mcpGetTables } from '@/lib/mcp-client';
import { useAuth } from '@/app/providers/AuthProvider'; // Import useAuth hook

interface Message {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  tool_call_id?: string;
  tool_calls?: any[];
  isLoading?: boolean;
  isUsingTool?: boolean;
}

interface ChatComponentProps {
  initialMessages?: Message[];
}

const ChatComponent: React.FC<ChatComponentProps> = ({ initialMessages = [] }) => {
  const [messages, setMessages] = useState<Message[]>(
    initialMessages.length > 0 
      ? initialMessages 
      : [{ role: 'assistant', content: "Hello! I'm Kyrylo's AI assistant. How can I help you today?" }]
  );
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [enableTools, setEnableTools] = useState(true);
  const [useMcp, setUseMcp] = useState(false); // State for MCP connection
  const [mcpStatus, setMcpStatus] = useState< 'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth(); // Get user from auth context

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    // Create a function to handle the scrolling to avoid doing it directly in the effect
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        const messagesContainer = messagesEndRef.current.parentElement;
        if (messagesContainer) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
      }
    };
    
    // Call the scroll function when messages change
    scrollToBottom();
    
    // Also set up a small delay to ensure scrolling happens after any rendering
    const timeoutId = setTimeout(scrollToBottom, 100);
    
    // Clean up the timeout
    return () => clearTimeout(timeoutId);
  }, [messages.length]); // Only trigger when the number of messages changes

  // Check MCP connection when enabled
  useEffect(() => {
    if (useMcp && mcpStatus === 'idle') {
      checkMcpConnection();
    } else if (!useMcp) {
      setMcpStatus('idle'); // Reset status if MCP is disabled
    }
  }, [useMcp]); // Re-run when useMcp changes

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userInput = input;
    
    // Add user message to chat
    const userMessage: Message = { role: 'user', content: userInput };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Add a placeholder message for the AI response with loading state
    const loadingMessageId = Date.now().toString();
    const loadingMessage: Message = { 
      role: 'assistant', 
      content: 'Thinking...',
      tool_call_id: loadingMessageId,
      isLoading: true
    };
    
    setMessages(prev => [...prev, loadingMessage]);

    try {
      // Use streaming response
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userInput,
          history: messages.filter(msg => msg.tool_call_id !== loadingMessageId), // Don't include the loading message
          enableTools,
          useMcp, // Use state variable
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      
      // If tools were used, show that in the UI
      if (data.toolsUsed) {
        // First update to show "Using tools..."
        setMessages(prev => 
          prev.map(msg => 
            msg.tool_call_id === loadingMessageId 
              ? { ...msg, content: 'Using tools to find information...', isUsingTool: true }
              : msg
          )
        );
        
        // Small delay to show the "using tools" message
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
      // Update the loading message with the actual response
      setMessages(prev => 
        prev.map(msg => 
          msg.tool_call_id === loadingMessageId 
            ? { role: 'assistant', content: data.response } 
            : msg
        )
      );
    } catch (error) {
      console.error('Error fetching response:', error);
      
      // Update the loading message with the error
      setMessages(prev => 
        prev.map(msg => 
          msg.tool_call_id === loadingMessageId 
            ? { 
                role: 'assistant', 
                content: "I'm sorry, I encountered an error while processing your request. Please try again later." 
              } 
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };
  
  // Function to check MCP connection status, can be triggered manually
  const checkMcpConnection = async () => {
    setMcpStatus('connecting');
    try {
      // Test a basic MCP call
      const response = await fetch('/api/mcp-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tool: 'get_tables',
          arguments: {},
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log('MCP connection successful');
        setMcpStatus('connected');
      } else {
        console.error('MCP connection error:', data.error || 'Unknown error');
        setMcpStatus('error');
      }
    } catch (error) {
      console.error('Error connecting to MCP server:', error);
      setMcpStatus('error');
    }
  };

  return (
    // Adjust container: remove fixed height/width, ensure it fills parent, keep flex-col and background/rounding
    <div className="flex flex-col h-full w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden"> 
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center flex-shrink-0"> {/* Added flex-shrink-0 */}
        <div>
          <h2 className="text-xl font-semibold">AI Assistant</h2> 
          <p className="text-sm opacity-80">Ask me anything about Kyrylo's experience, skills, or projects</p>
        </div>
        {/* Conditionally render settings button only for logged-in users */}
        {user && ( 
          <button 
            onClick={toggleSettings}
            className="p-2 rounded-full hover:bg-blue-700 transition-colors"
            aria-label="Settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Settings panel is shown only if the button was clicked (which requires user to be logged in) */}
      {showSettings && user && ( 
        <div className="bg-gray-100 dark:bg-gray-700 p-4 border-b border-gray-200 dark:border-gray-600">
          <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">Assistant Settings</h3>
          <div className="flex flex-col gap-2">
            <label className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
              <input 
                type="checkbox" 
                checked={enableTools} 
                onChange={() => setEnableTools(!enableTools)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Enable AI Tools (e.g., Weather, Search)</span>
            </label>

            <label className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={useMcp}
                onChange={() => setUseMcp(!useMcp)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Enable Database Connection (MCP)</span>
            </label>

            {/* Database Status Indicator */}
            <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300 mt-1">
              <span className="font-medium">Database Status:</span>
              {mcpStatus === 'idle' && !useMcp && (
                <span className="ml-2 text-gray-500">Disabled</span>
              )}
              {mcpStatus === 'idle' && useMcp && (
                 <span className="ml-2 text-gray-500">Idle</span>
              )}
              {mcpStatus === 'connecting' && (
                <span className="ml-2 text-yellow-500 flex items-center">
                  <div className="w-3 h-3 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mr-1"></div>
                  Connecting...
                </span>
              )}
              {mcpStatus === 'connected' && (
                <span className="ml-2 text-green-500 font-semibold">Connected</span>
              )}
              {mcpStatus === 'error' && (
                <span className="ml-2 text-red-500">Connection Error</span>
              )}
              {/* Add a button to manually check connection if MCP is enabled but not connected */}
              {useMcp && (mcpStatus === 'idle' || mcpStatus === 'error') && (
                <button
                  onClick={checkMcpConnection}
                  className="ml-auto text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                  // No need for disabled check here as the button is only shown when not connecting
                >
                  Check Connection
                </button>
              )}
            </div>
            
            {mcpStatus === 'connected' && useMcp && (
              <div className="mt-1 text-xs text-green-600 dark:text-green-400">
                Database access enabled.
              </div>
            )}
          </div>
        </div>
      )}
      
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                msg.role === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : msg.role === 'tool'
                    ? 'bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-800 text-gray-800 dark:text-gray-200'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
            >
              {msg.role === 'tool' && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tool Result</div>
              )}
              {msg.isLoading ? (
                <div className="flex items-center">
                  <span className="mr-2">{msg.content}</span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              ) : msg.isUsingTool ? (
                <div className="flex items-center">
                  <span className="mr-2">{msg.content}</span>
                  <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form 
        onSubmit={handleSubmit} 
        className="border-t border-gray-200 dark:border-gray-700 p-4"
      >
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 text-gray-800 dark:text-white"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
              !input.trim() || isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;
