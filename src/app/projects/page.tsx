"use client";

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProjectsGrid from '@/components/ui/ProjectsGrid';

export default function ProjectsPage() {
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Projects & Portfolio</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Explore Kyrylo Dubovyk's notable projects and professional work.
            </p>
          </div>
          
          <ProjectsGrid />
          
        </div>
      </main>
      
      <Footer />
    </>
  );
}
