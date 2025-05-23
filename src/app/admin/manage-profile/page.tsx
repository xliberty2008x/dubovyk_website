"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/app/providers/AuthProvider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';

const BUCKET_NAME = 'dubovyk-assets'; // Your public bucket name
const PROFILE_IMAGE_FOLDER = 'private'; // Use private folder for RLS policy

const ManageProfilePage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Fetch current image URL on load
  useEffect(() => {
    if (user) {
      fetchCurrentImage();
    }
  }, [user]);

  const fetchCurrentImage = async () => {
    if (!user) return;
    
    try {
      // Construct the path with user ID
      const filePath = `${PROFILE_IMAGE_FOLDER}/profile_image_${user.id}`;
      console.log("Fetching image from path:", filePath);
      
      // First, check if the file exists
      const { data: fileData, error: fileError } = await supabase.storage
        .from(BUCKET_NAME)
        .list(PROFILE_IMAGE_FOLDER, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' },
        });
        
      console.log("Files in folder:", fileData);
      
      if (fileError) {
        console.error("Error listing files:", fileError);
        setCurrentImageUrl(null);
        return;
      }
      
      // Construct the public URL adding a timestamp to bust cache
      const timestamp = new Date().getTime();
      const { data } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(`${filePath}`);
      
      console.log("Generated public URL:", data?.publicUrl);
      
      // Set the URL directly without checking accessibility
      if (data?.publicUrl) {
        // Add timestamp as query parameter to bust cache
        const urlWithTimestamp = `${data.publicUrl}?t=${timestamp}`;
        console.log("Setting image URL with timestamp:", urlWithTimestamp);
        setCurrentImageUrl(urlWithTimestamp);
      } else {
        console.log("No public URL generated");
        setCurrentImageUrl(null);
      }
    } catch (error) {
      console.error("Error in fetchCurrentImage:", error);
      setCurrentImageUrl(null);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file.');
        setSelectedFile(null);
        setPreviewUrl(null);
        return;
      }
      setSelectedFile(file);
      setError(null);
      setSuccessMessage(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleUpload = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedFile || !user) {
      setError('Please select a file to upload.');
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Get the current user's ID
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser || !currentUser.id) {
        throw new Error("User authentication error");
      }
      
      // Use the private folder and include user ID in the path
      const filePath = `${PROFILE_IMAGE_FOLDER}/profile_image_${currentUser.id}`;
      
      console.log("Uploading to path:", filePath);
      console.log("User ID:", currentUser.id);
      console.log("File type:", selectedFile.type);
      console.log("File size:", selectedFile.size);
      
      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: true, // Overwrite existing file
        });

      if (uploadError) {
        console.error("Upload error details:", uploadError);
        throw uploadError;
      }

      setSuccessMessage('Profile image updated successfully!');
      setSelectedFile(null);
      setPreviewUrl(null);
      
      // Add a small delay before fetching the image to ensure storage processing is complete
      setTimeout(() => {
        fetchCurrentImage(); // Refresh display
      }, 1000);

    } catch (err: any) {
      console.error("Error uploading profile image:", err);
      setError(err.message || "Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  // Loading state while checking auth
  if (authLoading || !user) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center pt-16">
          <div>Loading...</div>
        </main>
        <Footer />
      </>
    );
  }

  // *** Start of Corrected Return Statement Structure ***
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-10 px-4 md:px-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Manage Profile</h1>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-6">
            <h2 className="text-xl font-semibold mb-4">Profile Image</h2>

            {/* Display Current Image */}
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Current Image:</h3>
              {currentImageUrl ? (
                <>
                  <Image
                    src={currentImageUrl}
                    alt="Current profile image"
                    width={150}
                    height={150}
                    className="rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                    unoptimized // Helps with cache busting via timestamp
                  />
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Image URL: {currentImageUrl}
                  </p>
                </>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No profile image uploaded yet.</p>
              )}
            </div>

            <hr className="dark:border-gray-600"/>

            {/* Upload Form */}
            <form onSubmit={handleUpload} className="space-y-4">
               <h3 className="text-lg font-medium mb-2">Upload New Image:</h3>
               {/* Conditionally render preview only when previewUrl is available */}
               {previewUrl && (
                <div className="mb-4">
                  <p className="text-sm font-medium mb-1">Preview:</p>
                  <Image
                    src={previewUrl}
                    alt="Selected image preview"
                    width={150}
                    height={150}
                    className="rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                  />
                </div>
              )}
              <div>
                <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select Image File (JPG, PNG, GIF, WebP)
                </label>
                <input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                  className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400
                             file:mr-4 file:py-2 file:px-4
                             file:rounded-md file:border-0
                             file:text-sm file:font-semibold
                             file:bg-blue-50 file:text-blue-700
                             dark:file:bg-blue-900 dark:file:text-blue-300
                             hover:file:bg-blue-100 dark:hover:file:bg-blue-800"
                />
                 <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">This will replace the current profile image.</p>
              </div>

              {error && (
                <div className="text-red-600 dark:text-red-400 text-sm">Error: {error}</div>
              )}
              {successMessage && (
                <div className="text-green-600 dark:text-green-400 text-sm">{successMessage}</div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isUploading || !selectedFile}
                  className="w-full sm:w-auto flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isUploading ? 'Uploading...' : 'Upload Image'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
  // *** End of Corrected Return Statement Structure ***
}; // Closing brace for the component function

export default ManageProfilePage; // Export statement
