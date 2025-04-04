"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, ApiKey } from '@/lib/supabaseClient';
import { useAuth } from '@/app/providers/AuthProvider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CopyToClipboard } from 'react-copy-to-clipboard';

// Helper function to generate a secure random API key string
function generateApiKey(length = 32): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'sk_'; // Prefix to indicate it's a secret key
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// Type definition for API Key fetched from DB (excluding the full key)
interface ApiKeyDisplay extends Omit<ApiKey, 'key'> {
  key_preview: string; // e.g., "sk_...abcd"
}

// Ensure the component type allows returning null or JSX Element
const ManageApiKeysPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [keyName, setKeyName] = useState('');
  const [apiKeys, setApiKeys] = useState<ApiKeyDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [newlyGeneratedKey, setNewlyGeneratedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Fetch API keys
  const fetchApiKeys = async () => {
    if (!user) return;
    setFetchError(null);
    try {
      // Fetch keys, but select only necessary fields, creating a preview
      const { data, error } = await supabase
        .from('api_keys')
        .select('id, created_at, user_id, name, scopes, expires_at, last_used_at, is_active, key') // Fetch key temporarily to create preview
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Create a preview of the key (e.g., sk_...last4)
      const keysWithPreview = data?.map(key => ({
          ...key,
          key: undefined, // Remove the full key immediately after creating preview
          key_preview: `${key.key.substring(0, 5)}...${key.key.substring(key.key.length - 4)}`
      })) || [];

      setApiKeys(keysWithPreview);
    } catch (err: any) {
      console.error("Error fetching API keys:", err);
      setFetchError(err.message || "Could not fetch API keys.");
      setApiKeys([]);
    }
  };

  // Fetch keys on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchApiKeys();
    }
  }, [user]);

  // Handle generating a new API key
  const handleGenerateKey = async (event: FormEvent) => {
    event.preventDefault();
    if (!user || !keyName.trim()) {
      setError("Key name cannot be empty.");
      return;
    }
    setError(null);
    setIsLoading(true);
    setNewlyGeneratedKey(null); // Clear previous key
    setCopied(false); // Reset copied status

    const newKey = generateApiKey();

    try {
      const { error: insertError } = await supabase
        .from('api_keys')
        .insert([{
          user_id: user.id,
          name: keyName.trim(),
          key: newKey, // Store the full key
          scopes: ['posts:read', 'posts:write', 'experience:read', 'experience:write', 'projects:read', 'projects:write', 'skills:read', 'skills:write'], // Default scopes, adjust as needed
          is_active: true,
        }]);

      if (insertError) {
        // Handle potential unique constraint violation for 'key' (though unlikely)
        if (insertError.code === '23505') { // Postgres unique violation code
           setError("Failed to generate a unique key. Please try again.");
        } else {
          throw insertError;
        }
      } else {
        setKeyName(''); // Clear form
        setNewlyGeneratedKey(newKey); // Display the key ONCE
        await fetchApiKeys(); // Refresh the list
        alert('API Key generated successfully! Copy it now, you won\'t see it again.');
        window.scrollTo(0, 0); // Scroll up to show the new key notice
      }
    } catch (err: any) {
      console.error("Error generating API key:", err);
      setError(err.message || "An error occurred while generating the key.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle revoking (deleting) an API key
  const handleRevokeKey = async (id: string) => {
    if (!window.confirm("Are you sure you want to revoke this API key? This action cannot be undone.")) {
      return;
    }
    if (!user) {
      setError("You must be logged in.");
      return;
    }
    setError(null);
    // Add specific loading state if needed

    try {
      const { error: deleteError } = await supabase
        .from('api_keys')
        .delete()
        .match({ id: id, user_id: user.id }); // Ensure user owns the key

      if (deleteError) throw deleteError;

      await fetchApiKeys(); // Refresh list
      alert('API Key revoked successfully!');
    } catch (err: any) {
      console.error("Error revoking API key:", err);
      setError(err.message || "An error occurred while revoking the key.");
    } finally {
      // Reset loading state
    }
  };

  // Handle copying the key
  const onCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Hide message after 2 seconds
  };

  // Code Snippets
  const getCodeSnippets = (apiKey: string) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://example.com'; // Get base URL dynamically
    return {
      curl_get_posts: `curl -X GET "${baseUrl}/api/posts" \\
     -H "Authorization: Bearer ${apiKey}"`,
      
      curl_post_posts: `curl -X POST "${baseUrl}/api/posts" \\
     -H "Authorization: Bearer ${apiKey}" \\
     -H "Content-Type: application/json" \\
     -d '{
       "title": "New Post Title",
       "content": "This is the content of the new post."
     }'`,
      
      python_get_posts: `import requests

api_key = "${apiKey}"
base_url = "${baseUrl}"
headers = {
    "Authorization": f"Bearer {api_key}"
}

response = requests.get(f"{base_url}/api/posts", headers=headers)

if response.status_code == 200:
    print("Successfully fetched posts:")
    print(response.json())
else:
    print(f"Error fetching posts: {response.status_code}")
    print(response.text)`,
      
      python_post_posts: `import requests
import json

api_key = "${apiKey}"
base_url = "${baseUrl}"
headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}
data = {
    "title": "New Post via Python",
    "content": "Content created using the Python script."
}

response = requests.post(f"{base_url}/api/posts", headers=headers, data=json.dumps(data))

if response.status_code == 200 or response.status_code == 201: # Handle 201 Created
    print("Successfully created post:")
    print(response.json())
else:
    print(f"Error creating post: {response.status_code}")
    print(response.text)`,
      
      js_fetch_posts: `const apiKey = "${apiKey}";
const baseUrl = "${baseUrl}";

fetch(\`\${baseUrl}/api/posts\`, {
  method: 'GET',
  headers: {
    'Authorization': \`Bearer \${apiKey}\`
  }
})
.then(response => {
  if (!response.ok) {
    throw new Error(\`HTTP error! Status: \${response.status}\`);
  }
  return response.json();
})
.then(data => {
  console.log("Successfully fetched posts:", data);
})
.catch(error => {
  console.error("Error fetching posts:", error);
});`,
      
      js_post_posts: `const apiKey = "${apiKey}";
const baseUrl = "${baseUrl}";
const postData = {
  title: "New Post via JS Fetch",
  content: "Content created using the JS Fetch API."
};

fetch(\`\${baseUrl}/api/posts\`, {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${apiKey}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(postData)
})
.then(response => {
  if (!response.ok) {
    // Handle non-2xx responses
     return response.text().then(text => { throw new Error(\`HTTP error! Status: \${response.status}, Body: \${text}\`) });
  }
  return response.json();
})
.then(data => {
  console.log("Successfully created post:", data);
})
.catch(error => {
  console.error("Error creating post:", error);
});`
    };
  };

  // Generate snippets with a placeholder - This doesn't need to be state
  const snippets = getCodeSnippets('YOUR_API_KEY');

  // Helper function to replace placeholders in snippet strings
  const replacePlaceholders = (template: string, resource: string): string => {
    const resourceSingular = resource.slice(0, -1); // Simple singularization
    const resourceTitle = resourceSingular.charAt(0).toUpperCase() + resourceSingular.slice(1);

    // Use RegExp with global flag (g) for all occurrences and escape special chars in keys
    let result = template.replace(/\/api\/posts/g, `/api/${resource}`);
    result = result.replace(/New Post Title/g, `New ${resourceTitle} Title`);
    result = result.replace(/This is the content of the new post./g, `Content for the new ${resourceSingular}.`);
    // Make specific content descriptions unique to avoid incorrect replacements
    result = result.replace(/New Post via Python/g, `New ${resourceTitle} via Python`);
    result = result.replace(/Content created using the Python script./g, `Content for the new ${resourceSingular} via Python.`);
    result = result.replace(/New Post via JS Fetch/g, `New ${resourceTitle} via JS`);
    result = result.replace(/Content created using the JS Fetch API./g, `Content for the new ${resourceSingular} via JS.`);

    return result;
  };

  // Conditional rendering for loading/auth check
  if (authLoading) {
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

  if (!user) {
    // This part might be brief as redirection should happen quickly
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center pt-16">
          <div>Redirecting to login...</div>
        </main>
        <Footer />
      </>
    );
  }

  // Main component render when user is authenticated
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-10 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Manage API Keys</h1>

          {/* Display Newly Generated Key */}
          {newlyGeneratedKey && (
            <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 rounded-md">
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">New API Key Generated!</h3>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                Please copy your new API key. You won't be able to see it again!
              </p>
              <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded font-mono text-sm text-gray-800 dark:text-gray-200 flex items-center justify-between">
                <span>{newlyGeneratedKey}</span>
                <CopyToClipboard text={newlyGeneratedKey} onCopy={onCopy}>
                  <button className="ml-4 px-2 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded">
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </CopyToClipboard>
              </div>
            </div>
          )}

          {/* Generate New Key Form */}
          <form onSubmit={handleGenerateKey} className="mb-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-4">
            <h2 className="text-xl font-semibold mb-4">Generate New API Key</h2>
            <div>
              <label htmlFor="keyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Key Name</label>
              <input
                id="keyName"
                type="text"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                required
                // Corrected dark mode text color
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300"
                placeholder="e.g., My Script Key"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Give your key a descriptive name.</p>
            </div>

            {error && (
              <div className="text-red-600 dark:text-red-400 text-sm">
                Error: {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Generating...' : 'Generate Key'}
            </button>
          </form>

          {/* Display Existing Keys */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Existing API Keys</h2>
            {fetchError && <p className="text-red-600 dark:text-red-400">Error fetching keys: {fetchError}</p>}
            {apiKeys.length === 0 && !fetchError && (
              <p className="text-gray-500 dark:text-gray-400">No API keys generated yet.</p>
            )}
            <div className="space-y-4">
              {apiKeys.map((key) => (
                <div key={key.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between sm:items-center">
                  <div>
                    <h3 className="text-lg font-medium mb-1">{key.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Key Preview: <span className="font-mono">{key.key_preview}</span>
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Created: {new Date(key.created_at).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Scopes: {key.scopes?.join(', ') || 'None'}
                    </p>
                     {/* Add Last Used and Expires At if needed */}
                  </div>
                  <div className="flex space-x-2 mt-3 sm:mt-0 flex-shrink-0">
                     {/* Add Edit functionality later if needed */}
                    <button
                      onClick={() => handleRevokeKey(key.id)}
                      className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 px-3 py-1 border border-red-300 dark:border-red-500 rounded hover:bg-red-50 dark:hover:bg-red-900"
                    >
                      Revoke
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Code Snippets Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">API Usage Examples</h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Use the generated API key in the <code className="font-mono bg-gray-200 dark:bg-gray-700 px-1 rounded">Authorization</code> header as a Bearer token to authenticate your requests. Replace <code className="font-mono bg-gray-200 dark:bg-gray-700 px-1 rounded">YOUR_API_KEY</code> with your actual key.
            </p>

            {/* Define resources for all available API endpoints */}
            {(['posts', 'experience', 'projects', 'skills'] as const).map(resource => (
                <div key={resource} className="mb-8">
                    <h3 className="text-xl font-semibold mb-3 capitalize">{resource} API</h3>

                    {/* cURL */}
                    <div className="mb-4">
                        <h4 className="text-lg font-medium mb-2">cURL</h4>
                        <p className="text-sm mb-1">Get all {resource}:</p>
                        <pre className="p-3 bg-gray-100 dark:bg-gray-900 rounded text-sm overflow-x-auto text-gray-800 dark:text-gray-200"><code>{replacePlaceholders(snippets.curl_get_posts, resource)}</code></pre>
                        <p className="text-sm mt-2 mb-1">Create a new {resource.slice(0, -1)}:</p>
                        <pre className="p-3 bg-gray-100 dark:bg-gray-900 rounded text-sm overflow-x-auto text-gray-800 dark:text-gray-200"><code>{replacePlaceholders(snippets.curl_post_posts, resource)}</code></pre>
                    </div>

                    {/* Python */}
                    <div className="mb-4">
                        <h4 className="text-lg font-medium mb-2">Python (requests)</h4>
                        <p className="text-sm mb-1">Get all {resource}:</p>
                        <pre className="p-3 bg-gray-100 dark:bg-gray-900 rounded text-sm overflow-x-auto text-gray-800 dark:text-gray-200"><code>{replacePlaceholders(snippets.python_get_posts, resource)}</code></pre>
                        <p className="text-sm mt-2 mb-1">Create a new {resource.slice(0, -1)}:</p>
                        <pre className="p-3 bg-gray-100 dark:bg-gray-900 rounded text-sm overflow-x-auto text-gray-800 dark:text-gray-200"><code>{replacePlaceholders(snippets.python_post_posts, resource)}</code></pre>
                    </div>

                    {/* JavaScript */}
                    <div className="mb-4">
                        <h4 className="text-lg font-medium mb-2">JavaScript (fetch)</h4>
                        <p className="text-sm mb-1">Get all {resource}:</p>
                        <pre className="p-3 bg-gray-100 dark:bg-gray-900 rounded text-sm overflow-x-auto text-gray-800 dark:text-gray-200"><code>{replacePlaceholders(snippets.js_fetch_posts, resource)}</code></pre>
                        <p className="text-sm mt-2 mb-1">Create a new {resource.slice(0, -1)}:</p>
                        <pre className="p-3 bg-gray-100 dark:bg-gray-900 rounded text-sm overflow-x-auto text-gray-800 dark:text-gray-200"><code>{replacePlaceholders(snippets.js_post_posts, resource)}</code></pre>
                    </div>
                </div>
            ))}
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Note: The POST request bodies shown are examples. Refer to the specific API endpoint documentation (once created) for required and optional fields for each resource type (experience, skills, projects).
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ManageApiKeysPage;
