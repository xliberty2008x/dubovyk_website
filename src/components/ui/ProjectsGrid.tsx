"use client"; // Add client directive for hooks

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, Project } from '@/lib/supabaseClient'; // Import supabase and Project type

// Simplify props to take the Project object
interface ProjectCardProps {
  project: Project;
  index: number; // Added index for staggered animations
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  // Destructure project properties
  const { name, description, technologies, url } = project;
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ 
        opacity: 1, 
        y: 0,
        transition: { 
          duration: 0.5,
          delay: index * 0.1 
        }
      }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ 
        y: -10,
        transition: { duration: 0.2 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Project Image/Banner with animation */}
      <motion.div 
        className="h-48 bg-gradient-to-r from-purple-400 to-blue-500 relative overflow-hidden"
        whileHover={{ 
          scale: 1.05,
          transition: { duration: 0.3 }
        }}
      >
        {/* Animated background pattern */}
        <motion.div 
          className="absolute inset-0 opacity-20"
          initial={{ backgroundPosition: '0% 0%' }}
          animate={{ 
            backgroundPosition: isHovered ? '100% 100%' : '0% 0%'
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
            backgroundSize: '24px 24px'
          }}
        />
        
        {/* Placeholder Icon with animation */}
        <motion.div 
          className="w-full h-full flex items-center justify-center"
          whileHover={{ 
            rotate: [0, -5, 5, -5, 0],
            transition: { duration: 0.5 }
          }}
        >
          <motion.svg 
            className="w-16 h-16 text-white opacity-70" 
            fill="currentColor" 
            viewBox="0 0 20 20" 
            xmlns="http://www.w3.org/2000/svg"
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ 
              scale: isHovered ? 1.1 : 1,
              opacity: isHovered ? 0.9 : 0.7
            }}
            transition={{ duration: 0.3 }}
          >
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"></path>
          </motion.svg>
        </motion.div>
      </motion.div>
      
      {/* Content */}
      <div className="p-6">
        <motion.h3 
          className="text-xl font-bold mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {name}
        </motion.h3>
        
        {description && (
          <motion.p 
            className="text-gray-600 dark:text-gray-300 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {description}
          </motion.p>
        )}
        
        {/* Technologies */}
        {technologies && technologies.length > 0 && (
          <motion.div 
            className="mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech, techIndex) => (
                <motion.span 
                  key={techIndex}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded dark:bg-blue-900 dark:text-blue-300"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 + (techIndex * 0.1) }}
                  whileHover={{ 
                    scale: 1.1,
                    backgroundColor: '#93c5fd', // Lighter blue on hover
                    transition: { duration: 0.2 }
                  }}
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Links - Only using project.url for now */}
        <motion.div 
          className="flex space-x-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {url && (
            <motion.a 
              href={url} 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.svg 
                className="w-4 h-4 mr-1" 
                fill="currentColor" 
                viewBox="0 0 20 20" 
                xmlns="http://www.w3.org/2000/svg"
                animate={{ 
                  rotate: isHovered ? [0, 15, 0] : 0
                }}
                transition={{ duration: 0.5 }}
              >
                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd"></path>
              </motion.svg>
              View Project
            </motion.a>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default function ProjectsGrid() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

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

  // Extract all unique technologies from projects
  const allTechnologies = React.useMemo(() => {
    const techSet = new Set<string>();
    projects.forEach(project => {
      if (project.technologies) {
        project.technologies.forEach(tech => techSet.add(tech));
      }
    });
    return Array.from(techSet);
  }, [projects]);

  // Filter projects based on selected technology
  const filteredProjects = React.useMemo(() => {
    if (!activeFilter) return projects;
    return projects.filter(project => 
      project.technologies && project.technologies.includes(activeFilter)
    );
  }, [projects, activeFilter]);

  if (loading) {
    return (
      <div className="text-center py-10">
        <motion.div
          className="inline-block h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p className="mt-2 text-gray-600 dark:text-gray-400">Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="text-center py-10 text-red-600 dark:text-red-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Error: {error}
      </motion.div>
    );
  }
  
  if (projects.length === 0) {
    return (
      <motion.div 
        className="text-center py-10 text-gray-500 dark:text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        No projects available yet.
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Technology filters */}
      {allTechnologies.length > 0 && (
        <motion.div 
          className="mb-8 flex flex-wrap justify-center gap-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.button
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              activeFilter === null 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
            onClick={() => setActiveFilter(null)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            All
          </motion.button>
          
          {allTechnologies.map((tech, index) => (
            <motion.button
              key={tech}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                activeFilter === tech 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
              onClick={() => setActiveFilter(tech)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + (index * 0.05) }}
            >
              {tech}
            </motion.button>
          ))}
        </motion.div>
      )}
      
      {/* Projects grid with animation */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={activeFilter || 'all'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {filteredProjects.map((project, index) => (
            <ProjectCard 
              key={project.id} 
              project={project}
              index={index}
            />
          ))}
        </motion.div>
      </AnimatePresence>
      
      {/* Show message when no projects match the filter */}
      {filteredProjects.length === 0 && activeFilter && (
        <motion.div 
          className="text-center py-10 text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          No projects found with the technology: {activeFilter}
          <br />
          <motion.button
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            onClick={() => setActiveFilter(null)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Show All Projects
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}
