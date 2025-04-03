import React from 'react';

interface TestimonialCardProps {
  quote: string;
  author: string;
  position?: string;
  company?: string;
  imageUrl?: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  author,
  position,
  company,
  imageUrl
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 relative">
      {/* Quote mark */}
      <div className="absolute top-4 left-4 text-blue-200 dark:text-blue-900 opacity-50">
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
      </div>
      
      <div className="pt-6">
        <p className="text-gray-600 dark:text-gray-300 mb-6 relative z-10">{quote}</p>
        
        <div className="flex items-center">
          {/* Author image */}
          <div className="mr-4">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={author} 
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold">
                {author.charAt(0)}
              </div>
            )}
          </div>
          
          {/* Author info */}
          <div>
            <h4 className="font-bold">{author}</h4>
            {(position || company) && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {position}
                {position && company && ', '}
                {company}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function TestimonialsSection() {
  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Client Testimonials</h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Here's what clients and colleagues have to say about working with me.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <TestimonialCard
          quote="Kyrylo's expertise in AI and prompt engineering transformed our customer support system. His innovative approach reduced response times by 45% while maintaining high quality interactions."
          author="Alex Johnson"
          position="CTO"
          company="TechInnovate"
        />
        
        <TestimonialCard
          quote="Working with Kyrylo on our AI integration project was a game-changer. His deep knowledge of LLMs and ability to create effective AI agents streamlined our workflow significantly."
          author="Maria Rodriguez"
          position="Product Manager"
          company="DataFlow Systems"
        />
        
        <TestimonialCard
          quote="Highly recommend Kyrylo! Professional, quick service and high responsiveness. Really kind person, definitely someone you like to work with!"
          author="Client from Upwork"
          company="AI Bot Project"
        />
        
        <TestimonialCard
          quote="Kyrylo's implementation of no-code automation tools saved our team countless hours of manual work. His solutions were elegant, scalable, and easy to maintain."
          author="David Chen"
          position="Operations Director"
          company="GlobalTech"
        />
        
        <TestimonialCard
          quote="The AI solution architecture Kyrylo designed for our company has been instrumental in our data processing pipeline. His attention to detail and focus on scalability were impressive."
          author="Sarah Williams"
          position="Data Science Lead"
          company="AnalyticsPro"
        />
        
        <TestimonialCard
          quote="Kyrylo's ability to translate complex technical concepts into practical business solutions is remarkable. He not only delivered an excellent AI system but also ensured our team understood how to leverage it effectively."
          author="Michael Thompson"
          position="CEO"
          company="InnovateAI"
        />
      </div>
    </div>
  );
}
