"use client"; 

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { handleLogout } from '@/app/server/actions';

// Define the User type
type User = {
  user_id: string;
  email: string;
  name: string | null;
};

function NavHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    async function fetchUserSession() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/auth/session');
        const data = await response.json();
        
        if (data.success && data.isAuthenticated && data.user) {
          setUser(data.user);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching user session:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchUserSession();
  }, [router]);
  
  const displayName = user?.name || user?.email || '';

  const onLogout = async () => {
    setIsLoggingOut(true);
    try {
      const result = await handleLogout();
      if (result.success) {
        router.push('/login');
        router.refresh();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto flex justify-center py-8">
        <div className="animate-pulse bg-gray-300 h-6 w-32 rounded"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Desktop Navigation */}
      <div className="flex items-center justify-between">
        {/* Logo/Brand */}
        <Link href="/dashboard" className="text-lg sm:text-xl font-light text-white">
          <span className="text-white">Enviro</span><span className="text-emerald-400">Connect</span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            href="/dashboard" 
            className="text-gray-300 hover:text-white transition-colors duration-200 font-light"
          >
            Dashboard
          </Link>
          <Link 
            href="/your-report" 
            className="text-gray-300 hover:text-white transition-colors duration-200 font-light"
          >
            Reports
          </Link>
          <Link 
            href="/profile" 
            className="text-gray-300 hover:text-white transition-colors duration-200 font-light"
          >
            Profile
          </Link>
        </nav>

        {/* User Section */}
        <div className="hidden md:flex items-center space-x-6">
          <span className="text-gray-400 text-sm font-light">
            {displayName}
          </span>
          <button 
            onClick={onLogout}
            disabled={isLoggingOut}
            className="flex items-center text-gray-400 hover:text-white transition-colors duration-200 text-sm font-light"
          >
            <LogOut size={16} className="mr-2" />
            {isLoggingOut ? 'Signing out...' : 'Sign out'}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-300"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="md:hidden mt-6 pt-6 border-t border-gray-700"
        >
          <div className="space-y-4">
            <div className="text-gray-400 text-sm font-light mb-4">
              {displayName}
            </div>
            
            <Link 
              href="/dashboard"
              className="block text-gray-300 hover:text-white transition-colors duration-200 font-light"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              href="/your-report"
              className="block text-gray-300 hover:text-white transition-colors duration-200 font-light"
              onClick={() => setMobileMenuOpen(false)}
            >
              Reports
            </Link>
            <Link 
              href="/profile"
              className="block text-gray-300 hover:text-white transition-colors duration-200 font-light"
              onClick={() => setMobileMenuOpen(false)}
            >
              Profile
            </Link>
            
            <button 
              onClick={onLogout}
              disabled={isLoggingOut}
              className="flex items-center text-gray-400 hover:text-white transition-colors duration-200 text-sm font-light mt-4"
            >
              <LogOut size={16} className="mr-2" />
              {isLoggingOut ? 'Signing out...' : 'Sign out'}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default NavHeader; 