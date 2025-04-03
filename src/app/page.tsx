"use client";

import React, { useState, useEffect } from 'react'; // Added useState, useEffect
import Image from 'next/image'; // Import Next.js Image component
import { supabase } from '@/lib/supabaseClient'; // Import supabase client
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const BUCKET_NAME = 'dubovyk-assets'; // Bucket name defined earlier
const PROFILE_IMAGE_PATH = 'profile_image'; // File path defined earlier

export default function HomePage() {
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the public URL for the profile image
    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(`${PROFILE_IMAGE_PATH}?t=${new Date().getTime()}`); // Add timestamp for cache busting

    if (data?.publicUrl) {
       // Basic check if URL might be valid before setting
       fetch(data.publicUrl, { method: 'HEAD' })
        .then(res => {
          if (res.ok) {
             setProfileImageUrl(data.publicUrl);
          }
        }).catch(() => { /* Ignore fetch errors, means image likely doesn't exist */ });
    }
  }, []); // Fetch only on mount

  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Updated Hero Section */}
          <div className="text-center mb-12 flex flex-col items-center"> {/* Added flex for centering */}
            {/* Profile Image */}
            {profileImageUrl && (
              <div className="mb-6">
                <Image
                  src={profileImageUrl}
                  alt="Kyrylo Dubovyk profile picture"
                  width={128} // Adjust size as needed
                  height={128}
                  className="rounded-full object-cover border-4 border-blue-500 shadow-lg"
                  unoptimized // Use with timestamp for cache busting
                />
              </div>
            )}
            {/* Original Text */}
            <h1 className="text-4xl font-bold mb-4">AI Assistant</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Chat with Kyrylo's AI assistant to learn more about his experience, skills, and services.
              {/* Removed CLI access mention */}
            </p>
            {/* Removed Show/Hide CLI Help button */}
          </div>
          
          {/* Removed conditional rendering block for CLI Help */}
          
          {/* Removed ChatComponent rendering */}
          
          <div className="mt-16 bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">What Can The AI Help You With?</h2> 
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 1: Professional Background */}
              <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
                <div className="text-blue-600 dark:text-blue-400 mb-4">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Professional Background</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Ask about Kyrylo's work experience, education, and professional journey.
                </p>
              </div>
              
              {/* Card 2: Skills & Expertise */}
              <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
                <div className="text-blue-600 dark:text-blue-400 mb-4">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Skills & Expertise</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Learn about Kyrylo's technical skills, certifications, and areas of expertise.
                </p>
              </div>
              
              {/* Card 3: Projects & Achievements */}
              <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
                <div className="text-blue-600 dark:text-blue-400 mb-4">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Projects & Achievements</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Discover Kyrylo's notable projects, achievements, and professional accomplishments.
                </p>
              </div>
              
              {/* Card 4: Services Offered */}
              <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
                <div className="text-blue-600 dark:text-blue-400 mb-4">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Services Offered</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Find out about the professional services Kyrylo offers and how he can help your business.
                </p>
              </div>
              
              {/* Card 5: Availability & Booking */}
              <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
                <div className="text-blue-600 dark:text-blue-400 mb-4">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Availability & Booking</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Ask about Kyrylo's availability for consultations and how to book a meeting with him.
                </p>
              </div>
              
              {/* Removed Card 6: CLI Access */}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
