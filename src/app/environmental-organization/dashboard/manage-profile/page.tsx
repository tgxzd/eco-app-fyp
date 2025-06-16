'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Background from '@/components/Background';
import Link from 'next/link';

interface OrganizationInfo {
  id: string;
  organizationName: string;
  email: string;
  phoneNumber: string;
  category?: string;
}

export default function ManageProfilePage() {
  const [organizationInfo, setOrganizationInfo] = useState<OrganizationInfo | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchOrganizationInfo();
  }, []);

  const fetchOrganizationInfo = async () => {
    try {
      const response = await fetch('/api/organization/profile');
      const data = await response.json();
      
      if (data.success) {
        setOrganizationInfo(data.organization);
      } else {
        setError(data.error || 'Failed to fetch organization info');
      }
    } catch {
      setError('Error fetching organization information');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSaving(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch('/api/organization/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organizationName: formData.get('organizationName'),
          email: formData.get('email'),
          phoneNumber: formData.get('phoneNumber'),
          category: formData.get('category'),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Profile updated successfully');
        setOrganizationInfo(data.organization);
        setIsEditing(false);
      } else {
        setError(data.error || 'Failed to update profile');
      }
    } catch {
      setError('An error occurred while updating profile');
    } finally {
      setIsSaving(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'air pollution':
        return '🌫️';
      case 'water pollution':
        return '💧';
      case 'wildfire':
        return '🔥';
      default:
        return '🌍';
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
                  Manage Profile
                </h1>
              </div>

              {/* Back Button */}
              <button
                onClick={() => router.push('/environmental-organization/dashboard')}
                className="w-full sm:w-auto flex items-center justify-center px-3 sm:px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-light rounded-xl sm:rounded-2xl transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/30 text-sm sm:text-base"
              >
                <svg className="mr-2 h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500/20 backdrop-blur-sm rounded-full mb-4 sm:mb-6 border border-emerald-500/30 shadow-lg">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-3 sm:mb-4 tracking-tight px-4">
              Organization Profile
            </h2>
            <p className="text-base sm:text-lg text-white/70 font-light leading-relaxed max-w-2xl mx-auto px-4">
              Manage your organization's information and settings
            </p>
          </div>

          {/* Alert Messages */}
          {error && (
            <div className="mb-6 sm:mb-8 p-3 sm:p-4 rounded-xl sm:rounded-2xl backdrop-blur-sm border bg-red-500/10 border-red-500/30 text-red-300 shadow-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-2 sm:mr-3">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="font-medium text-xs sm:text-sm">{error}</p>
              </div>
            </div>
          )}
          
          {success && (
            <div className="mb-6 sm:mb-8 p-3 sm:p-4 rounded-xl sm:rounded-2xl backdrop-blur-sm border bg-green-500/10 border-green-500/30 text-green-300 shadow-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-2 sm:mr-3">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="font-medium text-xs sm:text-sm">{success}</p>
              </div>
            </div>
          )}

          {/* Profile Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/20 shadow-2xl shadow-black/20 overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-12 sm:py-16">
                <div className="flex items-center space-x-3">
                  <svg className="animate-spin h-5 w-5 sm:h-6 sm:w-6 text-emerald-400" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-white/70 font-light text-sm sm:text-base">Loading profile information...</span>
                </div>
              </div>
            ) : organizationInfo ? (
              <>
                {/* Header Section */}
                <div className="px-6 sm:px-8 lg:px-10 pt-6 sm:pt-8 pb-4 sm:pb-6 border-b border-white/10">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-light text-white mb-1 sm:mb-2">Profile Information</h3>
                      <p className="text-white/60 font-light text-sm sm:text-base">Update your organization details</p>
                    </div>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="w-full sm:w-auto flex items-center justify-center px-3 sm:px-4 py-2 bg-emerald-500/20 text-emerald-300 font-light rounded-xl sm:rounded-2xl hover:bg-emerald-500/30 transition-all duration-300 backdrop-blur-sm border border-emerald-500/30 hover:border-emerald-500/50 text-sm sm:text-base"
                      >
                        <svg className="mr-2 h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>

                {/* Form Section */}
                <div className="px-6 sm:px-8 lg:px-10 py-6 sm:py-8">
                  {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <label htmlFor="organizationName" className="block text-sm font-medium text-white/80 mb-2">
                            Organization Name *
                          </label>
                          <input
                            type="text"
                            id="organizationName"
                            name="organizationName"
                            defaultValue={organizationInfo.organizationName}
                            required
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 backdrop-blur-sm transition-all duration-300 text-sm sm:text-base"
                            placeholder="Enter organization name"
                          />
                        </div>

                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            defaultValue={organizationInfo.email}
                            required
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 backdrop-blur-sm transition-all duration-300 text-sm sm:text-base"
                            placeholder="Enter email address"
                          />
                        </div>

                        <div>
                          <label htmlFor="phoneNumber" className="block text-sm font-medium text-white/80 mb-2">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            defaultValue={organizationInfo.phoneNumber}
                            required
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 backdrop-blur-sm transition-all duration-300 text-sm sm:text-base"
                            placeholder="Enter phone number"
                          />
                        </div>

                        <div>
                          <label htmlFor="category" className="block text-sm font-medium text-white/80 mb-2">
                            Focus Area *
                          </label>
                          <select
                            id="category"
                            name="category"
                            defaultValue={organizationInfo.category || ''}
                            required
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 backdrop-blur-sm transition-all duration-300 text-sm sm:text-base"
                          >
                            <option value="" disabled className="bg-gray-900">Select focus area</option>
                            <option value="air pollution" className="bg-gray-900">🌫️ Air Pollution</option>
                            <option value="water pollution" className="bg-gray-900">💧 Water Pollution</option>
                            <option value="wildfire" className="bg-gray-900">🔥 Wildfire</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4 sm:pt-6">
                        <button
                          type="submit"
                          disabled={isSaving}
                          className="w-full sm:flex-1 flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-emerald-500/20 text-emerald-300 font-light rounded-xl sm:rounded-2xl hover:bg-emerald-500/30 disabled:bg-white/5 disabled:text-white/30 disabled:cursor-not-allowed transition-all duration-300 backdrop-blur-sm border border-emerald-500/30 hover:border-emerald-500/50 text-sm sm:text-base"
                        >
                          {isSaving ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-emerald-300" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Saving...
                            </>
                          ) : (
                            <>
                              <svg className="mr-2 h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                              </svg>
                              Save Changes
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditing(false);
                            setError(null);
                            setSuccess(null);
                          }}
                          className="w-full sm:w-auto flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-white/10 text-white font-light rounded-xl sm:rounded-2xl hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/30 text-sm sm:text-base"
                        >
                          <svg className="mr-2 h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <label className="block text-xs sm:text-sm font-medium text-white/60">Organization Name</label>
                        <p className="text-base sm:text-lg text-white font-light break-words">{organizationInfo.organizationName}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs sm:text-sm font-medium text-white/60">Email Address</label>
                        <p className="text-base sm:text-lg text-white font-light break-all">{organizationInfo.email}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs sm:text-sm font-medium text-white/60">Phone Number</label>
                        <p className="text-base sm:text-lg text-white font-light">{organizationInfo.phoneNumber}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs sm:text-sm font-medium text-white/60">Focus Area</label>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getCategoryIcon(organizationInfo.category || '')}</span>
                          <span className="text-base sm:text-lg text-white font-light">
                            {organizationInfo.category || 'Not specified'}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2 lg:col-span-2">
                        <label className="block text-xs sm:text-sm font-medium text-white/60">Organization ID</label>
                        <p className="text-sm sm:text-base text-white/50 font-light font-mono break-all">{organizationInfo.id}</p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-12 sm:py-16">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-light text-white mb-3 sm:mb-4">Failed to Load Profile</h3>
                <p className="text-white/60 font-light mb-6 sm:mb-8 text-sm sm:text-base px-4">Unable to load organization profile information</p>
                <button
                  onClick={fetchOrganizationInfo}
                  className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-emerald-500/20 text-emerald-300 font-light rounded-xl sm:rounded-2xl hover:bg-emerald-500/30 transition-all duration-300 backdrop-blur-sm border border-emerald-500/30 hover:border-emerald-500/50 text-sm sm:text-base"
                >
                  <svg className="mr-2 h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Try Again
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
} 