import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ChatPopup from '@/components/ai-assistant/ChatPopup'; 
import { AuthProvider } from './providers/AuthProvider'; // Import AuthProvider

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Kyrylo Dubovyk - AI Solutions Architect',
  description: 'Personal website of Kyrylo Dubovyk, AI Solutions Architect and AI Engineer specializing in LLM applications and AI agents.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider> {/* Wrap content with AuthProvider */}
          {children}
          <ChatPopup /> {/* Render the ChatPopup globally */}
          <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-gray-500 dark:text-gray-400">
                  © {new Date().getFullYear()} Kyrylo Dubovyk. All rights reserved.
                </p>
              </div>
              <div className="flex space-x-6">
                <a href="https://www.linkedin.com/in/kir-dubovyk" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-150">
                  LinkedIn
                </a>
                <a href="https://github.com/xliberty2008x/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-150">
                  GitHub
                </a>
                <a href="mailto:dubkirill2008@gmail.com" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-150">
                  Email
                </a>
              </div>
            </div>
          </div>
          </footer>
        </AuthProvider> {/* Close AuthProvider */}
      </body>
    </html>
  );
}
