import React from 'react';

interface CertificationCardProps {
  title: string;
  issuer?: string;
  date?: string;
  description?: string;
}

const CertificationCard: React.FC<CertificationCardProps> = ({ 
  title, 
  issuer, 
  date, 
  description 
}) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      
      {(issuer || date) && (
        <div className="flex flex-wrap items-center text-sm text-gray-600 dark:text-gray-300 mb-3">
          {issuer && <span>{issuer}</span>}
          {issuer && date && <span className="mx-2">•</span>}
          {date && <span>{date}</span>}
        </div>
      )}
      
      {description && (
        <p className="text-gray-700 dark:text-gray-300 text-sm">{description}</p>
      )}
      
      <div className="mt-4 flex items-center">
        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
        </svg>
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">Verified</span>
      </div>
    </div>
  );
};

export default function CertificationsGrid() {
  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-8 text-center">Certifications</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CertificationCard
          title="ChatGPT Prompt Engineering for Developers"
          issuer="DeepLearning.AI"
          date="2023"
          description="Advanced techniques for creating effective prompts for large language models."
        />
        
        <CertificationCard
          title="Multi AI Agent Systems"
          issuer="AI Research Institute"
          date="2023"
          description="Design and implementation of systems with multiple AI agents working together."
        />
        
        <CertificationCard
          title="Source Systems, Data Ingestion, and Pipelines"
          issuer="Data Engineering Academy"
          date="2022"
          description="Building robust data pipelines and ingestion systems for AI applications."
        />
        
        <CertificationCard
          title="Data Storage and Queries"
          issuer="Data Engineering Academy"
          date="2022"
          description="Advanced techniques for efficient data storage and query optimization."
        />
        
        <CertificationCard
          title="Introduction to Data Engineering"
          issuer="Data Engineering Academy"
          date="2022"
          description="Fundamentals of data engineering for AI and machine learning applications."
        />
      </div>
    </div>
  );
}
