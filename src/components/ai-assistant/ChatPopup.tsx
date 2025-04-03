"use client";

import React, { useState } from 'react';
import ChatComponent from './ChatComponent'; // Import the existing chat component

const ChatPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 z-50 transition-transform transform hover:scale-110"
        aria-label="Toggle chat assistant"
      >
        {/* Simple Chat Icon */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-[calc(100%-3rem)] max-w-md h-[70vh] max-h-[600px] z-40 flex flex-col">
           {/* Close Button inside the modal area for better accessibility */}
           <button
              onClick={toggleChat}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white z-50" // Ensure button is above chat component header
              aria-label="Close chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          {/* Pass the ChatComponent - it handles its own styling internally */}
          {/* Adjust ChatComponent's container div styling if needed */}
          <div className="flex-grow shadow-xl rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <ChatComponent /> 
          </div>
        </div>
      )}
    </>
  );
};

export default ChatPopup;
