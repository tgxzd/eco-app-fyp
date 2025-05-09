"use client"; 

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { handleLogout } from "@/lib/actions";

// Define the User type
type User = {
  id?: string;
  name?: string | null;
  email: string;
};

function NavHeader() {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });
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
          // Not authenticated, redirect to login
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

  // Client-side function to handle logout process
  const onLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Call the server action
      const result = await handleLogout();
      if (result.success) {
        router.push('/login');
        router.refresh(); // Force a refresh to update auth state
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Show loading state while fetching user data
  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto flex justify-center py-4">
        <div className="animate-pulse bg-amber-700/30 h-8 w-32 rounded"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      {/* Desktop Navigation */}
      <div className="mb-2 w-24 h-1 bg-amber-700 hidden md:block"></div>
      <div className="w-full flex md:hidden justify-between px-6 py-2 items-center">
        <div className="text-amber-100 font-serif tracking-wide">
          {displayName}
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-amber-700"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Desktop Menu */}
      <div className="relative mx-auto hidden md:flex w-fit px-6 py-2 bg-[#2c2c2c] border-t-2 border-b-2 border-amber-700 items-center">
        <div className="mr-4 pr-4 border-r border-amber-700/30 text-amber-100 font-serif tracking-wide">
          {displayName}
        </div>
        
        <ul
          className="flex items-center"
          onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))}
        >
          <Tab setPosition={setPosition} href="/dashboard">Home</Tab>
          <div className="text-amber-700 self-center mx-1">•</div>
          <Tab setPosition={setPosition} href="/your-report">Your Report</Tab>
          <div className="text-amber-700 self-center mx-1">•</div>
          <Tab setPosition={setPosition} href="/profile">Profile</Tab>
          
          <Cursor position={position} />
        </ul>
        
        <div className="ml-6 pl-6 border-l border-amber-700/30">
          <button 
            onClick={onLogout}
            disabled={isLoggingOut}
            className="flex items-center px-3 py-1.5 text-xs uppercase tracking-widest text-amber-700 font-serif bg-amber-100/10 border border-amber-700 hover:bg-amber-700/20 transition-colors duration-300"
          >
            <LogOut size={14} className="mr-1" />
            {isLoggingOut ? 'Logging out...' : 'Log Out'}
          </button>
        </div>
      </div>
      <div className="mt-2 w-24 h-1 bg-amber-700 hidden md:block"></div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full bg-[#2c2c2c] border-t-2 border-b-2 border-amber-700 md:hidden"
        >
          <div className="flex flex-col items-center py-4">
            <MobileTab href="/dashboard">Home</MobileTab>
            <div className="w-16 h-px bg-amber-700/30 my-2"></div>
            <MobileTab href="/your-report">Your Report</MobileTab>
            <div className="w-16 h-px bg-amber-700/30 my-2"></div>
            <MobileTab href="/profile">Profile</MobileTab>
            <div className="w-16 h-px bg-amber-700/30 my-2"></div>
            <div className="mt-2 w-full flex justify-center">
              <button 
                onClick={onLogout}
                disabled={isLoggingOut}
                className="flex items-center px-4 py-2 text-sm uppercase tracking-widest text-amber-700 font-serif bg-amber-100/10 border border-amber-700 hover:bg-amber-700/20 transition-colors duration-300"
              >
                <LogOut size={16} className="mr-2" />
                {isLoggingOut ? 'Logging out...' : 'Log Out'}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

const Tab = ({
  children,
  setPosition,
  href,
}: {
  children: React.ReactNode;
  setPosition: any;
  href: string;
}) => {
  const ref = useRef<HTMLLIElement>(null);
  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current) return;

        const { width } = ref.current.getBoundingClientRect();
        setPosition({
          width,
          opacity: 1,
          left: ref.current.offsetLeft,
        });
      }}
      className="relative z-10 block cursor-pointer px-3 py-1.5 text-xs uppercase tracking-widest text-amber-100 font-serif md:px-4 md:py-2 md:text-sm"
    >
      <Link href={href}>
        {children}
      </Link>
    </li>
  );
};

const MobileTab = ({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) => {
  return (
    <div className="py-2 text-center">
      <Link
        href={href}
        className="text-amber-100 font-serif uppercase tracking-widest text-sm"
      >
        {children}
      </Link>
    </div>
  );
};

const Cursor = ({ position }: { position: any }) => {
  return (
    <motion.li
      animate={position}
      className="absolute z-0 h-7 rounded-none bg-amber-700/30 md:h-9"
    />
  );
};

export default NavHeader; 