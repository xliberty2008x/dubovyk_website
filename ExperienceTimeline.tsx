import React from 'react';
import Image from 'next/image';

interface TimelineItemProps {
  year: string;
  title: string;
  company: string;
  description: string;
  isActive?: boolean;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ 
  year, 
  title, 
  company, 
  description, 
  isActive = false 
}) => {
  return (
    <div className="relative pl-8 pb-8">
      {/* Timeline line */}
      <div className="absolute left-0 top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>
      
      {/* Timeline dot */}
      <div className={`absolute left-[-8px] top-0 h-4 w-4 rounded-full border-2 ${
        isActive 
          ? 'bg-blue-500 border-blue-600 dark:bg-blue-400 dark:border-blue-500' 
          : 'bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600'
      }`}></div>
      
      {/* Content */}
      <div className="mb-2">
        <span className="inline-block px-2 py-1 text-xs font-semibold rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          {year}
        </span>
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">{company}</p>
      <p className="text-gray-700 dark:text-gray-300">{description}</p>
    </div>
  );
};

export default function ExperienceTimeline() {
  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-8 text-center">Professional Journey</h2>
      
      <div className="max-w-3xl mx-auto">
        <TimelineItem 
          year="2024 - Present"
          title="AI Solutions Architect"
          company="Big Sister AI"
          description="Leading the design and implementation of AI solutions, collaborating with stakeholders to translate business needs into technical specifications, and developing AI models and data pipelines."
          isActive={true}
        />
        
        <TimelineItem 
          year="2023 - Present"
          title="AI Engineer & No-Code Development Lead"
          company="Keer Lab"
          description="Developing AI agents for research, customer support, and sales management. Leveraging No-Code automation and Python scripting to facilitate API integrations."
          isActive={true}
        />
        
        <TimelineItem 
          year="2023 - 2024"
          title="Co-Founder"
          company="Autosynthiq"
          description="Led product development resulting in a platform that reduces clients' customer acquisition costs by 45%. Directed a strategy overhaul that propelled a user base increase of 150% within five months."
        />
        
        <TimelineItem 
          year="2022 - 2023"
          title="Sales Director"
          company="Griffin | Facility Management"
          description="Established a sales department from scratch and engineered a strategy that doubled revenue from 60 to 120 million within a year, exceeding industry averages by 20%."
        />
        
        <TimelineItem 
          year="2020 - 2022"
          title="Chief Executive Officer"
          company="KidWay"
          description="Scaled the start-up to a revenue of 12 million UAH in the first year, surpassing average industry growth rates by 25%. Implemented CRM and ERP systems that increased operational efficiency."
        />
        
        <TimelineItem 
          year="2018 - 2019"
          title="Head Of Sales"
          company="Vema Kids"
          description="Managed and optimized a sales team of 40+ members, facilitating a 25% YOY revenue increase. Improved CRM system functionality leading to 15% increase in customer retention."
        />
      </div>
    </div>
  );
}
