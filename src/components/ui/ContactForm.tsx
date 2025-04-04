import React from 'react';
import { motion } from 'framer-motion';

interface ContactFormProps {
  onSubmit: (formData: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({
    type: null,
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would send the form data to a server
      // For now, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSubmit(formData);
      
      setSubmitStatus({
        type: 'success',
        message: 'Your message has been sent successfully! I will get back to you soon.'
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'There was an error sending your message. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants for form elements
  const formVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
    >
      {/* Decorative elements */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      />
      
      {submitStatus.type && (
        <motion.div 
          className={`mb-6 p-4 rounded-md ${
            submitStatus.type === 'success' 
              ? 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-200' 
              : 'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-200'
          }`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {submitStatus.message}
          </motion.div>
        </motion.div>
      )}
      
      <motion.form 
        onSubmit={handleSubmit} 
        className="space-y-6"
        variants={formVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={itemVariants}
        >
          <motion.div variants={itemVariants}>
            <motion.label 
              htmlFor="name" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              whileHover={{ x: 2, color: "#3b82f6", transition: { duration: 0.2 } }}
            >
              Name
            </motion.label>
            <motion.input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
              placeholder="Your name"
              whileFocus={{ 
                scale: 1.01,
                borderColor: "#3b82f6",
                boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.2)"
              }}
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <motion.label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              whileHover={{ x: 2, color: "#3b82f6", transition: { duration: 0.2 } }}
            >
              Email
            </motion.label>
            <motion.input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
              placeholder="your.email@example.com"
              whileFocus={{ 
                scale: 1.01,
                borderColor: "#3b82f6",
                boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.2)"
              }}
            />
          </motion.div>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <motion.label 
            htmlFor="subject" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            whileHover={{ x: 2, color: "#3b82f6", transition: { duration: 0.2 } }}
          >
            Subject
          </motion.label>
          <motion.input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
            placeholder="What is this regarding?"
            whileFocus={{ 
              scale: 1.01,
              borderColor: "#3b82f6",
              boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.2)"
            }}
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <motion.label 
            htmlFor="message" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            whileHover={{ x: 2, color: "#3b82f6", transition: { duration: 0.2 } }}
          >
            Message
          </motion.label>
          <motion.textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
            placeholder="Your message here..."
            whileFocus={{ 
              scale: 1.01,
              borderColor: "#3b82f6",
              boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.2)"
            }}
          ></motion.textarea>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 transition-all duration-300 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            whileHover={!isSubmitting ? { y: -2, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" } : {}}
            whileTap={!isSubmitting ? { y: 0, boxShadow: "none" } : {}}
          >
            {isSubmitting ? (
              <motion.span 
                className="flex items-center justify-center"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <motion.svg 
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </motion.svg>
                Sending...
              </motion.span>
            ) : (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                Send Message
              </motion.span>
            )}
          </motion.button>
          <motion.p 
            className="text-sm text-gray-500 dark:text-gray-400 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            I'll respond to your message as soon as possible.
          </motion.p>
        </motion.div>
      </motion.form>
      
      {/* Decorative corner accent */}
      <motion.div 
        className="absolute bottom-0 right-0 w-16 h-16 overflow-hidden pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <div className="absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2 rotate-45 bg-gradient-to-br from-blue-400 to-purple-500 w-16 h-2"></div>
      </motion.div>
    </motion.div>
  );
};

export default ContactForm;
