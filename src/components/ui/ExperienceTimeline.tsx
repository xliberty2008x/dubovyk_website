"use client"; // Add this because we'll use hooks (useState, useEffect)

import React, { useState, useEffect } from 'react';
import { supabase, Experience } from '@/lib/supabaseClient'; // Import supabase and Experience type

// Keep TimelineItemProps similar, but adjust based on Experience type
interface TimelineItemProps {
  startDate?: string | null;
  endDate?: string | null;
  title: string;
  company: string;
  description?: string | null;
  location?: string | null;
  isActive?: boolean; // Determine if it's a "present" role
}

const TimelineItem: React.FC<TimelineItemProps> = ({
  startDate,
  endDate,
  title,
  company,
  description,
  location,
  isActive = false,
}) => {
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
    <div className="relative pl-8 pb-8 last:pb-0"> {/* Remove bottom padding from last item */}
      {/* Timeline line (stop before the dot if it's the last item) */}
      <div className="absolute left-0 top-4 h-[calc(100%-1rem)] w-0.5 bg-gray-200 dark:bg-gray-700"></div>
      
      {/* Timeline dot - adjust top position slightly */}
      <div className={`absolute left-[-8px] top-1 h-4 w-4 rounded-full border-2 ${
        isActive 
          ? 'bg-blue-500 border-blue-600 dark:bg-blue-400 dark:border-blue-500' 
          : 'bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600'
      }`}></div>
      
      {/* Content */}
      <div className="mb-1"> {/* Reduced margin */}
        <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          {yearRange}
        </span>
      </div>
      <h3 className="text-lg font-semibold">{title}</h3> {/* Slightly smaller heading */}
      <p className="text-md text-gray-600 dark:text-gray-400 mb-1">{company}{location && ` | ${location}`}</p> {/* Added location */}
      {description && <p className="text-gray-700 dark:text-gray-300 text-sm">{description}</p>} {/* Optional description */}
    </div>
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

  if (loading) {
    return <div className="text-center py-10">Loading experience...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600 dark:text-red-400">Error: {error}</div>;
  }

  if (experience.length === 0) {
     return <div className="text-center py-10 text-gray-500 dark:text-gray-400">No experience information available yet.</div>;
  }

  return (
    <div className="py-8">
      {/* Removed redundant H2 as the page itself has one */}
      <div className="max-w-3xl mx-auto border-l-2 border-gray-200 dark:border-gray-700"> {/* Added border to the container */}
         {experience.map((item, index) => (
          <TimelineItem 
            key={item.id}
            startDate={item.start_date}
            endDate={item.end_date}
            title={item.job_title}
            company={item.company}
            description={item.description}
            location={item.location}
            isActive={!item.end_date} // Active if no end date
          />
         ))}
      </div>
    </div>
  );
}
