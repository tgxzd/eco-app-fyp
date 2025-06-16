'use client';

import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import { Globe } from './globe';
import { COBEOptions } from 'cobe';

interface HeroProps {
  variant?: 'light' | 'dark';
}

const ENVIRONMENTAL_GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 1,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 0.8,
  baseColor: [0.3, 0.3, 0.3],
  markerColor: [16/255, 185/255, 129/255], // Emerald color
  glowColor: [16/255, 185/255, 129/255], // Emerald glow
  markers: [
    { location: [14.5995, 120.9842], size: 0.04 }, // Philippines
    { location: [19.076, 72.8777], size: 0.06 }, // Mumbai, India
    { location: [23.8103, 90.4125], size: 0.05 }, // Bangladesh
    { location: [-15.7975, -47.8919], size: 0.08 }, // Brazil (Amazon)
    { location: [39.9042, 116.4074], size: 0.07 }, // Beijing, China
    { location: [-23.5505, -46.6333], size: 0.06 }, // São Paulo, Brazil
    { location: [40.7128, -74.006], size: 0.05 }, // New York, USA
    { location: [51.5074, -0.1278], size: 0.04 }, // London, UK
    { location: [35.6762, 139.6503], size: 0.05 }, // Tokyo, Japan
    { location: [-33.8688, 151.2093], size: 0.04 }, // Sydney, Australia
  ],
};

const Hero = ({ variant = 'dark' }: HeroProps) => {
  const fadeIn: Variants = {
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
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const textColor = variant === 'dark' ? 'text-white' : 'text-gray-900';
  const subtextColor = variant === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const accentColor = variant === 'dark' ? 'text-emerald-400' : 'text-emerald-600';

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-start lg:items-center justify-start lg:justify-center px-4 sm:px-6 pt-20 sm:pt-24 lg:pt-16">
      {/* Mobile Globe - Positioned at the top */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.75 }}
        className="block lg:hidden w-full mb-4 mt-8"
      >
        <div className="relative h-[220px] sm:h-[240px]">
          <div className="absolute left-0 right-0 mx-auto w-[260px] sm:w-[300px]">
            <Globe 
              className="opacity-90" 
              config={{
                ...ENVIRONMENTAL_GLOBE_CONFIG,
                width: 600,
                height: 600,
              }}
            />
          </div>
        </div>
      </motion.div>
      
      <motion.div
        className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-0 lg:gap-12 items-start lg:items-center mt-0 lg:mt-0"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        {/* Text Content */}
        <div className="space-y-6 md:space-y-8 text-center lg:text-left mt-0 lg:mt-0">
          {/* Main Title */}
          <motion.div variants={fadeIn} className="space-y-4">
            <h1 className={`text-5xl md:text-7xl font-light tracking-tight font-poppins`}>
              <span className={textColor}>Enviro</span><span className="text-emerald-500">Connect</span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.div variants={fadeIn}>
            <p className={`text-xl md:text-2xl font-light ${subtextColor} max-w-2xl mx-auto lg:mx-0 leading-relaxed font-poppins`}>
            Your actions matters. Together, we take action for a cleaner planet.
            </p>
          </motion.div>

          {/* Main Actions */}
          <motion.div variants={fadeIn} className="space-y-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start max-w-sm mx-auto lg:mx-0">
              <Link 
                href="/register"
                className={`px-8 py-3 bg-emerald-500 ${variant === 'dark' ? 'text-white' : 'text-white'} font-medium rounded-md hover:bg-emerald-600 transition-colors duration-200 font-poppins`}
              >
                Get Started
              </Link>
              
              <Link 
                href="/login"
                className={`px-8 py-3 border ${variant === 'dark' ? 'border-gray-600 text-gray-300 hover:border-gray-500' : 'border-gray-300 text-gray-700 hover:border-gray-400'} font-medium rounded-md transition-colors duration-200 font-poppins`}
              >
                Sign In
              </Link>
            </div>

            {/* Secondary Links */}
            <div className="flex flex-col sm:flex-row gap-8 justify-center lg:justify-start text-sm">
              <Link 
                href="/environmental-organization/login"
                className={`${subtextColor} hover:${accentColor} transition-colors duration-200 font-medium font-poppins`}
              >
                Organizations →
              </Link>
              
              <Link 
                href="/admin/login"
                className={`${subtextColor} hover:${accentColor} transition-colors duration-200 font-medium font-poppins`}
              >
                Admin →
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Desktop Globe Section */}
        <motion.div 
          variants={fadeIn}
          className="hidden lg:block w-full order-last"
        >
          <div className="relative">
            <div className="relative translate-x-8 -translate-y-16 -mt-70">
              <Globe 
                className="opacity-80" 
                config={ENVIRONMENTAL_GLOBE_CONFIG}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Hero; 