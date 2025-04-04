import React from 'react';
import { motion } from 'framer-motion';

interface CertificationCardProps {
  title: string;
  issuer?: string;
  date?: string;
  description?: string;
  index: number; // Added index for staggered animations
}

const CertificationCard: React.FC<CertificationCardProps> = ({ 
  title, 
  issuer, 
  date, 
  description,
  index
}) => {
  return (
    <motion.div 
      className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg border border-gray-200 dark:border-gray-600 relative overflow-hidden"
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
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        transition: { duration: 0.2 }
      }}
    >
      {/* Decorative corner accent */}
      <motion.div 
        className="absolute top-0 right-0 w-16 h-16 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
      >
        <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 rotate-45 bg-gradient-to-br from-green-400 to-teal-500 w-16 h-2"></div>
      </motion.div>
      
      <motion.h3 
        className="text-lg font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-400 dark:to-teal-400"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
      >
        {title}
      </motion.h3>
      
      {(issuer || date) && (
        <motion.div 
          className="flex flex-wrap items-center text-sm text-gray-600 dark:text-gray-300 mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
        >
          {issuer && <span>{issuer}</span>}
          {issuer && date && <span className="mx-2">•</span>}
          {date && (
            <motion.span
              whileHover={{ 
                color: "#10b981", // Green-500
                transition: { duration: 0.2 }
              }}
            >
              {date}
            </motion.span>
          )}
        </motion.div>
      )}
      
      {description && (
        <motion.p 
          className="text-gray-700 dark:text-gray-300 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
        >
          {description}
        </motion.p>
      )}
      
      <motion.div 
        className="mt-4 flex items-center"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
      >
        <motion.svg 
          className="w-5 h-5 text-green-500" 
          fill="currentColor" 
          viewBox="0 0 20 20" 
          xmlns="http://www.w3.org/2000/svg"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
          whileHover={{ 
            rotate: [0, 15, 0, 15, 0],
            scale: 1.2,
            transition: { duration: 1 }
          }}
        >
          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
        </motion.svg>
        <motion.span 
          className="ml-2 text-sm text-gray-600 dark:text-gray-300"
          whileHover={{ 
            color: "#10b981", // Green-500
            x: 2,
            transition: { duration: 0.2 }
          }}
        >
          Verified
        </motion.span>
      </motion.div>
      
      {/* Decorative background pattern */}
      <motion.div 
        className="absolute bottom-0 right-0 w-24 h-24 opacity-5 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        transition={{ duration: 1, delay: 0.6 + index * 0.1 }}
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%2310b981\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
          backgroundSize: '24px 24px'
        }}
      />
    </motion.div>
  );
};

export default function CertificationsGrid() {
  // Define certifications data
  const certifications = [
    {
      title: "ChatGPT Prompt Engineering for Developers",
      issuer: "DeepLearning.AI",
      date: "2023",
      description: "Advanced techniques for creating effective prompts for large language models."
    },
    {
      title: "Multi AI Agent Systems",
      issuer: "AI Research Institute",
      date: "2023",
      description: "Design and implementation of systems with multiple AI agents working together."
    },
    {
      title: "Source Systems, Data Ingestion, and Pipelines",
      issuer: "Data Engineering Academy",
      date: "2022",
      description: "Building robust data pipelines and ingestion systems for AI applications."
    },
    {
      title: "Data Storage and Queries",
      issuer: "Data Engineering Academy",
      date: "2022",
      description: "Advanced techniques for efficient data storage and query optimization."
    },
    {
      title: "Introduction to Data Engineering",
      issuer: "Data Engineering Academy",
      date: "2022",
      description: "Fundamentals of data engineering for AI and machine learning applications."
    }
  ];

  return (
    <motion.div 
      className="py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated connecting dots (decorative) */}
      <motion.div 
        className="absolute left-1/4 top-3/4 w-[30%] h-[40%] -z-10 opacity-10 dark:opacity-20 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1, delay: 1 }}
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%2310b981\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")',
          backgroundSize: '20px 20px'
        }}
      />
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {certifications.map((cert, index) => (
          <CertificationCard
            key={cert.title}
            title={cert.title}
            issuer={cert.issuer}
            date={cert.date}
            description={cert.description}
            index={index}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
