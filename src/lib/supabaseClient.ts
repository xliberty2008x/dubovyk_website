import { createClient } from '@supabase/supabase-js';

// Ensure environment variables are loaded (especially important for client-side usage)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Basic validation
if (!supabaseUrl) {
  console.error("Error: Missing Supabase URL. Make sure NEXT_PUBLIC_SUPABASE_URL is set in your environment variables.");
}
if (!supabaseAnonKey) {
  console.error("Error: Missing Supabase Anon Key. Make sure NEXT_PUBLIC_SUPABASE_ANON_KEY is set in your environment variables.");
}

// Create and export the Supabase client
// Handle the case where variables might be missing during build/SSR initial load gracefully
// but rely on runtime checks or Next.js build process to ensure they exist when needed.
export const supabase = createClient(
  supabaseUrl || '', 
  supabaseAnonKey || ''
);

// Type definition for your posts table (adjust based on your actual schema)
export interface Post {
  id: string; // Typically UUID from Supabase
  created_at: string; // Timestamp
  title: string;
  content: string;
  slug?: string; // Optional slug for URL friendly routes
}

// Type for Experience table
export interface Experience {
  id: string;
  created_at: string;
  job_title: string;
  company: string;
  start_date?: string | null; // Use string for date inputs, null if not set
  end_date?: string | null;   // Nullable for current roles
  description?: string | null;
  location?: string | null;
  display_order?: number | null; // Matches 'display_order' column in SQL
}

// Type for Skills table
export interface Skill {
  id: string;
  created_at: string;
  name: string;
  category?: string | null;
  proficiency?: number | null; // Assuming 1-5 scale
  display_order?: number | null;
}

// Type for Projects table
export interface Project {
  id: string;
  created_at: string;
  name: string;
  description?: string | null;
  technologies?: string[] | null; // Array of strings
  url?: string | null;
  display_order?: number | null;
}

// Type for API Keys table
export interface ApiKey {
  id: string;
  created_at: string;
  user_id: string;
  name: string;
  // The actual key is sensitive and typically not fetched/displayed after creation
  key?: string; // The actual API key - only available during creation
  key_preview?: string; // e.g., "sk_...abcd"
  scopes: string[];
  expires_at?: string | null;
  last_used_at?: string | null;
  is_active: boolean;
}
