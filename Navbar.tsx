import React from 'react';

interface NavbarProps {
  transparent?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ transparent = false }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        transparent && !isScrolled 
          ? 'bg-transparent' 
          : 'bg-white dark:bg-gray-900 shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="/" className={`text-xl font-bold ${
              transparent && !isScrolled 
                ? 'text-white' 
                : 'text-gray-800 dark:text-white'
            }`}>
              Kyrylo Dubovyk
            </a>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <a 
              href="/" 
              className={`${
                transparent && !isScrolled 
                  ? 'text-white hover:text-gray-200' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white'
              } px-3 py-2 text-sm font-medium`}
            >
              Home
            </a>
            <a 
              href="/experience" 
              className={`${
                transparent && !isScrolled 
                  ? 'text-white hover:text-gray-200' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white'
              } px-3 py-2 text-sm font-medium`}
            >
              Experience
            </a>
            <a 
              href="/skills" 
              className={`${
                transparent && !isScrolled 
                  ? 'text-white hover:text-gray-200' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white'
              } px-3 py-2 text-sm font-medium`}
            >
              Skills
            </a>
            <a 
              href="/contact" 
              className={`${
                transparent && !isScrolled 
                  ? 'bg-white text-blue-600 hover:bg-gray-100' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } px-4 py-2 text-sm font-medium rounded-md transition-colors`}
            >
              Contact Me
            </a>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md ${
                transparent && !isScrolled 
                  ? 'text-white hover:text-gray-200 hover:bg-gray-700 hover:bg-opacity-25' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700'
              } focus:outline-none`}
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icon when menu is open */}
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-white dark:bg-gray-900 shadow-lg`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a
            href="/"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
          >
            Home
          </a>
          <a
            href="/experience"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
          >
            Experience
          </a>
          <a
            href="/skills"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
          >
            Skills
          </a>
          <a
            href="/contact"
            className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700"
          >
            Contact Me
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
