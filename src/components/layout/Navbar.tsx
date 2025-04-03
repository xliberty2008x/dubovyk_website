"use client";

"use client";

"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // Import useRouter
import { useAuth } from '@/app/providers/AuthProvider'; // Import useAuth
import { supabase } from '@/lib/supabaseClient'; // Import supabase for logout

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname(); 
  const { user, loading } = useAuth(); // Get user and loading state
  const router = useRouter(); // Get router for logout redirect

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error);
    } else {
      // Optionally redirect to home page after logout
      router.push('/');
      router.refresh(); // Force refresh to update auth state across components
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-800 dark:text-white">
                Kyrylo Dubovyk
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {/* Desktop Links with Active Styling */}
              <Link 
                href="/" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-150 ${
                  pathname === '/' 
                    ? 'border-blue-500 text-gray-900 dark:text-white' 
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Home
              </Link>
              <Link 
                href="/experience" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-150 ${
                  pathname === '/experience' 
                    ? 'border-blue-500 text-gray-900 dark:text-white' 
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Experience
              </Link>
              <Link 
                href="/projects" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-150 ${
                  pathname === '/projects' 
                    ? 'border-blue-500 text-gray-900 dark:text-white' 
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Projects
              </Link>
              <Link 
                href="/skills" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-150 ${
                  pathname === '/skills' 
                    ? 'border-blue-500 text-gray-900 dark:text-white' 
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Skills
              </Link>
              <Link 
                href="/contact" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-150 ${
                  pathname === '/contact' 
                    ? 'border-blue-500 text-gray-900 dark:text-white' 
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Contact
              </Link>
               <Link 
                href="/updates" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-150 ${
                  pathname === '/updates' 
                    ? 'border-blue-500 text-gray-900 dark:text-white' 
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Blog {/* Renamed from Updates */}
              </Link>
            </div>
          </div>
          
          {/* Right side items: Login/Admin/Logout */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
             {!loading && !user && (
                 <Link 
                  href="/login" 
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Login
                </Link>
             )}
             {!loading && user && (
               // Adjusted spacing (space-x-6) and removed the "Admin:" label
               <div className="flex items-center space-x-6"> 
                 <Link 
                    href="/admin/manage-posts" 
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-150 ${
                      pathname === '/admin/manage-posts' 
                        ? 'border-blue-500 text-gray-900 dark:text-white' 
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    Posts {/* Shortened Link Name */}
                  </Link>
                  <Link 
                    href="/admin/manage-experience" 
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-150 ${
                      pathname === '/admin/manage-experience' 
                        ? 'border-blue-500 text-gray-900 dark:text-white' 
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    Experience {/* Shortened Link Name */}
                  </Link>
                   <Link 
                    href="/admin/manage-skills" 
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-150 ${
                      pathname === '/admin/manage-skills' 
                        ? 'border-blue-500 text-gray-900 dark:text-white' 
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    Skills {/* Shortened Link Name */}
                  </Link>
                  <Link 
                    href="/admin/manage-projects" 
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-150 ${
                      pathname === '/admin/manage-projects' 
                        ? 'border-blue-500 text-gray-900 dark:text-white' 
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    Projects {/* Shortened Link Name */}
                  </Link>
                  {/* Added Link to Manage Profile */}
                  <Link
                    href="/admin/manage-profile"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-150 ${
                      pathname === '/admin/manage-profile'
                        ? 'border-blue-500 text-gray-900 dark:text-white'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    Profile {/* Shortened Link Name */}
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Logout
                  </button>
               </div>
             )}
           </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex items-center sm:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
             {/* Mobile Links with Active Styling */}
             <Link 
              href="/" 
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-150 ${
                pathname === '/' 
                  ? 'bg-blue-50 dark:bg-gray-800 border-blue-500 text-blue-700 dark:text-blue-400' 
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
              onClick={() => setIsMenuOpen(false)} // Close menu on click
            >
              Home
            </Link>
            <Link 
              href="/experience" 
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-150 ${
                pathname === '/experience' 
                  ? 'bg-blue-50 dark:bg-gray-800 border-blue-500 text-blue-700 dark:text-blue-400' 
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
              onClick={() => setIsMenuOpen(false)} // Close menu on click
            >
              Experience
            </Link>
            <Link 
              href="/projects" 
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-150 ${
                pathname === '/projects' 
                  ? 'bg-blue-50 dark:bg-gray-800 border-blue-500 text-blue-700 dark:text-blue-400' 
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
              onClick={() => setIsMenuOpen(false)} // Close menu on click
            >
              Projects
            </Link>
            <Link 
              href="/skills" 
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-150 ${
                pathname === '/skills' 
                  ? 'bg-blue-50 dark:bg-gray-800 border-blue-500 text-blue-700 dark:text-blue-400' 
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
              onClick={() => setIsMenuOpen(false)} // Close menu on click
            >
              Skills
            </Link>
            <Link 
              href="/contact" 
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-150 ${
                pathname === '/contact' 
                  ? 'bg-blue-50 dark:bg-gray-800 border-blue-500 text-blue-700 dark:text-blue-400' 
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
              onClick={() => setIsMenuOpen(false)} 
            >
              Contact
            </Link>
             <Link 
              href="/updates" 
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-150 ${
                pathname === '/updates' 
                  ? 'bg-blue-50 dark:bg-gray-800 border-blue-500 text-blue-700 dark:text-blue-400' 
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
              onClick={() => setIsMenuOpen(false)} 
            >
              Blog {/* Renamed from Updates */}
            </Link>
            
            {/* Mobile Auth Links */}
            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              {!loading && !user && (
                  <Link 
                    href="/login" 
                    className="block pl-3 pr-4 py-2 text-base font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
              )}
               {!loading && user && (
                 <>
                   <Link 
                     href="/admin/manage-posts" 
                     className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-150 ${
                        pathname === '/admin/manage-posts' 
                          ? 'bg-blue-50 dark:bg-gray-800 border-blue-500 text-blue-700 dark:text-blue-400' 
                          : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-800 dark:hover:text-gray-200'
                      }`}
                       onClick={() => setIsMenuOpen(false)}
                    >
                      Posts {/* Simplified */}
                    </Link>
                    {/* Mobile Admin Links */}
                    <Link
                     href="/admin/manage-experience" 
                     className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-150 ${
                        pathname === '/admin/manage-experience' 
                          ? 'bg-blue-50 dark:bg-gray-800 border-blue-500 text-blue-700 dark:text-blue-400' 
                          : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-800 dark:hover:text-gray-200'
                      }`}
                       onClick={() => setIsMenuOpen(false)}
                    >
                      Experience {/* Simplified */}
                    </Link>
                     <Link
                     href="/admin/manage-skills" 
                     className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-150 ${
                        pathname === '/admin/manage-skills' 
                          ? 'bg-blue-50 dark:bg-gray-800 border-blue-500 text-blue-700 dark:text-blue-400' 
                          : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-800 dark:hover:text-gray-200'
                      }`}
                       onClick={() => setIsMenuOpen(false)}
                    >
                      Skills {/* Simplified */}
                    </Link>
                    <Link
                     href="/admin/manage-projects" 
                     className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-150 ${
                        pathname === '/admin/manage-projects' 
                          ? 'bg-blue-50 dark:bg-gray-800 border-blue-500 text-blue-700 dark:text-blue-400' 
                          : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-800 dark:hover:text-gray-200'
                      }`}
                       onClick={() => setIsMenuOpen(false)}
                    >
                      Projects {/* Simplified */}
                    </Link>
                    {/* Added Link to Manage Profile (Mobile) */}
                    <Link
                     href="/admin/manage-profile"
                     className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-150 ${
                        pathname === '/admin/manage-profile'
                          ? 'bg-blue-50 dark:bg-gray-800 border-blue-500 text-blue-700 dark:text-blue-400'
                          : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-800 dark:hover:text-gray-200'
                      }`}
                       onClick={() => setIsMenuOpen(false)}
                    >
                      Profile {/* Simplified */}
                    </Link>

                   <button
                     onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                     className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200"
                   >
                     Logout
                   </button>
                 </>
               )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
