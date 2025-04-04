import { supabase } from './supabaseClient';

const BUCKET_NAME = 'dubovyk-assets';
const PROFILE_IMAGE_FOLDER = 'private';

/**
 * Gets the user ID to use for profile image
 * This will try to get the current user's ID first, then fall back to admin user ID
 */
export async function getUserIdForProfile(): Promise<string | null> {
  try {
    // First try to get the current user's ID (if logged in)
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user && user.id) {
      console.log('Using current user ID for profile image:', user.id);
      return user.id;
    }
    
    // If not logged in, try to get the admin user ID
    console.log('No current user, trying to find admin user');
    
    try {
      // Try to query for users with admin role
      const { data: adminUsers, error } = await supabase
        .from('profiles') // This table might not exist
        .select('id')
        .eq('role', 'admin')
        .limit(1);
      
      if (error) {
        console.error('Error fetching admin user:', error);
        // Continue to fallback methods
      } else if (adminUsers && adminUsers.length > 0) {
        return adminUsers[0].id;
      }
    } catch (error) {
      console.log('Profiles table might not exist, trying other methods');
      // Continue to fallback methods
    }
    
    // Hardcoded admin user ID as a last resort
    // In a real app, you might want to store this in an environment variable
    const ADMIN_USER_ID = '8b566c8b-bb03-460d-b945-d790f0961bba'; // Replace with your admin user ID
    console.log('Using hardcoded admin user ID:', ADMIN_USER_ID);
    return ADMIN_USER_ID;
  } catch (error) {
    console.error('Error in getUserIdForProfile:', error);
    return null;
  }
}

/**
 * Gets the public URL for the profile image
 */
export async function getProfileImageUrl(): Promise<string | null> {
  try {
    // Get the user ID to use for the profile image
    const userId = await getUserIdForProfile();
    
    if (!userId) {
      console.log('No user ID found, trying default path');
      // Fallback to the old path if no user ID found
      const { data } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl('profile_image');
      
      console.log('Profile image URL:', data?.publicUrl);
      return data?.publicUrl || null;
    }
    
    // Construct the path with user ID
    const filePath = `${PROFILE_IMAGE_FOLDER}/profile_image_${userId}`;
    console.log('Looking for profile image at:', filePath);
    
    // First check if the file exists
    try {
      const { data: fileExists, error: fileError } = await supabase.storage
        .from(BUCKET_NAME)
        .download(filePath);
      
      if (fileError || !fileExists) {
        console.log('File not found at path:', filePath);
        console.log('Falling back to default path');
        
        // Fallback to the old path
        const { data } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl('profile_image');
        
        console.log('Profile image URL (fallback):', data?.publicUrl);
        return data?.publicUrl || null;
      }
    } catch (error) {
      console.log('Error checking if file exists:', error);
      // Continue to get the URL anyway
    }
    
    // Get the public URL
    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);
    
    // Add timestamp to bust cache
    const url = data?.publicUrl ? `${data.publicUrl}?t=${new Date().getTime()}` : null;
    console.log('Profile image URL:', url);
    return url;
  } catch (error) {
    console.error('Error getting profile image URL:', error);
    return null;
  }
}
