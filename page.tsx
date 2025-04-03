import React, { useState } from 'react';
import ChatComponent from '@/components/ai-assistant/ChatComponent';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function AIAssistantPage() {
  const [showCLIHelp, setShowCLIHelp] = useState(false);

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">AI Assistant</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Chat with Kyrylo's AI assistant to learn more about his experience, skills, and services.
              Now with CLI access capabilities!
            </p>
            <button 
              onClick={() => setShowCLIHelp(!showCLIHelp)}
              className="mt-4 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
            >
              {showCLIHelp ? 'Hide CLI Help' : 'Show CLI Help'}
            </button>
          </div>
          
          {showCLIHelp && (
            <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-bold mb-4">CLI Access Instructions</h2>
              <p className="mb-4">
                This AI assistant has CLI access capabilities. You can use the following commands to interact with the system:
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold">Execute Command</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    Run shell commands (limited to safe commands for security).
                  </p>
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md font-mono text-sm">
                    /tool {"{"}"name": "executeCommand", "arguments": {"{"}"command": "ls -la"{"}"}{"}"}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-bold">Read File</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    Read the contents of a file (limited to safe directories).
                  </p>
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md font-mono text-sm">
                    /tool {"{"}"name": "readFile", "arguments": {"{"}"path": "/tmp/example.txt", "maxLines": 10{"}"}{"}"}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-bold">System Information</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    Get system information (CPU, memory, disk, OS).
                  </p>
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md font-mono text-sm">
                    /tool {"{"}"name": "getSystemInfo", "arguments": {"{"}"type": "os"{"}"}{"}"}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-bold">Network Information</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    Get network information or make HTTP requests.
                  </p>
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md font-mono text-sm">
                    /tool {"{"}"name": "networkInfo", "arguments": {"{"}"action": "interfaces"{"}"}{"}"}
                  </div>
                </div>
              </div>
              
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Note: These commands are executed in a secure environment with appropriate restrictions for security purposes.
              </p>
            </div>
          )}
          
          <ChatComponent />
          
          <div className="mt-16 bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">What Can I Help You With?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md">
                <div className="text-blue-600 dark:text-blue-400 mb-4">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Professional Background</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Ask about Kyrylo's work experience, education, and professional journey.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md">
                <div className="text-blue-600 dark:text-blue-400 mb-4">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Skills & Expertise</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Learn about Kyrylo's technical skills, certifications, and areas of expertise.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md">
                <div className="text-blue-600 dark:text-blue-400 mb-4">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Projects & Achievements</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Discover Kyrylo's notable projects, achievements, and professional accomplishments.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md">
                <div className="text-blue-600 dark:text-blue-400 mb-4">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Services Offered</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Find out about the professional services Kyrylo offers and how he can help your business.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md">
                <div className="text-blue-600 dark:text-blue-400 mb-4">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Availability & Booking</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Ask about Kyrylo's availability for consultations and how to book a meeting with him.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md">
                <div className="text-blue-600 dark:text-blue-400 mb-4">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">CLI Access</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Use CLI commands to interact with the system, execute commands, read files, and get system information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
