import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Create a Supabase client with the service role key for admin access
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Define paths that require API key authentication
const API_PATHS = [
  '/api/posts',
  '/api/experience',
  '/api/projects',
  '/api/skills',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the request is for an API endpoint that requires authentication
  const isApiPath = API_PATHS.some(path => pathname.startsWith(path));
  
  if (isApiPath) {
    // Get the Authorization header
    const authHeader = request.headers.get('Authorization');
    
    // If no Authorization header, return 401
    if (!authHeader) {
      return new NextResponse(
        JSON.stringify({ error: 'API key required. Please provide an API key in the Authorization header.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Extract the API key from the Authorization header
    // Expected format: "Bearer YOUR_API_KEY"
    const apiKeyMatch = authHeader.match(/^Bearer\s+(.+)$/i);
    if (!apiKeyMatch) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid Authorization header format. Use "Bearer YOUR_API_KEY"' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const apiKey = apiKeyMatch[1];
    
    try {
      // Check if the API key exists and is active
      const { data, error } = await supabase
        .from('api_keys')
        .select('id, user_id, scopes, is_active')
        .eq('key', apiKey)
        .eq('is_active', true)
        .single();
      
      if (error || !data) {
        return new NextResponse(
          JSON.stringify({ error: 'Invalid or inactive API key' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      // Check if the API key has the required scope for this endpoint
      // Extract resource and action from the pathname and method
      const resource = pathname.split('/')[2]; // e.g., 'posts', 'experience'
      const action = request.method === 'GET' ? 'read' : 'write';
      const requiredScope = `${resource}:${action}`;
      
      if (!data.scopes.includes(requiredScope)) {
        return new NextResponse(
          JSON.stringify({ error: `API key does not have the required scope: ${requiredScope}` }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      // Update last_used_at timestamp
      await supabase
        .from('api_keys')
        .update({ last_used_at: new Date().toISOString() })
        .eq('id', data.id);
      
      // Add user_id to the request headers for downstream handlers
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-api-user-id', data.user_id);
      
      // Continue with the request
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (err) {
      console.error('Error validating API key:', err);
      return new NextResponse(
        JSON.stringify({ error: 'Error validating API key' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
  
  // For non-API paths, continue with the request
  return NextResponse.next();
}

// Configure the middleware to run only for API paths
export const config = {
  matcher: [
    '/api/posts/:path*',
    '/api/experience/:path*',
    '/api/projects/:path*',
    '/api/skills/:path*',
  ],
};
