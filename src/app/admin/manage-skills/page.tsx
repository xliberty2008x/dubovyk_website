"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, Skill } from '@/lib/supabaseClient'; // Import Skill type
import { useAuth } from '@/app/providers/AuthProvider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const ManageSkillsPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  // Form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [proficiency, setProficiency] = useState<number | ''>(''); // 1-5 scale, use '' for empty
  const [displayOrder, setDisplayOrder] = useState<number | ''>('');

  // List state
  const [skillsList, setSkillsList] = useState<Skill[]>([]);
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

  // Fetch skills entries
  const fetchSkills = async () => {
    if (!user) return;
    setFetchError(null);
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('display_order', { ascending: true, nullsFirst: false })
        .order('name', { ascending: true }); // Secondary sort by name

      if (error) throw error;
      setSkillsList(data || []);
    } catch (err: any) {
      console.error("Error fetching skills:", err);
      setFetchError(err.message || "Could not fetch skills.");
      setSkillsList([]);
    } finally {
       setIsLoading(false);
    }
  };

  // Fetch on mount if user is logged in
  useEffect(() => {
    if (user) {
      fetchSkills();
    }
  }, [user]);

  // Handle form submission (Add or Update)
  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!user) { setError("You must be logged in."); return; }
    setError(null);
    setIsLoading(true);

    try {
      const skillData = {
        name: name,
        category: category || null,
        proficiency: proficiency === '' ? null : Number(proficiency),
        display_order: displayOrder === '' ? null : Number(displayOrder),
      };

      let operationError = null;

      if (isEditing && editingId) {
        const { error: updateError } = await supabase
          .from('skills')
          .update(skillData)
          .match({ id: editingId });
        operationError = updateError;
      } else {
        // Check for duplicate name before inserting
         const { data: existingSkill, error: checkError } = await supabase
            .from('skills')
            .select('id')
            .eq('name', name)
            .maybeSingle(); // Use maybeSingle to handle 0 or 1 result

        if (checkError) throw checkError;
        if (existingSkill) {
            throw new Error(`Skill with name "${name}" already exists.`);
        }
        
        const { error: insertError } = await supabase
          .from('skills')
          .insert([skillData]);
         operationError = insertError;
      }

      if (operationError) throw operationError;

      resetForm();
      await fetchSkills(); 
      alert(isEditing ? 'Skill updated!' : 'Skill added!');

    } catch (err: any) {
      console.error(isEditing ? "Error updating skill:" : "Error adding skill:", err);
      // Handle potential unique constraint violation error
      if (err.message?.includes('duplicate key value violates unique constraint "skills_name_key"')) {
         setError(`Skill with name "${name}" already exists.`);
      } else {
        setError(err.message || `Failed to ${isEditing ? 'update' : 'add'} skill.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle deleting an entry
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;
    if (!user) { setError("Not logged in."); return; }
    
    setError(null);
    setIsLoading(true); 

    try {
      const { error: deleteError } = await supabase
        .from('skills')
        .delete()
        .match({ id: id });

      if (deleteError) throw deleteError;

      await fetchSkills(); 
      alert('Skill deleted!');

    } catch (err: any) {
      console.error("Error deleting skill:", err);
      setError(err.message || "Failed to delete skill.");
    } finally {
      setIsLoading(false);
    }
  };

  // Populate form for editing
  const handleEditClick = (skill: Skill) => {
    setIsEditing(true);
    setEditingId(skill.id);
    setName(skill.name);
    setCategory(skill.category || '');
    setProficiency(skill.proficiency === null || skill.proficiency === undefined ? '' : skill.proficiency);
    setDisplayOrder(skill.display_order === null || skill.display_order === undefined ? '' : skill.display_order);
    setError(null);
    window.scrollTo(0, 0); 
  };
  
  // Reset form fields and editing state
  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setName('');
    setCategory('');
    setProficiency('');
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
          <h1 className="text-3xl font-bold mb-6">Manage Skills</h1>

          {/* Add/Edit Form */}
          <form onSubmit={handleFormSubmit} className="mb-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-4">
             <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Skill' : 'Add New Skill'}</h2>
            
             {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Skill Name</label>
              <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category (Optional, e.g., Language, Framework)</label>
              <input id="category" type="text" value={category} onChange={(e) => setCategory(e.target.value)} 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" />
            </div>
            
            {/* Proficiency */}
            <div>
               <label htmlFor="proficiency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Proficiency (Optional, 1-5)</label>
               <input id="proficiency" type="number" value={proficiency} onChange={(e) => setProficiency(e.target.value === '' ? '' : Number(e.target.value))} min="1" max="5"
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
                {isLoading ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Skill' : 'Add Skill')}
              </button>
              {isEditing && (
                <button type="button" onClick={resetForm} disabled={isLoading}
                  className="mt-3 sm:mt-0 w-full sm:w-auto flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                  Cancel Edit
                </button>
              )}
            </div>
          </form>

          {/* Display Existing Skills */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Existing Skills</h2>
            {fetchError && <p className="text-red-600 dark:text-red-400">Error fetching: {fetchError}</p>}
            {isLoading && !skillsList.length && <p>Loading skills...</p>} 
            {!isLoading && skillsList.length === 0 && !fetchError && (
              <p className="text-gray-500 dark:text-gray-400">No skills added yet.</p>
            )}
            <div className="space-y-4">
              {skillsList.map((skill) => (
                <div key={skill.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">{skill.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {skill.category && `Category: ${skill.category}`}
                        {skill.proficiency !== null && ` | Proficiency: ${skill.proficiency}/5`}
                        {skill.display_order !== null && ` | Order: ${skill.display_order}`}
                    </p>
                  </div>
                  <div className="flex space-x-2 flex-shrink-0 ml-4">
                    <button onClick={() => handleEditClick(skill)} disabled={isLoading}
                      className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(skill.id)} disabled={isLoading}
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

export default ManageSkillsPage;
