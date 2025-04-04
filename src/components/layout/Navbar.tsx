"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers/AuthProvider';
import { supabase } from '@/lib/supabaseClient';
import ProfileImage from '@/components/ui/ProfileImage'; // Import the ProfileImage component

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const pathname = usePathname(); 
  const { user, loading } = useAuth(); // Get user and loading state
  const router = useRouter(); // Get router for logout redirect
  const adminMenuRef = useRef<HTMLDivElement>(null);

  // Close admin menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (adminMenuRef.current && !adminMenuRef.current.contains(event.target as Node)) {
        setIsAdminMenuOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
            <div className="flex-shrink-0 flex items-center space-x-3">
              {/* Add ProfileImage component */}
              <div className="hidden sm:block">
                <ProfileImage size={32} className="rounded-full object-cover border-2 border-blue-500" />
              </div>
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
               <div className="flex items-center space-x-6">
                 {/* Admin Dropdown Menu */}
                 <div className="relative" ref={adminMenuRef}>
                   <button
                     onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                     className={`inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md ${
                       pathname.startsWith('/admin')
                         ? 'bg-blue-600 text-white hover:bg-blue-700'
                         : 'bg-gray-100 text-gray-700 dark:text-gray-300 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                     } transition-colors`}
                   >
                     Admin
                     <svg
                       className={`ml-1 h-4 w-4 transition-transform ${isAdminMenuOpen ? 'rotate-180' : ''}`}
                       xmlns="http://www.w3.org/2000/svg"
                       viewBox="0 0 20 20"
                       fill="currentColor"
                     >
                       <path
                         fillRule="evenodd"
                         d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                         clipRule="evenodd"
                       />
                     </svg>
                   </button>
                   
                   {/* Dropdown Menu */}
                   {isAdminMenuOpen && (
                     <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-20 border border-gray-200 dark:border-gray-700">
                       <Link
                         href="/admin/manage-posts"
                         className={`block px-4 py-2 text-sm ${
                           pathname === '/admin/manage-posts'
                             ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                             : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                         }`}
                         onClick={() => setIsAdminMenuOpen(false)}
                       >
                         Posts
                       </Link>
                       <Link
                         href="/admin/manage-experience"
                         className={`block px-4 py-2 text-sm ${
                           pathname === '/admin/manage-experience'
                             ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                             : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                         }`}
                         onClick={() => setIsAdminMenuOpen(false)}
                       >
                         Experience
                       </Link>
                       <Link
                         href="/admin/manage-skills"
                         className={`block px-4 py-2 text-sm ${
                           pathname === '/admin/manage-skills'
                             ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                             : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                         }`}
                         onClick={() => setIsAdminMenuOpen(false)}
                       >
                         Skills
                       </Link>
                       <Link
                         href="/admin/manage-projects"
                         className={`block px-4 py-2 text-sm ${
                           pathname === '/admin/manage-projects'
                             ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                             : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                         }`}
                         onClick={() => setIsAdminMenuOpen(false)}
                       >
                         Projects
                       </Link>
                       <Link
                         href="/admin/manage-profile"
                         className={`block px-4 py-2 text-sm ${
                           pathname === '/admin/manage-profile'
                             ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                             : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                         }`}
                         onClick={() => setIsAdminMenuOpen(false)}
                       >
                         Profile
                       </Link>
                       <Link
                         href="/admin/manage-api-keys"
                         className={`block px-4 py-2 text-sm ${
                           pathname === '/admin/manage-api-keys'
                             ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                             : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                         }`}
                         onClick={() => setIsAdminMenuOpen(false)}
                       >
                         API Keys
                       </Link>
                     </div>
                   )}
                 </div>

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
          {/* Add profile image to mobile menu */}
          <div className="flex items-center px-4 pt-4 pb-2">
            <ProfileImage size={28} className="rounded-full object-cover border-2 border-blue-500 mr-3" />
            <span className="font-medium text-gray-800 dark:text-white">Kyrylo Dubovyk</span>
          </div>
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
                   {/* Mobile Admin Section with Accordion */}
                   <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                     <button
                       onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                       className="flex justify-between w-full pl-3 pr-4 py-2 text-base font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200"
                     >
                       <span>Admin</span>
                       <svg
                         className={`h-5 w-5 transition-transform ${isAdminMenuOpen ? 'rotate-180' : ''}`}
                         xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 20 20"
                         fill="currentColor"
                       >
                         <path
                           fillRule="evenodd"
                           d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                           clipRule="evenodd"
                         />
                       </svg>
                     </button>
                     
                     {/* Mobile Admin Links (Collapsible) */}
                     {isAdminMenuOpen && (
                       <div className="pl-4 border-l-2 border-gray-200 dark:border-gray-700 ml-3 mt-1">
                         <Link 
                           href="/admin/manage-posts" 
                           className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-150 ${
                              pathname === '/admin/manage-posts' 
                                ? 'bg-blue-50 dark:bg-gray-800 border-blue-500 text-blue-700 dark:text-blue-400' 
                                : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-800 dark:hover:text-gray-200'
                            }`}
                             onClick={() => setIsMenuOpen(false)}
                          >
                            Posts
                          </Link>
                          <Link
                           href="/admin/manage-experience" 
                           className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-150 ${
                              pathname === '/admin/manage-experience' 
                                ? 'bg-blue-50 dark:bg-gray-800 border-blue-500 text-blue-700 dark:text-blue-400' 
                                : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-800 dark:hover:text-gray-200'
                            }`}
                             onClick={() => setIsMenuOpen(false)}
                          >
                            Experience
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
                            Skills
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
                            Projects
                          </Link>
                          <Link
                           href="/admin/manage-profile"
                           className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-150 ${
                              pathname === '/admin/manage-profile'
                                ? 'bg-blue-50 dark:bg-gray-800 border-blue-500 text-blue-700 dark:text-blue-400'
                                : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-800 dark:hover:text-gray-200'
                            }`}
                             onClick={() => setIsMenuOpen(false)}
                          >
                            Profile
                          </Link>
                          <Link
                           href="/admin/manage-api-keys"
                           className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-150 ${
                              pathname === '/admin/manage-api-keys'
                                ? 'bg-blue-50 dark:bg-gray-800 border-blue-500 text-blue-700 dark:text-blue-400'
                                : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-800 dark:hover:text-gray-200'
                            }`}
                             onClick={() => setIsMenuOpen(false)}
                          >
                            API Keys
                          </Link>
                       </div>
                     )}
                   </div>

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
