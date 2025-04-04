import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Create a Supabase client with the service role key for admin access
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET handler for fetching skills
export async function GET(request: NextRequest) {
  try {
    // Get the user ID from the request headers (set by middleware)
    const userId = request.headers.get('x-api-user-id');
    
    // Optional query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');
    const category = searchParams.get('category');
    
    // Build the query
    let query = supabase
      .from('skills')
      .select('*', { count: 'exact' })
      .order('display_order', { ascending: true });
    
    // Add category filter if provided
    if (category) {
      query = query.eq('category', category);
    }
    
    // Add pagination
    query = query.range(offset, offset + limit - 1);
    
    // Execute the query
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Error fetching skills:', error);
      return NextResponse.json(
        { error: 'Failed to fetch skills' },
        { status: 500 }
      );
    }
    
    // Return the skills with pagination metadata
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
    console.error('Error in GET /api/skills:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST handler for creating a new skill
export async function POST(request: NextRequest) {
  try {
    // Get the user ID from the request headers (set by middleware)
    const userId = request.headers.get('x-api-user-id');
    
    // Parse the request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: 'Skill name is required' },
        { status: 400 }
      );
    }
    
    // Prepare the skill data
    const skillData = {
      name: body.name,
      user_id: userId,
      // Add any other fields from the request body
      category: body.category || null,
      proficiency: body.proficiency || null,
      display_order: body.display_order || null,
    };
    
    // Insert the skill into the database
    const { data, error } = await supabase
      .from('skills')
      .insert([skillData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating skill:', error);
      return NextResponse.json(
        { error: 'Failed to create skill' },
        { status: 500 }
      );
    }
    
    // Return the created skill
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error('Error in POST /api/skills:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
