"use client";

import React from 'react';
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
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Skills & Expertise</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Kyrylo Dubovyk's technical skills, certifications, and areas of expertise.
            </p>
          </div>
          
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8">Technical Skills</h2>
            <SkillsGrid />
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-8">Certifications</h2>
            <CertificationsGrid />
          </section>
          
        </div>
      </main>
      
      <Footer />
    </>
  );
}
