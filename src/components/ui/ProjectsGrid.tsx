"use client"; // Add client directive for hooks

import React, { useState, useEffect } from 'react';
import { supabase, Project } from '@/lib/supabaseClient'; // Import supabase and Project type

// Simplify props to take the Project object
interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  // Destructure project properties
  const { name, description, technologies, url } = project;
  // Note: imageUrl, githubUrl, demoUrl are not in the Project type/table currently.
  // We'll use a placeholder graphic and only show the 'url' if available.
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
      {/* Project Image/Banner - Using placeholder as imageUrl isn't in the DB yet */}
      <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500 relative">
        {/* Placeholder Icon */}
        {/* Removed one of the duplicated divs */}
        <div className="w-full h-full flex items-center justify-center">
           <svg className="w-16 h-16 text-white opacity-50" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
             <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"></path>
           </svg>
         </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{name}</h3> {/* Use name from project */}
        {description && <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>} {/* Use description */}
        
        {/* Technologies */}
        {technologies && technologies.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded dark:bg-blue-900 dark:text-blue-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Links - Only using project.url for now */}
        <div className="flex space-x-3">
          {/* GitHub link could be added if the table/type is updated */}
          
          {url && ( // Use project.url
            <a 
              href={url} 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd"></path>
              </svg>
              View Project {/* Changed text */}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default function ProjectsGrid() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from('projects')
          .select('*')
          .order('display_order', { ascending: true, nullsFirst: false })
          .order('created_at', { ascending: false });

        if (fetchError) {
          throw fetchError;
        }
        setProjects(data || []);
      } catch (err: any) {
        console.error("Error fetching projects data:", err);
        setError("Failed to load projects data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

   if (loading) {
    return <div className="text-center py-10">Loading projects...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600 dark:text-red-400">Error: {error}</div>;
  }
  
  if (projects.length === 0) {
     return <div className="text-center py-10 text-gray-500 dark:text-gray-400">No projects available yet.</div>;
  }

  return (
    <div className="py-8">
      {/* Title is usually provided by the page component */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> 
        {projects.map((project) => (
          <ProjectCard 
            key={project.id} 
            project={project} // Pass the whole project object
          />
        ))}
      </div>
    </div>
  );
}
