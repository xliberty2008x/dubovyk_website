import React from 'react';
import { motion } from 'framer-motion';

interface SkillCardProps {
  title: string;
  skills: string[];
  icon?: React.ReactNode;
  index: number; // Added index for staggered animations
}

const SkillCard: React.FC<SkillCardProps> = ({ title, skills, icon, index }) => {
  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 overflow-hidden"
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
      <motion.div 
        className="flex items-center mb-4"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
      >
        {icon && (
          <motion.div 
            className="mr-3 text-green-600 dark:text-green-400"
            whileHover={{ 
              rotate: [0, -10, 10, -10, 0],
              scale: 1.2,
              transition: { duration: 0.5 }
            }}
          >
            {icon}
          </motion.div>
        )}
        <motion.h3 
          className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-400 dark:to-teal-400"
        >
          {title}
        </motion.h3>
      </motion.div>
      
      <motion.ul className="space-y-2">
        {skills.map((skill, skillIndex) => (
          <motion.li 
            key={skillIndex} 
            className="flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 + index * 0.05 + skillIndex * 0.05 }}
            whileHover={{ x: 5, transition: { duration: 0.2 } }}
          >
            <motion.svg 
              className="w-4 h-4 mr-2 text-green-500 dark:text-green-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.05 + skillIndex * 0.05 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </motion.svg>
            <span className="text-gray-700 dark:text-gray-300">{skill}</span>
          </motion.li>
        ))}
      </motion.ul>
      
      {/* Decorative element */}
      <motion.div 
        className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-green-100 to-transparent dark:from-green-900/20 dark:to-transparent rounded-tl-full -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
      />
    </motion.div>
  );
};

export default function SkillsGrid() {
  // Define skill categories with their data
  const skillCategories = [
    {
      title: "AI/ML Technologies",
      skills: [
        "Large Language Models (LLMs)",
        "OpenAI GPT Models",
        "Azure Machine Learning",
        "Prompt Engineering",
        "Stable Diffusion",
        "LangChain",
        "AI Agents"
      ],
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
        </svg>
      )
    },
    {
      title: "Cloud Platforms",
      skills: [
        "Amazon Web Services (AWS)",
        "Microsoft Azure",
        "Google Cloud Platform",
        "Azure DevOps",
        "Terraform",
        "Cloud Infrastructure"
      ],
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
        </svg>
      )
    },
    {
      title: "Programming Languages",
      skills: [
        "Python",
        "TypeScript",
        "JavaScript",
        "JSON",
        "Markdown",
        "Jinja"
      ],
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
        </svg>
      )
    },
    {
      title: "No-Code/Low-Code Tools",
      skills: [
        "Flowise AI",
        "n8n",
        "Zapier",
        "Make.com (Integromat)",
        "HighLevel",
        "Workflow Automation"
      ],
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path>
        </svg>
      )
    },
    {
      title: "Data Engineering",
      skills: [
        "Data Ingestion",
        "Data Transformation",
        "Data Storage",
        "BigQuery",
        "Data Pipelines",
        "ETL Processes"
      ],
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path>
        </svg>
      )
    },
    {
      title: "DevOps",
      skills: [
        "CI/CD",
        "Azure DevOps",
        "Terraform",
        "Infrastructure as Code",
        "Deployment Automation",
        "Version Control (Git)"
      ],
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
      )
    }
  ];

  return (
    <motion.div 
      className="py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated connecting lines between skill categories (decorative) */}
      <motion.div 
        className="absolute left-1/2 top-1/4 w-[40%] h-[60%] -z-10 opacity-10 dark:opacity-20 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1, delay: 1 }}
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3Cpattern id=\'smallGrid\' width=\'30\' height=\'30\' patternUnits=\'userSpaceOnUse\'%3E%3Cpath d=\'M 30 0 L 0 0 0 30\' fill=\'none\' stroke=\'%2310b981\' stroke-width=\'0.5\'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'url(%23smallGrid)\'/%3E%3C/svg%3E")',
          backgroundSize: '30px 30px'
        }}
      />
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {skillCategories.map((category, index) => (
          <SkillCard
            key={category.title}
            title={category.title}
            skills={category.skills}
            icon={category.icon}
            index={index}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
