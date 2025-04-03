"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, Experience } from '@/lib/supabaseClient'; // Import Experience type
import { useAuth } from '@/app/providers/AuthProvider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const ManageExperiencePage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  // Form state
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [startDate, setStartDate] = useState(''); // Store dates as strings for input fields
  const [endDate, setEndDate] = useState('');     // Store dates as strings
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number | ''>(''); // Use '' for empty input

  // List state
  const [experienceList, setExperienceList] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(false); // General loading for add/edit/delete
  const [error, setError] = useState<string | null>(null); // Form submission error
  const [fetchError, setFetchError] = useState<string | null>(null); // Error fetching list
  
  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Fetch experience entries
  const fetchExperience = async () => {
    if (!user) return;
    setFetchError(null);
    setIsLoading(true); // Use general loading for fetch too
    try {
      const { data, error } = await supabase
        .from('experience')
        .select('*')
        .order('display_order', { ascending: true, nullsFirst: false }) // Order by display_order, then maybe created_at
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExperienceList(data || []);
    } catch (err: any) {
      console.error("Error fetching experience:", err);
      setFetchError(err.message || "Could not fetch experience entries.");
      setExperienceList([]);
    } finally {
       setIsLoading(false);
    }
  };

  // Fetch on mount if user is logged in
  useEffect(() => {
    if (user) {
      fetchExperience();
    }
  }, [user]);

  // Handle form submission (Add or Update)
  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!user) {
      setError("You must be logged in.");
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const experienceData = {
        job_title: jobTitle,
        company: company,
        start_date: startDate || null, // Use null if empty string
        end_date: endDate || null,     // Use null if empty string
        description: description || null,
        location: location || null,
        display_order: displayOrder === '' ? null : Number(displayOrder), // Handle empty string for number
      };

      let operationError = null;

      if (isEditing && editingId) {
        const { error: updateError } = await supabase
          .from('experience')
          .update(experienceData)
          .match({ id: editingId });
        operationError = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('experience')
          .insert([experienceData]);
         operationError = insertError;
      }

      if (operationError) throw operationError;

      resetForm();
      await fetchExperience(); 
      alert(isEditing ? 'Experience updated!' : 'Experience added!');

    } catch (err: any) {
      console.error(isEditing ? "Error updating experience:" : "Error adding experience:", err);
      setError(err.message || `Failed to ${isEditing ? 'update' : 'add'} experience.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle deleting an entry
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this experience entry?")) return;
    if (!user) { setError("Not logged in."); return; }
    
    setError(null);
    setIsLoading(true); // Indicate loading during delete

    try {
      const { error: deleteError } = await supabase
        .from('experience')
        .delete()
        .match({ id: id });

      if (deleteError) throw deleteError;

      await fetchExperience(); 
      alert('Experience deleted!');

    } catch (err: any) {
      console.error("Error deleting experience:", err);
      setError(err.message || "Failed to delete experience.");
    } finally {
      setIsLoading(false);
    }
  };

  // Populate form for editing
  const handleEditClick = (exp: Experience) => {
    setIsEditing(true);
    setEditingId(exp.id);
    setJobTitle(exp.job_title);
    setCompany(exp.company);
    setStartDate(exp.start_date || ''); // Handle null dates
    setEndDate(exp.end_date || '');     // Handle null dates
    setDescription(exp.description || '');
    setLocation(exp.location || '');
    setDisplayOrder(exp.display_order === null || exp.display_order === undefined ? '' : exp.display_order); // Handle null/undefined display_order
    setError(null);
    window.scrollTo(0, 0); 
  };
  
  // Reset form fields and editing state
  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setJobTitle('');
    setCompany('');
    setStartDate('');
    setEndDate('');
    setDescription('');
    setLocation('');
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
          <h1 className="text-3xl font-bold mb-6">Manage Experience</h1>

          {/* Add/Edit Form */}
          <form onSubmit={handleFormSubmit} className="mb-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-4">
             <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Experience' : 'Add New Experience'}</h2>
            
             {/* Job Title */}
            <div>
              <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Job Title</label>
              <input id="jobTitle" type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} required 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" />
            </div>

            {/* Company */}
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company</label>
              <input id="company" type="text" value={company} onChange={(e) => setCompany(e.target.value)} required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" />
            </div>
            
            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
                    <input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} 
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
                 <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">End Date (Leave empty if current)</label>
                    <input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} 
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
            </div>

            {/* Location */}
             <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location (Optional)</label>
              <input id="location" type="text" value={location} onChange={(e) => setLocation(e.target.value)} 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description (Optional)</label>
              <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} 
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
                {isLoading ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Experience' : 'Add Experience')}
              </button>
              {isEditing && (
                <button type="button" onClick={resetForm} disabled={isLoading}
                  className="mt-3 sm:mt-0 w-full sm:w-auto flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                  Cancel Edit
                </button>
              )}
            </div>
          </form>

          {/* Display Existing Experience Entries */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Existing Experience Entries</h2>
            {fetchError && <p className="text-red-600 dark:text-red-400">Error fetching: {fetchError}</p>}
            {isLoading && !experienceList.length && <p>Loading entries...</p>} 
            {!isLoading && experienceList.length === 0 && !fetchError && (
              <p className="text-gray-500 dark:text-gray-400">No experience entries added yet.</p>
            )}
            <div className="space-y-4">
              {experienceList.map((exp) => (
                <div key={exp.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">{exp.job_title} at {exp.company}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {exp.start_date ? new Date(exp.start_date).toLocaleDateString() : '?'} - 
                        {exp.end_date ? new Date(exp.end_date).toLocaleDateString() : 'Present'}
                        {exp.location && ` | ${exp.location}`}
                        {exp.display_order !== null && ` | Order: ${exp.display_order}`}
                    </p>
                     {exp.description && <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 line-clamp-2">{exp.description}</p>}
                  </div>
                  <div className="flex space-x-2 flex-shrink-0 ml-4">
                    <button onClick={() => handleEditClick(exp)} disabled={isLoading}
                      className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(exp.id)} disabled={isLoading}
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

export default ManageExperiencePage;
