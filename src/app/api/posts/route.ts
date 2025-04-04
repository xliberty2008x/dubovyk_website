import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Create a Supabase client with the service role key for admin access
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET handler for fetching posts
export async function GET(request: NextRequest) {
  try {
    // Get the user ID from the request headers (set by middleware)
    const userId = request.headers.get('x-api-user-id');
    
    // Optional query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // Fetch posts from the database
    const { data, error, count } = await supabase
      .from('posts')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) {
      console.error('Error fetching posts:', error);
      return NextResponse.json(
        { error: 'Failed to fetch posts' },
        { status: 500 }
      );
    }
    
    // Return the posts with pagination metadata
    return NextResponse.json({
      data,
      pagination: {
        total: count,
        limit,
        offset,
        hasMore: count ? offset + limit < count : false,
      },
    });
  } catch (err) {
    console.error('Error in GET /api/posts:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST handler for creating a new post
export async function POST(request: NextRequest) {
  try {
    // Get the user ID from the request headers (set by middleware)
    const userId = request.headers.get('x-api-user-id');
    
    // Parse the request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }
    
    // Prepare the post data
    const postData = {
      title: body.title,
      content: body.content,
      user_id: userId,
      // Add any other fields from the request body
      slug: body.slug || generateSlug(body.title),
      published: body.published !== undefined ? body.published : true,
      featured_image: body.featured_image || null,
      excerpt: body.excerpt || null,
      tags: body.tags || [],
    };
    
    // Insert the post into the database
    const { data, error } = await supabase
      .from('posts')
      .insert([postData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating post:', error);
      return NextResponse.json(
        { error: 'Failed to create post' },
        { status: 500 }
      );
    }
    
    // Return the created post
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error('Error in POST /api/posts:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to generate a slug from a title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
    .trim();
}
