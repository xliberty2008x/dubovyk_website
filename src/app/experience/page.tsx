"use client";

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ExperienceTimeline from '@/components/ui/ExperienceTimeline';

export default function ExperiencePage() {
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Professional Experience</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              A timeline of Kyrylo Dubovyk's professional journey and career achievements.
            </p>
          </div>
          
          <ExperienceTimeline />
          
        </div>
      </main>
      
      <Footer />
    </>
  );
}
