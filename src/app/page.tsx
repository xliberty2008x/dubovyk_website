"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getProfileImageUrl } from '@/lib/profileUtils'; // Import the new utility function

export default function HomePage() {
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  useEffect(() => {
    // Use the new utility function to get the profile image URL
    const fetchProfileImage = async () => {
      try {
        const imageUrl = await getProfileImageUrl();
        if (imageUrl) {
          console.log('Profile image URL:', imageUrl);
          setProfileImageUrl(imageUrl);
        }
      } catch (error) {
        console.error('Error fetching profile image:', error);
      }
    };

    fetchProfileImage();
  }, []); // Fetch only on mount

  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-20">
        {/* Adjusted base horizontal padding */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8"> 
          {/* Updated Hero Section */}
          <div className="text-center mb-10 md:mb-12 flex flex-col items-center"> {/* Added flex for centering */}
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
            {/* Original Text - Adjusted heading size for smaller screens */}
            <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">AI Assistant</h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Chat with Kyrylo's AI assistant to learn more about his experience, skills, and services.
            </p>
            {/* Removed Show/Hide CLI Help button */}
          </div>
          
          {/* Removed conditional rendering block for CLI Help */}
          
          
          {/* Adjusted margin-top and padding */}
          <div className="mt-12 md:mt-16 bg-gray-50 dark:bg-gray-800 rounded-lg p-6 md:p-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-5 sm:mb-6 text-center">What Can The AI Help You With?</h2> 
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {/* Card 1: Professional Background */}
              {/* Adjusted card padding */}
              <div className="bg-white dark:bg-gray-700 rounded-lg p-5 md:p-6 shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
                <div className="text-blue-600 dark:text-blue-400 mb-3">
                  {/* Adjusted icon size slightly */}
                  <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                {/* Adjusted heading size */}
                <h3 className="text-lg sm:text-xl font-bold mb-2">Professional Background</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  Ask about Kyrylo's work experience, education, and journey.
                </p>
              </div>
              
              {/* Card 2: Skills & Expertise */}
              <div className="bg-white dark:bg-gray-700 rounded-lg p-5 md:p-6 shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
                <div className="text-blue-600 dark:text-blue-400 mb-3">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">Skills & Expertise</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  Learn about Kyrylo's technical skills, certifications, and expertise.
                </p>
              </div>
              
              {/* Card 3: Projects & Achievements */}
              <div className="bg-white dark:bg-gray-700 rounded-lg p-5 md:p-6 shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
                <div className="text-blue-600 dark:text-blue-400 mb-3">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">Projects & Achievements</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  Discover Kyrylo's notable projects and accomplishments.
                </p>
              </div>
              
              {/* Card 4: Services Offered */}
              <div className="bg-white dark:bg-gray-700 rounded-lg p-5 md:p-6 shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
                <div className="text-blue-600 dark:text-blue-400 mb-3">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">Services Offered</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  Find out about the services Kyrylo offers and how he can help.
                </p>
              </div>
              
              {/* Card 5: Availability & Booking */}
              <div className="bg-white dark:bg-gray-700 rounded-lg p-5 md:p-6 shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
                <div className="text-blue-600 dark:text-blue-400 mb-3">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">Availability & Booking</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  Ask about Kyrylo's availability and how to book a meeting.
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
