"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // Hook to get URL parameters
import { supabase, Post } from '@/lib/supabaseClient';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

const SinglePostPage: React.FC = () => {
  const params = useParams();
  const slugOrId = params.slug; // Can be slug or ID

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slugOrId) {
        setError("Post identifier missing.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // Try fetching by slug first, then by ID as fallback
        let query = supabase.from('posts').select('*');
        
        // Check if slugOrId looks like a UUID (basic check)
        const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(slugOrId as string);

        if (isUUID) {
           query = query.eq('id', slugOrId);
        } else {
           query = query.eq('slug', slugOrId);
        }

        const { data, error: fetchError } = await query.single(); // Fetch a single record

        if (fetchError) {
          if (fetchError.code === 'PGRST116') { // Code for "Multiple rows found" or "No rows found"
             setError("Post not found.");
          } else {
            throw fetchError;
          }
        } else {
          setPost(data);
        }

      } catch (err: any) {
        console.error("Error fetching single post:", err);
        setError(err.message || "Failed to load the post.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slugOrId]); // Re-fetch if slug/id changes

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-10 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          {loading && (
            <div className="text-center py-20">Loading post...</div>
          )}

          {error && (
            <div className="text-center py-20">
              <p className="text-red-600 dark:text-red-400 mb-4">Error: {error}</p>
              <Link href="/updates" className="text-blue-600 hover:underline">
                &larr; Back to Blog {/* Renamed */}
              </Link>
            </div>
          )}

          {!loading && !error && !post && (
             <div className="text-center py-20">
              <p className="text-gray-500 dark:text-gray-400 mb-4">Post not found.</p>
              <Link href="/updates" className="text-blue-600 hover:underline">
                &larr; Back to Blog {/* Renamed */}
              </Link>
            </div>
          )}

          {!loading && post && (
            <article className="py-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
              <p className="text-md text-gray-500 dark:text-gray-400 mb-8">
                Published on: {new Date(post.created_at).toLocaleDateString()}
              </p>
              {/* Render post content (potentially use a Markdown renderer if content is Markdown) */}
              <div 
                className="prose dark:prose-invert max-w-none"
                // If content is plain text, render directly. If Markdown, use a library like react-markdown
              >
                {/* Basic rendering assuming plain text or simple HTML */}
                <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p> 
              </div>
               <div className="mt-12">
                 <Link href="/updates" className="text-blue-600 hover:underline">
                   &larr; Back to Blog {/* Renamed */}
                 </Link>
               </div>
            </article>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default SinglePostPage;
