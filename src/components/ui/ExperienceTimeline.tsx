"use client"; // Add this because we'll use hooks (useState, useEffect)

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, Experience } from '@/lib/supabaseClient'; // Import supabase and Experience type

// Mock technologies for each experience item (since they're not in the database yet)
// In a real implementation, you would add this to your database schema
const mockTechnologies: Record<string, string[]> = {
  default: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'CSS'],
  frontend: ['React', 'Vue', 'Angular', 'CSS', 'Tailwind'],
  backend: ['Node.js', 'Python', 'Java', 'SQL', 'MongoDB'],
  fullstack: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'],
  devops: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform'],
  mobile: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase'],
};

// Keep TimelineItemProps similar, but adjust based on Experience type
interface TimelineItemProps {
  startDate?: string | null;
  endDate?: string | null;
  title: string;
  company: string;
  description?: string | null;
  location?: string | null;
  isActive?: boolean; // Determine if it's a "present" role
  technologies?: string[]; // Added technologies array
  index: number; // Added index for staggered animations
}

const TimelineItem: React.FC<TimelineItemProps> = ({
  startDate,
  endDate,
  title,
  company,
  description,
  location,
  isActive = false,
  technologies = [],
  index,
}) => {
  const [expanded, setExpanded] = useState(false);
  
  // Format the year range string
  const formatYearRange = () => {
    const startYear = startDate ? new Date(startDate).getFullYear() : '?';
    const endYear = endDate ? new Date(endDate).getFullYear() : 'Present';
    if (startYear === endYear && !endDate) return `${startYear} - Present`; // Handle case like "2024 - Present"
    if (startYear === endYear && endDate) return `${startYear}`; // Handle single year like "2023"
    return `${startYear} - ${endYear}`;
  };
  const yearRange = formatYearRange();

  return (
    // Animate the entire item when it comes into view
    <motion.div 
      className="relative pl-6 sm:pl-8 pb-8 last:pb-0"
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
    > 
      {/* Timeline line with animation */}
      <motion.div 
        className="absolute left-[-2px] sm:left-0 top-4 w-0.5 bg-gradient-to-b from-blue-400 to-indigo-600 dark:from-blue-500 dark:to-indigo-700"
        initial={{ height: 0 }}
        whileInView={{ height: "calc(100% - 1rem)" }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
      ></motion.div>
      
      {/* Timeline dot with pulse animation for active items */}
      <motion.div 
        className={`absolute left-[-10px] sm:left-[-8px] top-1 h-4 w-4 rounded-full border-2 z-10 ${
          isActive 
            ? 'bg-blue-500 border-blue-600 dark:bg-blue-400 dark:border-blue-500' 
            : 'bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600'
        }`}
        animate={isActive ? {
          scale: [1, 1.2, 1],
          boxShadow: [
            "0 0 0 0 rgba(59, 130, 246, 0.5)", 
            "0 0 0 10px rgba(59, 130, 246, 0)", 
            "0 0 0 0 rgba(59, 130, 246, 0)"
          ]
        } : {}}
        transition={isActive ? { 
          repeat: Infinity, 
          duration: 2 
        } : {}}
      ></motion.div>
      
      {/* Card content with hover effects */}
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
        whileHover={{ y: -5 }}
        onClick={() => setExpanded(!expanded)}
        layout
      >
        {/* Year badge with animation */}
        <motion.div 
          className="mb-2"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 + index * 0.1 }}
        > 
          <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 dark:from-blue-900 dark:to-indigo-900 dark:text-blue-200">
            {yearRange}
          </span>
        </motion.div>
        
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-md text-gray-600 dark:text-gray-400 mb-2">{company}{location && ` | ${location}`}</p>
        
        {/* Technology bubbles */}
        <div className="flex flex-wrap gap-1 mb-2">
          {technologies.slice(0, 3).map((tech, i) => (
            <motion.span
              key={i}
              className="px-2 py-0.5 text-xs bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 rounded-full"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              {tech}
            </motion.span>
          ))}
          {technologies.length > 3 && (
            <motion.span
              className="px-2 py-0.5 text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-full cursor-pointer"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.1 }}
            >
              +{technologies.length - 3}
            </motion.span>
          )}
        </div>
        
        {/* Brief description always visible */}
        {description && (
          <motion.p 
            className="text-gray-700 dark:text-gray-300 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 + index * 0.1 }}
          >
            {expanded ? description : `${description.substring(0, 120)}${description.length > 120 ? '...' : ''}`}
          </motion.p>
        )}
        
        {/* Expandable content */}
        <AnimatePresence>
          {expanded && description && description.length > 120 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-3"
            >
              {/* Full technology list */}
              <div className="mt-2 mb-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Technologies:</p>
                <div className="flex flex-wrap gap-1">
                  {technologies.map((tech, i) => (
                    <motion.span
                      key={i}
                      className="px-2 py-0.5 text-xs bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 rounded-full"
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </div>
              
              {/* Show more/less button */}
              <motion.button
                className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded(false);
                }}
              >
                Show less
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Expand indicator */}
        {description && description.length > 120 && (
          <motion.div 
            className="mt-2 text-center"
            animate={{ y: expanded ? 0 : [0, 5, 0] }}
            transition={{ repeat: expanded ? 0 : Infinity, duration: 1.5 }}
          >
            <button 
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default function ExperienceTimeline() {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperience = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from('experience')
          .select('*')
          .order('display_order', { ascending: true, nullsFirst: false }) // Use display_order first
          .order('start_date', { ascending: false }); // Then sort by date descending

        if (fetchError) {
          throw fetchError;
        }
        setExperience(data || []);
      } catch (err: any) {
        console.error("Error fetching experience data:", err);
        setError("Failed to load experience data.");
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, []); // Fetch only on component mount

  // Assign mock technologies based on job title keywords
  const getExperienceWithTechnologies = () => {
    return experience.map(item => {
      let techCategory = 'default';
      const title = item.job_title.toLowerCase();
      
      if (title.includes('front') || title.includes('ui') || title.includes('ux')) {
        techCategory = 'frontend';
      } else if (title.includes('back') || title.includes('server')) {
        techCategory = 'backend';
      } else if (title.includes('full') || title.includes('stack')) {
        techCategory = 'fullstack';
      } else if (title.includes('devops') || title.includes('cloud')) {
        techCategory = 'devops';
      } else if (title.includes('mobile') || title.includes('ios') || title.includes('android')) {
        techCategory = 'mobile';
      }
      
      // Shuffle the array to get different technologies for each position
      const shuffled = [...mockTechnologies[techCategory]].sort(() => 0.5 - Math.random());
      // Take a random number of technologies (2-5)
      const count = Math.floor(Math.random() * 4) + 2;
      
      return {
        ...item,
        technologies: shuffled.slice(0, count)
      };
    });
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <motion.div
          className="inline-block h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p className="mt-2 text-gray-600 dark:text-gray-400">Loading experience...</p>
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

  if (experience.length === 0) {
    return (
      <motion.div 
        className="text-center py-10 text-gray-500 dark:text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        No experience information available yet.
      </motion.div>
    );
  }

  const experienceWithTech = getExperienceWithTechnologies();

  return (
    <motion.div 
      className="py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Page title animation */}
      <motion.div 
        className="max-w-3xl mx-auto mb-8 text-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">My Professional Journey</h2>
        <motion.div 
          className="h-1 w-20 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto mt-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: 80 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
      </motion.div>
      
      {/* Timeline container with subtle animation */}
      <motion.div 
        className="max-w-3xl mx-auto relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        {/* Main timeline items */}
        {experienceWithTech.map((item, index) => (
          <TimelineItem 
            key={item.id}
            startDate={item.start_date}
            endDate={item.end_date}
            title={item.job_title}
            company={item.company}
            description={item.description}
            location={item.location}
            isActive={!item.end_date} // Active if no end date
            technologies={item.technologies}
            index={index}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
