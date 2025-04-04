"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ExperienceTimeline from '@/components/ui/ExperienceTimeline';

export default function ExperiencePage() {
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
              className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-400 dark:to-indigo-500"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Professional Experience
            </motion.h1>
            
            <motion.div 
              className="h-1 w-24 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto mb-6 rounded-full"
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
              A timeline of Kyrylo Dubovyk's professional journey and career achievements.
            </motion.p>
          </motion.div>
          
          {/* Background decoration elements */}
          <div className="relative">
            {/* Top-left decoration */}
            <motion.div 
              className="absolute -top-10 -left-10 w-40 h-40 bg-blue-50 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ duration: 1.5, delay: 0.2 }}
            />
            
            {/* Bottom-right decoration */}
            <motion.div 
              className="absolute -bottom-20 -right-10 w-60 h-60 bg-indigo-50 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-50 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ duration: 1.5, delay: 0.4 }}
            />
            
            {/* Timeline component */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="relative z-10"
            >
              <ExperienceTimeline />
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
