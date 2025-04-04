import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Create a Supabase client with the service role key for admin access
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET handler for fetching projects
export async function GET(request: NextRequest) {
  try {
    // Get the user ID from the request headers (set by middleware)
    const userId = request.headers.get('x-api-user-id');
    
    // Optional query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // Fetch projects from the database
    const { data, error, count } = await supabase
      .from('projects')
      .select('*', { count: 'exact' })
      .order('display_order', { ascending: true })
      .range(offset, offset + limit - 1);
    
    if (error) {
      console.error('Error fetching projects:', error);
      return NextResponse.json(
        { error: 'Failed to fetch projects' },
        { status: 500 }
      );
    }
    
    // Return the projects with pagination metadata
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
    console.error('Error in GET /api/projects:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST handler for creating a new project
export async function POST(request: NextRequest) {
  try {
    // Get the user ID from the request headers (set by middleware)
    const userId = request.headers.get('x-api-user-id');
    
    // Parse the request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      );
    }
    
    // Prepare the project data
    const projectData = {
      name: body.name,
      user_id: userId,
      // Add any other fields from the request body
      description: body.description || null,
      technologies: body.technologies || [],
      url: body.url || null,
      display_order: body.display_order || null,
    };
    
    // Insert the project into the database
    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating project:', error);
      return NextResponse.json(
        { error: 'Failed to create project' },
        { status: 500 }
      );
    }
    
    // Return the created project
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error('Error in POST /api/projects:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
