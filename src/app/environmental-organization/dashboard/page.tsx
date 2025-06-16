'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { logoutOrganization } from '../action';
import Background from '@/components/Background';
import Link from 'next/link';

interface OrganizationInfo {
  id: string;
  organizationName: string;
  email: string;
  phoneNumber: string;
}

export default function DashboardPage() {
  const [organizationInfo, setOrganizationInfo] = useState<OrganizationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Fetch organization info
    const fetchOrganizationInfo = async () => {
      try {
        const response = await fetch('/api/organization/profile');
        const data = await response.json();
        
        if (data.success) {
          setOrganizationInfo(data.organization);
        } else {
          console.error('Failed to fetch organization info:', data.error);
        }
      } catch (error) {
        console.error('Error fetching organization info:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganizationInfo();
  }, []);

  const handleLogout = async () => {
    const result = await logoutOrganization();
    if (result.success) {
      router.replace('/environmental-organization/login');
    }
  };

  return (
    <>
      <Background variant="web3-emerald" />
      <div className="min-h-screen relative z-10">
        {/* Header */}
        <header className="bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:py-6 space-y-4 sm:space-y-0">
              {/* Logo and Title */}
              <div className="flex items-center space-x-3 sm:space-x-4">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="h-6 w-6 sm:h-8 sm:w-8 relative">
                    <div className="absolute inset-0 bg-emerald-500 rounded-full opacity-70"></div>
                    <div className="absolute inset-0 border border-emerald-400 rounded-full"></div>
                    <div className="absolute inset-[2px] border-2 border-dashed border-emerald-300/30 rounded-full"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-[2px] sm:w-[3px] h-3 sm:h-4 bg-white/80 rounded-full"></div>
                    </div>
                  </div>
                  <span className="text-base sm:text-lg font-medium font-poppins leading-none">
                    <span className="text-white">Enviro</span><span className="text-emerald-400">Connect</span>
                  </span>
                </Link>
                <div className="h-4 sm:h-6 w-px bg-white/20"></div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-light text-white">
                  Organization Dashboard
                </h1>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center px-3 sm:px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-light rounded-xl sm:rounded-2xl transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/30 text-sm sm:text-base"
              >
                <svg className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          {/* Welcome Section */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500/20 backdrop-blur-sm rounded-full mb-4 sm:mb-6 border border-emerald-500/30 shadow-lg">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-3 sm:mb-4 tracking-tight px-4">
              Welcome Back
            </h2>
            <p className="text-base sm:text-lg text-white/70 font-light leading-relaxed max-w-2xl mx-auto px-4">
              Manage your environmental organization and track your impact
            </p>
          </div>

          {/* Organization Information Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/20 shadow-2xl shadow-black/20 overflow-hidden mb-6 sm:mb-8">
            <div className="px-6 sm:px-8 lg:px-10 pt-6 sm:pt-8 pb-4 sm:pb-6 border-b border-white/10">
              <h3 className="text-xl sm:text-2xl font-light text-white mb-2">Organization Information</h3>
              <p className="text-white/60 font-light text-sm sm:text-base">Your organization details and contact information</p>
            </div>
            
            <div className="px-6 sm:px-8 lg:px-10 py-6 sm:py-8">
              {isLoading ? (
                <div className="flex items-center justify-center py-6 sm:py-8">
                  <div className="flex items-center space-x-3">
                    <svg className="animate-spin h-5 w-5 sm:h-6 sm:w-6 text-emerald-400" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-white/70 font-light text-sm sm:text-base">Loading organization information...</span>
                  </div>
                </div>
              ) : organizationInfo ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white/60">Organization Name</label>
                    <p className="text-base sm:text-lg text-white font-light break-words">{organizationInfo.organizationName}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white/60">Email Address</label>
                    <p className="text-base sm:text-lg text-white font-light break-all">{organizationInfo.email}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white/60">Phone Number</label>
                    <p className="text-base sm:text-lg text-white font-light">{organizationInfo.phoneNumber}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white/60">Organization ID</label>
                    <p className="text-sm sm:text-base text-white/50 font-light font-mono break-all">{organizationInfo.id}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <p className="text-white/60 font-light text-sm sm:text-base">Failed to load organization information</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/20 shadow-2xl shadow-black/20 overflow-hidden max-w-3xl mx-auto">
            <div className="px-6 sm:px-8 lg:px-10 pt-6 sm:pt-8 pb-4 sm:pb-6 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-light text-white">Quick Actions</h3>
                  <p className="text-white/60 font-light text-xs sm:text-sm">Manage your organization</p>
                </div>
              </div>
            </div>
            
            <div className="px-6 sm:px-8 lg:px-10 py-6 sm:py-8 space-y-3 sm:space-y-4">
              <button 
                onClick={() => router.push('/environmental-organization/dashboard/view-reports')}
                className="w-full flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-emerald-500/20 text-emerald-300 font-light rounded-xl sm:rounded-2xl hover:bg-emerald-500/30 transition-all duration-300 backdrop-blur-sm border border-emerald-500/30 hover:border-emerald-500/50 group"
              >
                <div className="flex items-center">
                  <svg className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm sm:text-base">View Reports</span>
                </div>
                <svg className="h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              <button 
                onClick={() => router.push('/environmental-organization/dashboard/manage-profile')}
                className="w-full flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-white/10 text-white font-light rounded-xl sm:rounded-2xl hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/30 group"
              >
                <div className="flex items-center">
                  <svg className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-sm sm:text-base">Manage Profile</span>
                </div>
                <svg className="h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
