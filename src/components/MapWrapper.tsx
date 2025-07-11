'use client';

import GoogleMap from './GoogleMap';
import { useLocation } from '@/contexts/LocationContext';
import { motion, Variants } from 'framer-motion';

export interface ReportLocation {
  report_id: string;
  category: string;
  status: string;
  description: string;
  location_id: string;
  latitude: number;
  longitude: number;
  address: string;
  imagePath?: string | null;
  createdAt?: string;
}

interface MapWrapperProps {
  apiKey: string;
  reportLocations?: ReportLocation[];
}

export default function MapWrapper({ apiKey, reportLocations = [] }: MapWrapperProps) {
  const { location, isLoading, error } = useLocation();

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        delay: 0.2,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const headerVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.5, 
        delay: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const legendVariants: Variants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.5, 
        delay: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const mapVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.6, 
        delay: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const infoBarVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        delay: 1.0,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative group"
    >
      {/* Animated background glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 rounded-xl sm:rounded-2xl lg:rounded-3xl blur-lg sm:blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse"></div>
      
      {/* Main container with glass morphism */}
      <div className="relative bg-black/30 backdrop-blur-xl border border-emerald-500/20 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl">
        {/* Header with animated elements */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
          <motion.div 
            variants={headerVariants}
            initial="hidden"
            animate="visible"
            className="flex items-center gap-2 sm:gap-3"
          >
            {/* Animated map icon */}
            <div className="relative">
              <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center shadow-lg">
                <svg className="w-3 h-3 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-emerald-400 rounded-full animate-ping"></div>
            </div>
            <h2 className="text-white font-poppins text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Interactive Map
            </h2>
          </motion.div>
          
          {/* Enhanced Legend */}
          <motion.div 
            variants={legendVariants}
            initial="hidden"
            animate="visible"
            className="flex items-center gap-2 sm:gap-4 px-3 sm:px-4 py-2 bg-black/40 backdrop-blur-sm rounded-full border border-emerald-500/30 shadow-lg w-full sm:w-auto justify-center sm:justify-start"
          >
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="relative">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-red-500 to-red-600 shadow-lg"></div>
                <div className="absolute inset-0 w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500 animate-ping opacity-30"></div>
              </div>
              <span className="text-red-400 text-xs sm:text-sm font-medium font-poppins">Reports</span>
            </div>
            <div className="w-px h-3 sm:h-4 bg-emerald-500/30"></div>
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="relative">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg"></div>
                <div className="absolute inset-0 w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-emerald-500 animate-pulse opacity-50"></div>
              </div>
              <span className="text-emerald-400 text-xs sm:text-sm font-medium font-poppins">You</span>
            </div>
          </motion.div>
        </div>
        
        {/* Map container with enhanced styling */}
        <motion.div 
          variants={mapVariants}
          initial="hidden"
          animate="visible"
          className="relative overflow-hidden rounded-lg sm:rounded-xl lg:rounded-2xl"
        >
          {/* Decorative corner elements - responsive */}
          <div className="absolute top-0 left-0 w-10 h-10 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-br-full z-10"></div>
          <div className="absolute top-0 right-0 w-10 h-10 sm:w-20 sm:h-20 bg-gradient-to-bl from-teal-500/20 to-transparent rounded-bl-full z-10"></div>
          <div className="absolute bottom-0 left-0 w-10 h-10 sm:w-20 sm:h-20 bg-gradient-to-tr from-emerald-500/20 to-transparent rounded-tr-full z-10"></div>
          <div className="absolute bottom-0 right-0 w-10 h-10 sm:w-20 sm:h-20 bg-gradient-to-tl from-teal-500/20 to-transparent rounded-tl-full z-10"></div>
          
          {isLoading ? (
            <div className="w-full h-[280px] sm:h-[350px] md:h-[400px] lg:h-[450px] xl:h-[500px] bg-gradient-to-br from-black/60 to-emerald-900/20 backdrop-blur-sm border border-emerald-500/30 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center relative overflow-hidden">
              {/* Animated loading background */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent animate-pulse"></div>
              <div className="relative z-10 text-center px-4">
                <div className="w-8 h-8 sm:w-12 sm:h-12 border-2 sm:border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-3 sm:mb-4"></div>
                <p className="text-emerald-400 font-poppins text-base sm:text-lg font-medium">Loading your map...</p>
                <p className="text-emerald-300/70 font-poppins text-xs sm:text-sm mt-1 sm:mt-2">Preparing environmental data</p>
              </div>
            </div>
          ) : error ? (
            <div className="w-full h-[280px] sm:h-[350px] md:h-[400px] lg:h-[450px] xl:h-[500px] bg-gradient-to-br from-black/60 to-red-900/20 backdrop-blur-sm border border-red-500/30 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center relative overflow-hidden">
              <div className="relative z-10 text-center px-4 sm:px-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <p className="text-red-400 font-poppins text-base sm:text-lg font-medium mb-1 sm:mb-2">Map Unavailable</p>
                <p className="text-red-300/70 font-poppins text-xs sm:text-sm leading-relaxed">{error}</p>
              </div>
            </div>
          ) : (
            <div className="relative">
              {/* Map overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none z-10 rounded-lg sm:rounded-xl lg:rounded-2xl"></div>
              <GoogleMap 
                apiKey={apiKey} 
                reportLocations={reportLocations}
                initialLocation={location ? {
                  lat: location.latitude,
                  lng: location.longitude
                } : undefined}
              />
            </div>
          )}
        </motion.div>
        
        {/* Bottom info bar */}
        <motion.div 
          variants={infoBarVariants}
          initial="hidden"
          animate="visible"
          className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm space-y-2 sm:space-y-0"
        >
          <div className="flex items-center gap-2 text-emerald-300/70 font-poppins">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span>Live environmental data</span>
          </div>
          <div className="text-emerald-300/50 font-poppins">
            {reportLocations.length} active report{reportLocations.length !== 1 ? 's' : ''}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
} 