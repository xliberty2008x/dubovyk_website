"use client"; // Still need client-side fetching for now

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase, Post } from '@/lib/supabaseClient'; // Import supabase and Post type
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const UpdatesPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all posts, ordered by creation date
        const { data, error: fetchError } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (fetchError) {
          throw fetchError;
        }
        setPosts(data || []);
      } catch (err: any) {
        console.error("Error fetching posts:", err);
        setError(err.message || "Failed to load posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-10 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Blog</h1> {/* Renamed from Updates & Posts */}

          {loading && (
            <div className="text-center py-10">Loading posts...</div>
          )}

          {error && (
            <div className="text-center py-10 text-red-600 dark:text-red-400">
              Error loading posts: {error}
            </div>
          )}

          {!loading && !error && posts.length === 0 && (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              No posts available yet. Check back later!
            </div>
          )}

          {!loading && !error && posts.length > 0 && (
            <div className="space-y-8">
              {posts.map((post) => (
                <article key={post.id} className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                  <h2 className="text-2xl font-semibold mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {/* Link to the single post page (using slug if available, otherwise id) */}
                    <Link href={`/updates/${post.slug || post.id}`}>
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Published on: {new Date(post.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 line-clamp-3 mb-4"> {/* Preview content */}
                    {post.content} 
                  </p>
                  <Link 
                    href={`/updates/${post.slug || post.id}`} 
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    Read more &rarr;
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default UpdatesPage;
