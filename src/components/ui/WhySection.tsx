'use client';

import { motion } from 'framer-motion';
import { Variants } from 'framer-motion';

interface WhySectionProps {
  variant?: 'light' | 'dark';
}

const WhySection = ({ variant = 'dark' }: WhySectionProps) => {
  const textColor = variant === 'dark' ? 'text-white' : 'text-gray-900';
  const subtextColor = variant === 'dark' ? 'text-gray-300' : 'text-gray-600';
  
  const fadeIn: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const }
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      {/* Subtle divider */}
      <div className="max-w-4xl mx-auto mb-16">
        <div className="flex items-center justify-center">
          <div className="h-px w-full bg-gray-800"></div>
          <div className="mx-4">
            <div className="h-1 w-1 rounded-full bg-emerald-500"></div>
          </div>
          <div className="h-px w-full bg-gray-800"></div>
        </div>
      </div>
      
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-12"
        >
          <motion.h2 
            variants={fadeIn}
            className={`text-3xl md:text-4xl font-medium ${textColor} font-poppins mb-6 relative inline-block`}
          >
            Why this App <span className="text-emerald-500">Exists</span>?
            <div className="absolute -bottom-2 left-0 right-0 mx-auto w-20 h-[2px] bg-emerald-500"></div>
          </motion.h2>
          
          <motion.p 
            variants={fadeIn}
            className={`${subtextColor} text-lg max-w-3xl mx-auto font-poppins`}
          >
            Our platform was created to bridge the gap between environmental awareness and actionable change.
          </motion.p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: { duration: 0.6, delay: 0.1, ease: "easeOut" }
              }
            }}
            className="bg-black/20 backdrop-blur-sm p-6 rounded-lg border border-gray-800"
          >
            <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <h3 className={`text-xl font-medium ${textColor} font-poppins mb-3`}>Empower Communities</h3>
            <p className={`${subtextColor} font-poppins`}>
              We provide tools for communities to report and track environmental issues in their local areas.
            </p>
          </motion.div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: { duration: 0.6, delay: 0.3, ease: "easeOut" }
              }
            }}
            className="bg-black/20 backdrop-blur-sm p-6 rounded-lg border border-gray-800"
          >
            <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
              </svg>
            </div>
            <h3 className={`text-xl font-medium ${textColor} font-poppins mb-3`}>Real Organizations Take Action</h3>
            <p className={`${subtextColor} font-poppins`}>
              environmental organizations that take concrete actions to address reported issues.
            </p>
          </motion.div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: { duration: 0.6, delay: 0.5, ease: "easeOut" }
              }
            }}
            className="bg-black/20 backdrop-blur-sm p-6 rounded-lg border border-gray-800"
          >
            <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className={`text-xl font-medium ${textColor} font-poppins mb-3`}>Drive Real Change</h3>
            <p className={`${subtextColor} font-poppins`}>
              We transform environmental data into actionable insights that lead to real-world impact.
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* Subtle divider between sections */}
      <div className="max-w-4xl mx-auto my-20">
        <div className="flex items-center justify-center">
          <div className="h-px w-full bg-gray-800"></div>
          <div className="mx-4 flex space-x-2">
            <div className="h-1 w-1 rounded-full bg-emerald-500"></div>
            <div className="h-1 w-1 rounded-full bg-emerald-400"></div>
            <div className="h-1 w-1 rounded-full bg-emerald-500"></div>
          </div>
          <div className="h-px w-full bg-gray-800"></div>
        </div>
      </div>
      
      {/* Cool Things You Can Do Section */}
      <div className="max-w-5xl mx-auto mt-32">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <motion.h2 
            variants={fadeIn}
            className="text-3xl md:text-4xl font-rock-salt text-white mb-6 relative inline-block"
          >
            Cool Things You Can Do
            <div className="absolute -bottom-3 left-0 right-0 mx-auto w-32 h-[2px] bg-emerald-500"></div>
          </motion.h2>
          
                      <motion.p 
            variants={fadeIn}
            className={`${subtextColor} text-lg max-w-3xl mx-auto font-poppins mt-8`}
          >
            Here&apos;s how you can actually make a difference with just a few taps on your screen.
          </motion.p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { 
                opacity: 1, 
                x: 0,
                transition: { duration: 0.6, delay: 0.2, ease: "easeOut" as const }
              }
            }}
            className="flex gap-6"
          >
            <div className="w-14 h-14 bg-emerald-500/10 rounded-full flex items-center justify-center flex-shrink-0 border border-emerald-500/20">
              <span className="text-2xl text-emerald-500 font-rock-salt">1</span>
            </div>
            <div>
              <h3 className={`text-xl font-medium ${textColor} font-poppins mb-3`}>Report Environmental Issues</h3>
              <p className={`${subtextColor} font-poppins`}>
                Easily document and report environmental concerns in your area with our intuitive mobile interface.
              </p>
            </div>
          </motion.div>
          
         
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { 
                opacity: 1, 
                x: 0,
                transition: { duration: 0.6, delay: 0.4, ease: "easeOut" as const }
              }
            }}
            className="flex gap-6"
          >
            <div className="w-14 h-14 bg-emerald-500/10 rounded-full flex items-center justify-center flex-shrink-0 border border-emerald-500/20">
              <span className="text-2xl text-emerald-500 font-rock-salt">2</span>
            </div>
            <div>
              <h3 className={`text-xl font-medium ${textColor} font-poppins mb-3`}>Track Progress</h3>
              <p className={`${subtextColor} font-poppins`}>
                Monitor the status of reported issues and see how your contributions are making a difference.
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: { opacity: 0, x: 20 },
              visible: { 
                opacity: 1, 
                x: 0,
                transition: { duration: 0.6, delay: 0.5, ease: "easeOut" as const }
              }
            }}
            className="flex gap-6"
          >
            <div className="w-14 h-14 bg-emerald-500/10 rounded-full flex items-center justify-center flex-shrink-0 border border-emerald-500/20">
              <span className="text-2xl text-emerald-500 font-rock-salt">3</span>
            </div>
            <div>
              <h3 className={`text-xl font-medium ${textColor} font-poppins mb-3`}>Help make your city less gross</h3>
              <p className={`${subtextColor} font-poppins`}>
                Take action to clean up your local community and transform neglected areas into cleaner, healthier spaces.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhySection; 