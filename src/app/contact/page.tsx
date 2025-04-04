"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ContactForm from '@/components/ui/ContactForm';
// import MeetingBooker from '@/components/ui/MeetingBooker';

export default function ContactPage() {
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Animated page header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.h1 
              className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Contact Kyrylo
            </motion.h1>
            
            <motion.div 
              className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: 96 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            />
            
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              Reach out to discuss your project requirements or schedule a consultation.
            </motion.p>
          </motion.div>
          
          {/* Background decoration elements */}
          <div className="relative">
            {/* Top-right decoration */}
            <motion.div 
              className="absolute -top-10 -right-10 w-40 h-40 bg-purple-50 dark:bg-purple-900/20 rounded-full blur-3xl opacity-50 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ duration: 1.5, delay: 0.2 }}
            />
            
            {/* Bottom-left decoration */}
            <motion.div 
              className="absolute -bottom-20 -left-10 w-60 h-60 bg-blue-50 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ duration: 1.5, delay: 0.4 }}
            />
            
            {/* Main content with grid layout */}
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {/* Contact form section */}
              <motion.section
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.6 }}
              >
                <motion.h2 
                  className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  Send a Message
                </motion.h2>
                <ContactForm onSubmit={(formData) => {
                  // In a real app, this would send the message to a server
                  console.log('Form submitted:', formData);
                  // You could add API call here to send the message
                }} />
              </motion.section>
              
              {/* Meeting booking and contact info section */}
              <motion.section
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.8 }}
              >
                <motion.h2 
                  className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  Book a Meeting
                </motion.h2>
                
                {/* Meeting booking card */}
                <motion.div 
                  className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                >
                  <motion.p 
                    className="text-gray-600 dark:text-gray-300 mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.1 }}
                  >
                    To schedule a consultation, please select a date and time that works for you.
                  </motion.p>
                  <motion.p 
                    className="text-gray-600 dark:text-gray-300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                  >
                    Coming soon: Online booking system
                  </motion.p>
                </motion.div>
                
                {/* Contact information card */}
                <motion.div 
                  className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.3 }}
                >
                  <motion.h3 
                    className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.4 }}
                  >
                    Contact Information
                  </motion.h3>
                  
                  <motion.ul className="space-y-3">
                    {/* Email contact */}
                    <motion.li 
                      className="flex items-center"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 1.5 }}
                      whileHover={{ x: 5, transition: { duration: 0.2 } }}
                    >
                      <motion.svg 
                        className="h-6 w-6 mr-3 text-blue-600" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                        whileHover={{ 
                          rotate: [0, 10, -10, 10, 0],
                          transition: { duration: 0.5 }
                        }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </motion.svg>
                      <motion.span 
                        className="text-gray-700 dark:text-gray-300"
                        whileHover={{ 
                          color: "#3b82f6", // Blue-500
                          transition: { duration: 0.2 }
                        }}
                      >
                        dubkirill2008@gmail.com
                      </motion.span>
                    </motion.li>
                    
                    {/* LinkedIn contact */}
                    <motion.li 
                      className="flex items-center"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 1.6 }}
                      whileHover={{ x: 5, transition: { duration: 0.2 } }}
                    >
                      <motion.svg 
                        className="h-6 w-6 mr-3 text-blue-600" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                        whileHover={{ 
                          rotate: [0, 10, -10, 10, 0],
                          transition: { duration: 0.5 }
                        }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </motion.svg>
                      <motion.a 
                        href="https://www.linkedin.com/in/kir-dubovyk" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-gray-700 dark:text-gray-300 hover:text-blue-600"
                        whileHover={{ 
                          color: "#3b82f6", // Blue-500
                          x: 2,
                          transition: { duration: 0.2 }
                        }}
                      >
                        LinkedIn Profile
                      </motion.a>
                    </motion.li>
                    
                    {/* Location information */}
                    <motion.li 
                      className="flex items-center"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 1.7 }}
                      whileHover={{ x: 5, transition: { duration: 0.2 } }}
                    >
                      <motion.svg 
                        className="h-6 w-6 mr-3 text-blue-600" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                        whileHover={{ 
                          rotate: [0, 10, -10, 10, 0],
                          transition: { duration: 0.5 }
                        }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </motion.svg>
                      <motion.span 
                        className="text-gray-700 dark:text-gray-300"
                        whileHover={{ 
                          color: "#3b82f6", // Blue-500
                          transition: { duration: 0.2 }
                        }}
                      >
                        Available for remote work worldwide
                      </motion.span>
                    </motion.li>
                  </motion.ul>
                </motion.div>
              </motion.section>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
