"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import NavHeader from "@/components/ui/nav-header";
import Background from "@/components/Background";
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
      <>
        <Background variant="web3-emerald" />
        <div className="relative min-h-screen flex items-center justify-center z-10">
          <div className="flex items-center space-x-3">
            <svg className="animate-spin h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-white font-light text-lg">Loading...</span>
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return null; // Will redirect to login in useEffect
  }

  return (
    <>
      <Background variant="web3-emerald" />
      <div className="relative min-h-screen z-10">
        <NavHeader />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20 max-w-4xl">
          {/* Header Section */}
          <div className="text-center mb-12 lg:mb-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500/20 backdrop-blur-sm rounded-full mb-8 border border-emerald-500/30">
              <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white mb-6 lg:mb-8 tracking-tight">
              Profile Settings
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-white/70 max-w-3xl mx-auto font-light leading-relaxed px-4">
              Manage your account information and security settings
            </p>
          </div>

          <div className="grid gap-8 lg:gap-12 max-w-3xl mx-auto">
            {/* User Info Display */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-6 sm:p-8 lg:p-10">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-emerald-500/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-emerald-500/30">
                  <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-light text-white">{user.name || 'User'}</h2>
                  <p className="text-white/60 font-light">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Name Update Form */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-6 sm:p-8 lg:p-10">
              <div className="flex items-center mb-6 lg:mb-8">
                <svg className="w-6 h-6 text-emerald-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-light text-white">Update Your Name</h2>
              </div>
              
              <form action={handleNameUpdate} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-base sm:text-lg font-light text-white/80 mb-3">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    defaultValue={user.name || ''}
                    placeholder="Your name"
                    required
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300 text-white placeholder-white/40 font-light"
                  />
                </div>
                
                {nameMessage && (
                  <div className={`p-4 rounded-2xl backdrop-blur-sm border ${
                    nameMessage.type === 'success' 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                      : 'bg-red-500/10 border-red-500/30 text-red-300'
                  }`}>
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-3">
                        {nameMessage.type === 'success' ? (
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <p className="font-medium text-sm">{nameMessage.text}</p>
                    </div>
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isUpdatingName}
                  className="w-full flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-emerald-500/20 text-emerald-300 font-light rounded-2xl hover:bg-emerald-500/30 disabled:bg-white/5 disabled:text-white/30 disabled:cursor-not-allowed transition-all duration-300 backdrop-blur-sm border border-emerald-500/30 hover:border-emerald-500/50 disabled:border-white/10"
                >
                  {isUpdatingName ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    <>
                      <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      Update Name
                    </>
                  )}
                </button>
              </form>
            </div>
            
            {/* Password Update Form */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-6 sm:p-8 lg:p-10">
              <div className="flex items-center mb-6 lg:mb-8">
                <svg className="w-6 h-6 text-emerald-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-light text-white">Change Password</h2>
              </div>
              
              <form id="password-form" action={handlePasswordUpdate} className="space-y-6">
                <div>
                  <label htmlFor="currentPassword" className="block text-base sm:text-lg font-light text-white/80 mb-3">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    placeholder="Your current password"
                    required
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300 text-white placeholder-white/40 font-light"
                  />
                </div>
                
                <div>
                  <label htmlFor="newPassword" className="block text-base sm:text-lg font-light text-white/80 mb-3">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    placeholder="New password"
                    required
                    minLength={6}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300 text-white placeholder-white/40 font-light"
                  />
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-base sm:text-lg font-light text-white/80 mb-3">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    required
                    minLength={6}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300 text-white placeholder-white/40 font-light"
                  />
                </div>
                
                {passwordMessage && (
                  <div className={`p-4 rounded-2xl backdrop-blur-sm border ${
                    passwordMessage.type === 'success' 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                      : 'bg-red-500/10 border-red-500/30 text-red-300'
                  }`}>
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-3">
                        {passwordMessage.type === 'success' ? (
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <p className="font-medium text-sm">{passwordMessage.text}</p>
                    </div>
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="w-full flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-emerald-500/20 text-emerald-300 font-light rounded-2xl hover:bg-emerald-500/30 disabled:bg-white/5 disabled:text-white/30 disabled:cursor-not-allowed transition-all duration-300 backdrop-blur-sm border border-emerald-500/30 hover:border-emerald-500/50 disabled:border-white/10"
                >
                  {isUpdatingPassword ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    <>
                      <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Change Password
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 