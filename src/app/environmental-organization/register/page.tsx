'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerOrganization } from '../action';
import Link from 'next/link';
import Background from '@/components/Background';

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);
    
    const result = await registerOrganization(formData);
    
    if (result.error) {
      setError(result.error);
    } else if (result.pending) {
      setIsSubmitted(true);
    } else {
      // Fallback - shouldn't happen with new flow
      router.push('/environmental-organization/dashboard');
    }
    
    setIsLoading(false);
  }

  // Show success message if submitted and pending approval
  if (isSubmitted) {
    return (
      <>
        <Background variant="web3-emerald" />
        <div className="min-h-screen flex items-center justify-center relative z-10 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="w-full max-w-md sm:max-w-lg">
            {/* EnviroConnect Branding */}
            <div className="text-center mb-6 sm:mb-10">
              <Link href="/" className="inline-flex items-center justify-center space-x-2 sm:space-x-3 mb-6 sm:mb-8 group">
                <div className="h-8 w-8 sm:h-10 sm:w-10 relative transition-transform duration-300 group-hover:scale-110">
                  <div className="absolute inset-0 bg-emerald-500 rounded-full opacity-70 group-hover:opacity-80 transition-opacity"></div>
                  <div className="absolute inset-0 border border-emerald-400 rounded-full"></div>
                  <div className="absolute inset-[2px] border-2 border-dashed border-emerald-300/30 rounded-full"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[3px] h-4 sm:h-5 bg-white/80 rounded-full"></div>
                  </div>
                </div>
                <span className="text-lg sm:text-2xl font-medium font-poppins leading-none">
                  <span className="text-white">Enviro</span><span className="text-emerald-400">Connect</span>
                </span>
              </Link>
              <div className="w-24 sm:w-32 h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent mx-auto mb-6 sm:mb-8"></div>
            </div>

            {/* Success Card */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/20 shadow-2xl shadow-black/20 overflow-hidden">
              <div className="px-6 sm:px-8 lg:px-10 py-8 sm:py-10 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-emerald-500/20 backdrop-blur-sm rounded-full mb-6 border border-emerald-500/30 shadow-lg">
                  <svg className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-4 tracking-tight">
                  Application Submitted!
                </h1>
                <p className="text-base sm:text-lg text-white/70 font-light leading-relaxed mb-8">
                  Thank you for your registration. Your application is now being reviewed by our administrators.
                </p>
                <div className="bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/30 rounded-xl p-4 mb-8">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-emerald-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h3 className="text-emerald-300 font-medium text-sm mb-1">What happens next?</h3>
                      <p className="text-emerald-200/80 text-sm leading-relaxed">
                        You will receive an email notification once your application has been approved. 
                        You can then log in and start using the platform.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link 
                    href="/"
                    className="flex-1 flex items-center justify-center px-4 py-3 bg-emerald-500/20 text-emerald-300 font-light rounded-xl hover:bg-emerald-500/30 transition-all duration-300 backdrop-blur-sm border border-emerald-500/30 hover:border-emerald-500/50 text-sm"
                  >
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Back to Home
                  </Link>
                  <Link 
                    href="/environmental-organization/login"
                    className="flex-1 flex items-center justify-center px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-light rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/30 text-sm"
                  >
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Try Login Later
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Background variant="web3-emerald" />
      <div className="min-h-screen flex items-center justify-center relative z-10 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="w-full max-w-md sm:max-w-lg">
          {/* EnviroConnect Branding */}
          <div className="text-center mb-6 sm:mb-10">
            <Link href="/" className="inline-flex items-center justify-center space-x-2 sm:space-x-3 mb-6 sm:mb-8 group">
              <div className="h-8 w-8 sm:h-10 sm:w-10 relative transition-transform duration-300 group-hover:scale-110">
                <div className="absolute inset-0 bg-emerald-500 rounded-full opacity-70 group-hover:opacity-80 transition-opacity"></div>
                <div className="absolute inset-0 border border-emerald-400 rounded-full"></div>
                <div className="absolute inset-[2px] border-2 border-dashed border-emerald-300/30 rounded-full"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[3px] h-4 sm:h-5 bg-white/80 rounded-full"></div>
                </div>
              </div>
              <span className="text-lg sm:text-2xl font-medium font-poppins leading-none">
                <span className="text-white">Enviro</span><span className="text-emerald-400">Connect</span>
              </span>
            </Link>
            <div className="w-24 sm:w-32 h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent mx-auto mb-6 sm:mb-8"></div>
          </div>

          {/* Main Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/20 shadow-2xl shadow-black/20 overflow-hidden">
            {/* Header Section */}
            <div className="px-6 sm:px-8 lg:px-10 pt-8 sm:pt-10 pb-6 sm:pb-8 text-center border-b border-white/10">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500/20 backdrop-blur-sm rounded-full mb-4 sm:mb-6 border border-emerald-500/30 shadow-lg">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-2 sm:mb-3 tracking-tight">
                Join Our Network
              </h1>
              <p className="text-sm sm:text-base text-white/70 font-light leading-relaxed px-2">
                Register your environmental organization
              </p>
            </div>

            {/* Form Section */}
            <div className="px-6 sm:px-8 lg:px-10 py-8 sm:py-10">
              <form action={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <label htmlFor="organizationName" className="block text-sm font-medium text-white/90 mb-2">
                    Organization Name
                  </label>
                  <div className="relative">
                    <input
                      id="organizationName"
                      name="organizationName"
                      type="text"
                      required
                      className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300 text-white placeholder-white/50 font-light shadow-inner hover:bg-white/15 text-sm sm:text-base"
                      placeholder="Enter organization name"
                    />
                    <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300 text-white placeholder-white/50 font-light shadow-inner hover:bg-white/15 text-sm sm:text-base"
                      placeholder="Enter organization email"
                    />
                    <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none"></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-white/90 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        required
                        className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300 text-white placeholder-white/50 font-light shadow-inner hover:bg-white/15 text-sm sm:text-base"
                        placeholder="Enter phone number"
                      />
                      <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none"></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="category" className="block text-sm font-medium text-white/90 mb-2">
                      Environmental Focus
                    </label>
                    <div className="relative">
                      <select
                        id="category"
                        name="category"
                        required
                        className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300 text-white font-light shadow-inner hover:bg-white/15 appearance-none cursor-pointer text-sm sm:text-base"
                      >
                        <option value="" className="bg-gray-800 text-white">Select focus area</option>
                        <option value="air pollution" className="bg-gray-800 text-white">Air Pollution</option>
                        <option value="water pollution" className="bg-gray-800 text-white">Water Pollution</option>
                        <option value="wildfire" className="bg-gray-800 text-white">Wildfire</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4 pointer-events-none">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300 text-white placeholder-white/50 font-light shadow-inner hover:bg-white/15 text-sm sm:text-base"
                      placeholder="Create a password"
                    />
                    <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none"></div>
                  </div>
                </div>

                {error && (
                  <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl backdrop-blur-sm border bg-red-500/10 border-red-500/30 text-red-300 shadow-lg">
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

                <div className="pt-2 sm:pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4 bg-emerald-500/20 text-emerald-300 font-light rounded-xl sm:rounded-2xl hover:bg-emerald-500/30 disabled:bg-white/5 disabled:text-white/30 disabled:cursor-not-allowed transition-all duration-300 backdrop-blur-sm border border-emerald-500/30 hover:border-emerald-500/50 disabled:border-white/10 shadow-lg hover:shadow-emerald-500/10 text-sm sm:text-base"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating account...
                      </>
                    ) : (
                      <>
                        <svg className="mr-2 h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        Register Organization
                      </>
                    )}
                  </button>
                </div>

                <div className="text-center pt-3 sm:pt-4 border-t border-white/10">
                  <p className="text-white/60 font-light text-xs sm:text-sm">
                    Already have an account?{' '}
                    <Link
                      href="/environmental-organization/login"
                      className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors duration-300"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6 sm:mt-8">
            <p className="text-white/50 text-xs sm:text-sm font-light px-4">
              Join the global network of environmental guardians
            </p>
          </div>
        </div>
      </div>
    </>
  );
} 