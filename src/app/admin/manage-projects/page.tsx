"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, Project } from '@/lib/supabaseClient'; // Import Project type
import { useAuth } from '@/app/providers/AuthProvider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const ManageProjectsPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [technologies, setTechnologies] = useState(''); // Store as comma-separated string for input
  const [url, setUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number | ''>('');

  // List state
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null); 
  const [fetchError, setFetchError] = useState<string | null>(null); 
  
  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Fetch projects entries
  const fetchProjects = async () => {
    if (!user) return;
    setFetchError(null);
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjectsList(data || []);
    } catch (err: any) {
      console.error("Error fetching projects:", err);
      setFetchError(err.message || "Could not fetch projects.");
      setProjectsList([]);
    } finally {
       setIsLoading(false);
    }
  };

  // Fetch on mount if user is logged in
  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  // Handle form submission (Add or Update)
  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!user) { setError("You must be logged in."); return; }
    setError(null);
    setIsLoading(true);

    // Convert comma-separated string to array, trimming whitespace
    const techArray = technologies.split(',').map(tech => tech.trim()).filter(tech => tech !== '');

    try {
      const projectData = {
        name: name,
        description: description || null,
        technologies: techArray.length > 0 ? techArray : null,
        url: url || null,
        display_order: displayOrder === '' ? null : Number(displayOrder),
      };

      let operationError = null;

      if (isEditing && editingId) {
        const { error: updateError } = await supabase
          .from('projects')
          .update(projectData)
          .match({ id: editingId });
        operationError = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('projects')
          .insert([projectData]);
         operationError = insertError;
      }

      if (operationError) throw operationError;

      resetForm();
      await fetchProjects(); 
      alert(isEditing ? 'Project updated!' : 'Project added!');

    } catch (err: any) {
      console.error(isEditing ? "Error updating project:" : "Error adding project:", err);
      setError(err.message || `Failed to ${isEditing ? 'update' : 'add'} project.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle deleting an entry
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    if (!user) { setError("Not logged in."); return; }
    
    setError(null);
    setIsLoading(true); 

    try {
      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .match({ id: id });

      if (deleteError) throw deleteError;

      await fetchProjects(); 
      alert('Project deleted!');

    } catch (err: any) {
      console.error("Error deleting project:", err);
      setError(err.message || "Failed to delete project.");
    } finally {
      setIsLoading(false);
    }
  };

  // Populate form for editing
  const handleEditClick = (project: Project) => {
    setIsEditing(true);
    setEditingId(project.id);
    setName(project.name);
    setDescription(project.description || '');
    setTechnologies(project.technologies ? project.technologies.join(', ') : ''); // Convert array back to string
    setUrl(project.url || '');
    setDisplayOrder(project.display_order === null || project.display_order === undefined ? '' : project.display_order);
    setError(null);
    window.scrollTo(0, 0); 
  };
  
  // Reset form fields and editing state
  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setName('');
    setDescription('');
    setTechnologies('');
    setUrl('');
    setDisplayOrder('');
    setError(null);
  };

  // Render loading state until auth is checked
  if (authLoading || !user) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center pt-16">
          <div>Loading...</div>
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
          <h1 className="text-3xl font-bold mb-6">Manage Projects</h1>

          {/* Add/Edit Form */}
          <form onSubmit={handleFormSubmit} className="mb-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-4">
             <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Project' : 'Add New Project'}</h2>
            
             {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Project Name</label>
              <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description (Optional)</label>
              <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" />
            </div>

            {/* Technologies */}
             <div>
              <label htmlFor="technologies" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Technologies (Optional, comma-separated)</label>
              <input id="technologies" type="text" value={technologies} onChange={(e) => setTechnologies(e.target.value)} 
                placeholder="e.g., React, Node.js, PostgreSQL"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" />
            </div>
            
             {/* URL */}
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Project URL (Optional)</label>
              <input id="url" type="url" value={url} onChange={(e) => setUrl(e.target.value)} 
                placeholder="https://example.com"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" />
            </div>

             {/* Display Order */}
             <div>
              <label htmlFor="displayOrder" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Display Order (Optional, e.g., 1, 2, 3)</label>
              <input id="displayOrder" type="number" value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value === '' ? '' : Number(e.target.value))} min="0" 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" />
            </div>

            {/* Error Display */}
            {error && (
              <div className="text-red-600 dark:text-red-400 text-sm">Error: {error}</div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:space-x-4">
              <button type="submit" disabled={isLoading}
                className="w-full sm:w-auto flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
                {isLoading ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Project' : 'Add Project')}
              </button>
              {isEditing && (
                <button type="button" onClick={resetForm} disabled={isLoading}
                  className="mt-3 sm:mt-0 w-full sm:w-auto flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                  Cancel Edit
                </button>
              )}
            </div>
          </form>

          {/* Display Existing Projects */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Existing Projects</h2>
            {fetchError && <p className="text-red-600 dark:text-red-400">Error fetching: {fetchError}</p>}
            {isLoading && !projectsList.length && <p>Loading projects...</p>} 
            {!isLoading && projectsList.length === 0 && !fetchError && (
              <p className="text-gray-500 dark:text-gray-400">No projects added yet.</p>
            )}
            <div className="space-y-4">
              {projectsList.map((project) => (
                <div key={project.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">{project.name}</h3>
                    {project.url && <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline dark:text-blue-400">{project.url}</a>}
                    {project.technologies && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Tech: {project.technologies.join(', ')}</p>}
                    {project.description && <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 line-clamp-2">{project.description}</p>}
                    {project.display_order !== null && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Order: {project.display_order}</p>}
                  </div>
                  <div className="flex space-x-2 flex-shrink-0 ml-4">
                    <button onClick={() => handleEditClick(project)} disabled={isLoading}
                      className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(project.id)} disabled={isLoading}
                      className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50">
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

export default ManageProjectsPage;
