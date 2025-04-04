"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProjectsGrid from '@/components/ui/ProjectsGrid';

export default function ProjectsPage() {
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
              className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Projects & Portfolio
            </motion.h1>
            
            <motion.div 
              className="h-1 w-24 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mb-6 rounded-full"
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
              Explore Kyrylo Dubovyk's notable projects and professional work.
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
            
            {/* Projects grid component */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="relative z-10"
            >
              <ProjectsGrid />
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
