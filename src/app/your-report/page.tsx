'use client';


import NavHeader from '@/components/ui/nav-header';
import Background from '@/components/Background';
import { useEffect, useState } from 'react';
import Link from 'next/link';

// Define the Report type based on your prisma schema and data structure
interface Report {
  id: string;
  description: string;
  category: string;
  status: string;
  imagePath?: string | null;
  createdAt: string; // Or Date, adjust as per your API response
  location?: {
    address?: string | null;
    latitude?: number;
    longitude?: number;
  } | null;
}

export default function YourReportPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReports() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/user-reports');
        const data = await response.json();
        if (data.success) {
          setReports(data.data);
        } else {
          setError(data.message || 'Failed to fetch reports');
        }
      } catch (err) {
        setError('An error occurred while fetching reports.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchReports();
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'air-pollution':
        return '🌫️';
      case 'water-pollution':
        return '💧';
      case 'wildfire':
        return '🔥';
      default:
        return '📋';
    }
  };

  const formatCategoryName = (category: string) => {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <>
      <Background variant="web3-emerald" />
      <div className="relative min-h-screen z-10">
        <NavHeader />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20 max-w-6xl">
          {/* Header Section */}
          <div className="text-center mb-12 lg:mb-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500/20 backdrop-blur-sm rounded-full mb-8 border border-emerald-500/30">
              <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white mb-6 lg:mb-8 tracking-tight">
              Your Reports
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-white/70 max-w-3xl mx-auto font-light leading-relaxed px-4">
              Track and manage your environmental reports
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <div className="flex items-center space-x-3">
                <svg className="animate-spin h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-white font-light text-lg">Loading your reports...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-6 lg:p-8 rounded-2xl backdrop-blur-sm mb-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="font-light text-lg">{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && reports.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-12 lg:p-16 max-w-2xl mx-auto">
                <div className="w-24 h-24 bg-emerald-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/30">
                  <svg className="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl sm:text-3xl font-light text-white mb-4">No Reports Yet</h3>
                <p className="text-white/60 font-light text-lg mb-8 leading-relaxed">
                  You haven&apos;t created any environmental reports yet. Start documenting issues in your area.
                </p>
                <Link 
                  href="/create-report"
                  className="inline-flex items-center px-8 py-4 bg-emerald-500/20 text-emerald-300 font-light rounded-2xl hover:bg-emerald-500/30 transition-all duration-300 backdrop-blur-sm border border-emerald-500/30 hover:border-emerald-500/50"
                >
                  <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create Your First Report
                </Link>
              </div>
            </div>
          )}

          {/* Reports Grid */}
          {!isLoading && !error && reports.length > 0 && (
            <div className="grid gap-6 lg:gap-8">
              {reports.map((report) => (
                <Link href={`/your-report/${report.id}`} key={report.id} className="block group">
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 sm:p-8 lg:p-10 rounded-3xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 group">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      {/* Left Content */}
                      <div className="flex-1 space-y-4">
                        {/* Header */}
                        <div className="flex items-center space-x-4">
                          <div className="text-4xl">{getCategoryIcon(report.category)}</div>
                          <div>
                            <h2 className="text-xl sm:text-2xl font-light text-white group-hover:text-emerald-300 transition-colors duration-300">
                              {formatCategoryName(report.category)}
                            </h2>
                            <p className="text-white/50 font-light text-sm">
                              Report #{report.id.slice(-8).toUpperCase()}
                            </p>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-white/70 font-light leading-relaxed line-clamp-3">
                          {report.description}
                        </p>

                        {/* Location */}
                        {report.location?.address && (
                          <div className="flex items-center text-white/50 font-light text-sm">
                            <svg className="w-4 h-4 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {report.location.address}
                          </div>
                        )}

                        {/* Date */}
                        <div className="flex items-center text-white/50 font-light text-sm">
                          <svg className="w-4 h-4 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(report.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>

                      {/* Right Content */}
                      <div className="flex flex-col items-end space-y-4">
                        {/* Status Badge */}
                        {report.status === 'resolved' ? (
                          <div className="inline-flex items-center px-4 py-2 bg-emerald-500/20 text-emerald-300 rounded-full text-sm font-light backdrop-blur-sm border border-emerald-500/30">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Resolved
                          </div>
                        ) : (
                          <div className="inline-flex items-center px-4 py-2 bg-yellow-500/20 text-yellow-300 rounded-full text-sm font-light backdrop-blur-sm border border-yellow-500/30">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Pending
                          </div>
                        )}

                        {/* View Details Arrow */}
                        <div className="flex items-center text-emerald-400 group-hover:text-emerald-300 font-light transition-colors duration-300">
                          <span className="mr-2">View Details</span>
                          <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
