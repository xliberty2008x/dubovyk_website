"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/app/providers/AuthProvider';
import Navbar from '@/components/layout/Navbar'; // Re-use layout components
import Footer from '@/components/layout/Footer';

// Basic Post type matching the one in supabaseClient.ts (or define centrally)
interface Post {
  id: string;
  created_at: string;
  title: string;
  content: string;
  slug?: string;
}

const ManagePostsPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [slug, setSlug] = useState(''); // Optional slug
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false); // General loading for add/edit
  const [error, setError] = useState<string | null>(null); // Form submission error
  const [fetchError, setFetchError] = useState<string | null>(null); // Error fetching posts

  // State for editing
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);


  // Redirect if not logged in (basic client-side protection)
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login'); // Redirect to login if not authenticated
    }
  }, [user, authLoading, router]);

  // Function to fetch posts
  const fetchPosts = async () => {
    if (!user) return; // Only fetch if user is logged in

    setFetchError(null);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false }); // Show newest first

      if (error) throw error;

      setPosts(data || []); // Set posts data
    } catch (err: any) {
      console.error("Error fetching posts:", err);
      setFetchError(err.message || "Could not fetch posts.");
      setPosts([]); // Clear posts on error
    }
  };

  // Fetch posts when component mounts and user is authenticated
  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]); // Re-fetch if user changes (e.g., login/logout)

  // Renaming handleAddPost to handleFormSubmit to cover both add and edit
  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!user) {
      // This check might be redundant if page redirects, but good for safety
      setError("You must be logged in to manage posts.");
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const postData = {
        title,
        content,
        ...(slug && { slug }),
      };

      let operationError = null;

      if (isEditing && editingPost) {
        // Update existing post
        const { error: updateError } = await supabase
          .from('posts')
          .update(postData)
          .match({ id: editingPost.id });
        operationError = updateError;
      } else {
        // Insert new post
        const { error: insertError } = await supabase
          .from('posts')
          .insert([postData]);
         operationError = insertError;
      }

      if (operationError) {
        throw operationError;
      }

      // Clear form and potentially refetch posts
      // Clear form, reset editing state, and refetch
      setTitle('');
      setContent('');
      setSlug('');
      setIsEditing(false);
      setEditingPost(null);
      await fetchPosts();
      alert(isEditing ? 'Post updated successfully!' : 'Post added successfully!');

    } catch (err: any) {
      console.error(isEditing ? "Error updating post:" : "Error adding post:", err);
      setError(err.message || `An error occurred while ${isEditing ? 'updating' : 'adding'} the post.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle deleting a post
  const handleDeletePost = async (id: string) => {
    // Simple confirmation dialog
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    if (!user) {
      setError("You must be logged in to delete posts.");
      return;
    }
    setError(null);
    // Consider adding specific loading state for delete if needed

    try {
      const { error: deleteError } = await supabase
        .from('posts')
        .delete()
        .match({ id: id }); // Delete the post with the matching ID

      if (deleteError) {
        throw deleteError;
      }

      await fetchPosts(); // Refetch posts after deleting one
      alert('Post deleted successfully!');

    } catch (err: any) {
      console.error("Error deleting post:", err);
      setError(err.message || "An error occurred while deleting the post.");
    } finally {
      // Reset specific delete loading state if added
    }
  };

  // Function to populate form for editing
  const handleEditClick = (post: Post) => {
    setIsEditing(true);
    setEditingPost(post);
    setTitle(post.title);
    setContent(post.content);
    setSlug(post.slug || ''); // Set slug if it exists
    window.scrollTo(0, 0); // Scroll to top to see the form
  };

  // Function to cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingPost(null);
    setTitle('');
    setContent('');
    setSlug('');
    setError(null); // Clear any previous form errors
  };

  // Don't render anything until auth status is confirmed
  if (authLoading || !user) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center pt-16">
          <div>Loading authentication status...</div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-10 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Renamed Heading */}
          <h1 className="text-3xl font-bold mb-6">Manage Blog Posts</h1>

          {/* Add/Edit Post Form */}
          <form onSubmit={handleFormSubmit} className="mb-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-4">
             <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Post' : 'Add New Post'}</h2>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                // Added explicit light/dark text colors and backgrounds
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Slug (Optional, for URL)</label>
              <input
                id="slug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                 // Added explicit light/dark text colors and backgrounds
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="e.g., my-first-post"
              />
               <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">If left empty, one might be generated automatically or not used.</p>
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Content</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={6}
                 // Added explicit light/dark text colors and backgrounds
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>

            {error && (
              <div className="text-red-600 dark:text-red-400 text-sm">
                Error: {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:space-x-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Post' : 'Add Post')}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={isLoading}
                  className="mt-3 sm:mt-0 w-full sm:w-auto flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>

          {/* Display Existing Posts */}
          <div className="mt-10">
            {/* Renamed Heading */}
            <h2 className="text-xl font-semibold mb-4">Existing Blog Posts</h2>
            {fetchError && <p className="text-red-600 dark:text-red-400">Error fetching posts: {fetchError}</p>}
            {posts.length === 0 && !fetchError && (
              // Renamed Text
              <p className="text-gray-500 dark:text-gray-400">No blog posts created yet.</p>
            )}
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium mb-1">{post.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Created: {new Date(post.created_at).toLocaleString()}
                      {post.slug && ` | Slug: /${post.slug}`}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2"> {/* Show preview */}
                      {post.content}
                    </p>
                  </div>
                  <div className="flex space-x-2 flex-shrink-0 ml-4">
                    <button
                      onClick={() => handleEditClick(post)}
                      className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Edit
                    </button>
                    {/* Corrected Delete Button */}
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      // disabled={isLoading} // Could add specific loading state for delete if needed
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ManagePostsPage;
