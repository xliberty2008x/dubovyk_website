"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface ProfileImageProps {
  size?: number;
  className?: string;
}

/**
 * A reusable component for displaying the profile image
 * This can be used across the site to ensure consistent display of the profile image
 */
const ProfileImage: React.FC<ProfileImageProps> = ({ 
  size = 40, 
  className = "rounded-full object-cover border-2 border-blue-500"
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        setLoading(true);
        // Fetch from our API endpoint
        const response = await fetch('/api/profile-image');
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile image');
        }
        
        const data = await response.json();
        
        if (data.url) {
          setImageUrl(data.url);
          setError(null);
        } else {
          setError('No profile image available');
        }
      } catch (err) {
        console.error('Error fetching profile image:', err);
        setError('Error loading profile image');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileImage();
  }, []);

  if (loading) {
    return (
      <div 
        className={`bg-gray-200 dark:bg-gray-700 animate-pulse ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  if (error || !imageUrl) {
    // Fallback to a default avatar or icon
    return (
      <div 
        className={`bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400 ${className}`}
        style={{ width: size, height: size }}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className="w-3/4 h-3/4"
        >
          <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
        </svg>
      </div>
    );
  }

  return (
    <Image
      src={imageUrl}
      alt="Profile"
      width={size}
      height={size}
      className={className}
      unoptimized // Use with timestamp for cache busting
    />
  );
};

export default ProfileImage;
