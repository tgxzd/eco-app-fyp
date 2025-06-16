'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface NavbarProps {
  variant?: 'light' | 'dark';
}

const Navbar = ({ variant = 'dark' }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const textColor = variant === 'dark' ? 'text-white' : 'text-gray-900';
  const subtextColor = variant === 'dark' ? 'text-gray-300' : 'text-gray-600';
  
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-4 transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-sm' : 'bg-transparent'
      }`}
    >
      {/* Broken/lined emerald accent */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
        <div className="flex w-full">
          <motion.div 
            className="h-[2px] w-1/5 bg-emerald-500"
            initial={{ opacity: 0.4 }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          ></motion.div>
          <motion.div 
            className="h-[2px] w-[10%] bg-transparent"
          ></motion.div>
          <motion.div 
            className="h-[2px] w-1/6 bg-emerald-600"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          ></motion.div>
          <motion.div 
            className="h-[2px] w-1/12 bg-transparent"
          ></motion.div>
          <motion.div 
            className="h-[2px] w-1/4 bg-emerald-400"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          ></motion.div>
          <motion.div 
            className="h-[2px] w-[10%] bg-transparent"
          ></motion.div>
          <motion.div 
            className="h-[2px] w-1/6 bg-emerald-500"
            initial={{ opacity: 0.4 }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
          ></motion.div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 relative">
            <div className="absolute inset-0 bg-emerald-500 rounded-full opacity-70"></div>
            <div className="absolute inset-0 border border-emerald-400 rounded-full"></div>
            <div className="absolute inset-[2px] border-2 border-dashed border-emerald-300/30 rounded-full"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[3px] h-4 bg-white/80 rounded-full"></div>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-medium font-poppins leading-none">
              <span className={textColor}>Enviro</span><span className="text-emerald-500">Connect</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link 
            href="/login" 
            className={`${subtextColor} hover:text-emerald-400 transition-colors duration-200 font-poppins`}
          >
            Sign In
          </Link>
          <Link 
            href="/register" 
            className="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600 transition-colors duration-200 font-poppins"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-black/95 backdrop-blur-sm mt-4 rounded-lg overflow-hidden"
        >
          <div className="px-4 py-5 space-y-4 flex flex-col">
            <Link 
              href="/login" 
              className="text-gray-300 hover:text-emerald-400 py-2 transition-colors duration-200 font-poppins border-b border-gray-800"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign In
            </Link>
            <Link 
              href="/register" 
              className="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600 transition-colors duration-200 font-poppins text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar; 