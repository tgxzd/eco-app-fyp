"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import NavHeader from "@/components/ui/nav-header";
import { updateName, updatePassword } from "./action";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name?: string; email: string } | null>(null);
  const [nameMessage, setNameMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data on component mount
  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();
        
        if (data.success && data.isAuthenticated && data.user) {
          setUser(data.user);
        } else {
          // Redirect to login if not authenticated
          router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchUserData();
  }, [router]);

  // Handle name update form submission
  async function handleNameUpdate(formData: FormData) {
    setIsUpdatingName(true);
    setNameMessage(null);
    
    try {
      const result = await updateName(formData);
      
      if (result.error) {
        setNameMessage({ type: 'error', text: result.error });
      } else if (result.success) {
        setNameMessage({ type: 'success', text: result.message || 'Name updated successfully' });
        // Refresh user data
        const response = await fetch('/api/auth/session');
        const data = await response.json();
        if (data.success && data.user) {
          setUser(data.user);
        }
      }
    } catch {
      setNameMessage({ type: 'error', text: 'An error occurred while updating your name' });
    } finally {
      setIsUpdatingName(false);
    }
  }

  // Handle password update form submission
  async function handlePasswordUpdate(formData: FormData) {
    setIsUpdatingPassword(true);
    setPasswordMessage(null);
    
    try {
      const result = await updatePassword(formData);
      
      if (result.error) {
        setPasswordMessage({ type: 'error', text: result.error });
      } else if (result.success) {
        setPasswordMessage({ type: 'success', text: result.message || 'Password updated successfully' });
        // Reset the form
        (document.getElementById('password-form') as HTMLFormElement).reset();
      }
    } catch {
      setPasswordMessage({ type: 'error', text: 'An error occurred while updating your password' });
    } finally {
      setIsUpdatingPassword(false);
    }
  }

  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-amber-100">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login in useEffect
  }

  return (
    <div className="relative min-h-screen bg-[#121212]">
      {/* Wallpaper Background with overlay */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/wallpaper4.jpg"
          alt="Wallpaper background"
          fill
          className="object-cover opacity-60"
          quality={100}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center">
        <header className="w-full py-4 md:py-8 bg-black/50 border-b border-amber-700/30">
          <NavHeader />
        </header>
        
        <div className="flex flex-col items-center justify-center flex-grow px-4 py-8 md:py-12 w-full max-w-xl mx-auto">
          <h1 className="text-amber-100 font-serif text-3xl mb-8 tracking-wide text-center">Profile Settings</h1>
          
          {/* Name Update Form */}
          <div className="w-full mb-8 px-6 py-6 bg-black/40 border border-amber-700/50">
            <h2 className="text-amber-100 font-serif text-xl mb-4 tracking-wide">Update Your Name</h2>
            
            <form action={handleNameUpdate} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-amber-200 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  defaultValue={user.name || ''}
                  placeholder="Your name"
                  required
                  className="w-full px-3 py-2 bg-black/70 border border-amber-700/50 text-amber-100 placeholder-amber-100/50 focus:outline-none focus:ring-1 focus:ring-amber-700"
                />
              </div>
              
              {nameMessage && (
                <div className={`text-sm ${nameMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                  {nameMessage.text}
                </div>
              )}
              
              <button
                type="submit"
                disabled={isUpdatingName}
                className="px-4 py-2 bg-amber-700/30 text-amber-100 font-serif uppercase tracking-widest text-sm border border-amber-700 hover:bg-amber-700/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdatingName ? 'Updating...' : 'Update Name'}
              </button>
            </form>
          </div>
          
          {/* Password Update Form */}
          <div className="w-full px-6 py-6 bg-black/40 border border-amber-700/50">
            <h2 className="text-amber-100 font-serif text-xl mb-4 tracking-wide">Change Password</h2>
            
            <form id="password-form" action={handlePasswordUpdate} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-amber-200 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  placeholder="Your current password"
                  required
                  className="w-full px-3 py-2 bg-black/70 border border-amber-700/50 text-amber-100 placeholder-amber-100/50 focus:outline-none focus:ring-1 focus:ring-amber-700"
                />
              </div>
              
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-amber-200 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  placeholder="New password"
                  required
                  minLength={6}
                  className="w-full px-3 py-2 bg-black/70 border border-amber-700/50 text-amber-100 placeholder-amber-100/50 focus:outline-none focus:ring-1 focus:ring-amber-700"
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-amber-200 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  required
                  minLength={6}
                  className="w-full px-3 py-2 bg-black/70 border border-amber-700/50 text-amber-100 placeholder-amber-100/50 focus:outline-none focus:ring-1 focus:ring-amber-700"
                />
              </div>
              
              {passwordMessage && (
                <div className={`text-sm ${passwordMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                  {passwordMessage.text}
                </div>
              )}
              
              <button
                type="submit"
                disabled={isUpdatingPassword}
                className="px-4 py-2 bg-amber-700/30 text-amber-100 font-serif uppercase tracking-widest text-sm border border-amber-700 hover:bg-amber-700/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdatingPassword ? 'Updating...' : 'Change Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 