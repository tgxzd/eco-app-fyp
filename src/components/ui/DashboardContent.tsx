'use client';

import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import MapWrapper from '@/components/MapWrapper';

interface DashboardContentProps {
  mapsApiKey: string;
}

const DashboardContent = ({ mapsApiKey }: DashboardContentProps) => {
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  const stagger: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const mapVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.7, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  const buttonVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-grow px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 w-full">
      {/* Welcome Section */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="text-center mb-6 sm:mb-8 lg:mb-12"
      >
        <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-light text-white font-poppins mb-2 sm:mb-3 px-4">
          <span className="text-emerald-500">Dashboard</span>
        </h1>
        <p className="text-gray-300 font-poppins text-sm sm:text-base lg:text-lg px-4 leading-relaxed">
          Monitor and report environmental issues in your area
        </p>
      </motion.div>

      {/* Google Maps Container */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={mapVariants}
        className="mb-6 sm:mb-8 lg:mb-12 w-full max-w-7xl"
      >
        <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl lg:rounded-3xl p-3 sm:p-4 lg:p-6 shadow-lg relative overflow-hidden">
          {/* Glass effect background */}
          <motion.div 
            animate={{ 
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-10 sm:-top-20 -right-10 sm:-right-20 w-20 sm:w-40 h-20 sm:h-40 bg-emerald-500/10 rounded-full blur-2xl sm:blur-3xl"
          ></motion.div>
          <motion.div 
            animate={{ 
              opacity: [0.2, 0.5, 0.2],
              scale: [1.1, 1, 1.1]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute -bottom-10 sm:-bottom-20 -left-10 sm:-left-20 w-20 sm:w-40 h-20 sm:h-40 bg-emerald-500/10 rounded-full blur-2xl sm:blur-3xl"
          ></motion.div>
          
          {/* Subtle border glow */}
          <div className="absolute inset-0 rounded-xl sm:rounded-2xl lg:rounded-3xl border border-emerald-500/20 pointer-events-none"></div>
          
          <div className="relative z-10">
            <MapWrapper apiKey={mapsApiKey} />
          </div>
        </div>
      </motion.div>
      
      {/* Action Buttons */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={buttonVariants}
        className="flex justify-center items-center w-full"
      >
        <Link href="/create-report" className="group w-full sm:w-auto max-w-md sm:max-w-none">
          <button className="w-full sm:w-auto px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 bg-emerald-500/80 backdrop-blur-sm text-white font-poppins rounded-lg sm:rounded-xl lg:rounded-2xl hover:bg-emerald-500 transition-all duration-300 font-medium relative overflow-hidden shadow-lg hover:shadow-emerald-500/20 flex items-center justify-center space-x-2 sm:space-x-3 text-sm sm:text-base lg:text-lg min-h-[48px] sm:min-h-[56px]">
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-emerald-500/0 via-emerald-500/30 to-emerald-500/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
            <span className="relative">Create New Report</span>
            <span className="relative transition-transform duration-300 group-hover:translate-x-1 text-base sm:text-lg">→</span>
          </button>
        </Link>
      </motion.div>
    </div>
  );
};

export default DashboardContent; 