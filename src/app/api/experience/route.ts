import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Create a Supabase client with the service role key for admin access
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET handler for fetching experience entries
export async function GET(request: NextRequest) {
  try {
    // Get the user ID from the request headers (set by middleware)
    const userId = request.headers.get('x-api-user-id');
    
    // Optional query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // Fetch experience entries from the database
    const { data, error, count } = await supabase
      .from('experience')
      .select('*', { count: 'exact' })
      .order('display_order', { ascending: true })
      .range(offset, offset + limit - 1);
    
    if (error) {
      console.error('Error fetching experience:', error);
      return NextResponse.json(
        { error: 'Failed to fetch experience entries' },
        { status: 500 }
      );
    }
    
    // Return the experience entries with pagination metadata
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
    console.error('Error in GET /api/experience:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST handler for creating a new experience entry
export async function POST(request: NextRequest) {
  try {
    // Get the user ID from the request headers (set by middleware)
    const userId = request.headers.get('x-api-user-id');
    
    // Parse the request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.job_title || !body.company) {
      return NextResponse.json(
        { error: 'Job title and company are required' },
        { status: 400 }
      );
    }
    
    // Prepare the experience data
    const experienceData = {
      job_title: body.job_title,
      company: body.company,
      user_id: userId,
      // Add any other fields from the request body
      start_date: body.start_date || null,
      end_date: body.end_date || null,
      description: body.description || null,
      location: body.location || null,
      display_order: body.display_order || null,
    };
    
    // Insert the experience entry into the database
    const { data, error } = await supabase
      .from('experience')
      .insert([experienceData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating experience entry:', error);
      return NextResponse.json(
        { error: 'Failed to create experience entry' },
        { status: 500 }
      );
    }
    
    // Return the created experience entry
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error('Error in POST /api/experience:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
