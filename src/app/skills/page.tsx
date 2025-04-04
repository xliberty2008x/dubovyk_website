"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SkillsGrid from '@/components/ui/SkillsGrid';
import CertificationsGrid from '@/components/ui/CertificationsGrid';

export default function SkillsPage() {
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
              className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-400 dark:to-teal-400"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Skills & Expertise
            </motion.h1>
            
            <motion.div 
              className="h-1 w-24 bg-gradient-to-r from-green-500 to-teal-500 mx-auto mb-6 rounded-full"
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
              Kyrylo Dubovyk's technical skills, certifications, and areas of expertise.
            </motion.p>
          </motion.div>
          
          {/* Background decoration elements */}
          <div className="relative">
            {/* Top-left decoration */}
            <motion.div 
              className="absolute -top-10 -left-10 w-40 h-40 bg-green-50 dark:bg-green-900/20 rounded-full blur-3xl opacity-50 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ duration: 1.5, delay: 0.2 }}
            />
            
            {/* Bottom-right decoration */}
            <motion.div 
              className="absolute -bottom-20 -right-10 w-60 h-60 bg-teal-50 dark:bg-teal-900/20 rounded-full blur-3xl opacity-50 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ duration: 1.5, delay: 0.4 }}
            />
            
            {/* Skills section */}
            <motion.section 
              className="mb-16 relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <motion.h2 
                className="text-2xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-400 dark:to-teal-400"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                Technical Skills
              </motion.h2>
              <SkillsGrid />
            </motion.section>
            
            {/* Certifications section */}
            <motion.section
              className="relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <motion.h2 
                className="text-2xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-400 dark:to-teal-400"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                Certifications
              </motion.h2>
              <CertificationsGrid />
            </motion.section>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
