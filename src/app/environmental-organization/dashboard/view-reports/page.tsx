'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getReportsByCategory } from './action';
import Background from '@/components/Background';
import Link from 'next/link';

interface User {
    user_id: string;
    name: string | null;
    email: string;
}

interface Location {
    id: string;
    address: string | null;
    latitude: number;
    longitude: number;
}

interface Report {
    id: string;
    description: string;
    category: string;
    status: string;
    createdAt: string | Date;
    updatedAt: string | Date;
    imagePath: string | null;
    userId: string;
    locationId: string | null;
    user: User;
    location: Location | null;
}

export default function ViewReports() {
    const router = useRouter();
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [category, setCategory] = useState<string>('');

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const result = await getReportsByCategory();

            if (!result.success) {
                throw new Error(result.message || 'Failed to fetch reports');
            }

            if (result.data) {
                setReports(result.data);
                setCategory(result.category || '');
            }
            setError(null);
        } catch (err) {
            setError('Failed to load reports. Please try again later.');
            console.error('Error fetching reports:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenGoogleMaps = (location: Location, event: React.MouseEvent) => {
        // Prevent the card click event from firing
        event.stopPropagation();
        
        // Create Google Maps directions URL
        let mapsUrl;
        
        if (location.address) {
            // Use address if available
            const encodedAddress = encodeURIComponent(location.address);
            mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
        } else {
            // Use coordinates if no address
            mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`;
        }
        
        // Open in new tab
        window.open(mapsUrl, '_blank');
    };

    const getCategoryIcon = (category: string) => {
        switch (category.toLowerCase()) {
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

    if (loading) {
        return (
            <>
                <Background variant="web3-emerald" />
                <div className="min-h-screen flex items-center justify-center relative z-10">
                    <div className="flex items-center space-x-3">
                        <svg className="animate-spin h-6 w-6 sm:h-8 sm:w-8 text-emerald-400" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-white font-light text-base sm:text-lg">Loading reports...</span>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Background variant="web3-emerald" />
            <div className="min-h-screen relative z-10">
                {/* Header */}
                <header className="bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center py-4 sm:py-6 space-y-4 lg:space-y-0">
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
                                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                                    <h1 className="text-lg sm:text-xl lg:text-2xl font-light text-white">Environmental Reports</h1>
                                    {category && (
                                        <span className="inline-flex items-center px-2 sm:px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs sm:text-sm font-medium border border-emerald-500/30">
                                            <span className="mr-1 sm:mr-2">{getCategoryIcon(category)}</span>
                                            {category.charAt(0).toUpperCase() + category.slice(1)}
                                        </span>
                                    )}
                                </div>
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
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
                    {/* Error Message */}
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

                    {reports.length === 0 ? (
                        /* Empty State */
                        <div className="text-center py-12 sm:py-16">
                            <div className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/20 shadow-2xl shadow-black/20 overflow-hidden max-w-2xl mx-auto">
                                <div className="px-6 sm:px-8 lg:px-10 py-12 sm:py-16">
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
                                        <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-xl sm:text-2xl font-light text-white mb-3 sm:mb-4">No Reports Found</h2>
                                    <p className="text-white/60 font-light leading-relaxed text-sm sm:text-base px-4">
                                        No reports have been submitted in your organization's focus area ({category}) yet.
                                    </p>
                                    <p className="text-white/40 font-light text-xs sm:text-sm mt-4">
                                        Reports will appear here as they are submitted by users.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 sm:space-y-8">
                            {/* Summary Card */}
                            <div className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/20 shadow-2xl shadow-black/20 overflow-hidden">
                                <div className="px-6 sm:px-8 lg:px-10 py-6 sm:py-8">
                                    <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                                            <span className="text-xl sm:text-2xl">{getCategoryIcon(category)}</span>
                                        </div>
                                        <div>
                                            <h2 className="text-xl sm:text-2xl font-light text-white mb-1">
                                                Reports in Your Focus Area
                                            </h2>
                                            <p className="text-white/60 font-light text-sm sm:text-base">
                                                Showing {reports.length} report{reports.length !== 1 ? 's' : ''} related to {category}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                                        <div className="bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center">
                                            <div className="text-xl sm:text-2xl font-light text-white">{reports.length}</div>
                                            <div className="text-white/60 text-xs sm:text-sm font-light">Total Reports</div>
                                        </div>
                                        <div className="bg-yellow-500/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center border border-yellow-500/20">
                                            <div className="text-xl sm:text-2xl font-light text-yellow-300">{reports.filter(r => r.status !== 'resolved').length}</div>
                                            <div className="text-yellow-300/80 text-xs sm:text-sm font-light">Pending</div>
                                        </div>
                                        <div className="bg-green-500/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center border border-green-500/20">
                                            <div className="text-xl sm:text-2xl font-light text-green-300">{reports.filter(r => r.status === 'resolved').length}</div>
                                            <div className="text-green-300/80 text-xs sm:text-sm font-light">Resolved</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Reports Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                                {reports.map((report) => (
                                    <div
                                        key={report.id}
                                        className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/20 shadow-xl shadow-black/10 overflow-hidden hover:bg-white/15 transition-all duration-300 cursor-pointer group"
                                        onClick={() => router.push(`/environmental-organization/dashboard/view-reports/${report.id}`)}
                                    >
                                        {/* Report Image */}
                                        {report.imagePath && (
                                            <div className="relative h-40 sm:h-48 overflow-hidden">
                                                <Image
                                                    src={report.imagePath}
                                                    alt="Report image"
                                                    width={400}
                                                    height={200}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                            </div>
                                        )}

                                        {/* Report Content */}
                                        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                                            {/* Status and Category */}
                                            <div className="flex items-center justify-between">
                                                <span className="inline-flex items-center px-2 sm:px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs sm:text-sm font-medium border border-emerald-500/30">
                                                    <span className="mr-1 sm:mr-2">{getCategoryIcon(report.category)}</span>
                                                    <span className="hidden sm:inline">{report.category}</span>
                                                </span>
                                                {report.status === 'resolved' ? (
                                                    <span className="inline-flex items-center px-2 sm:px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs sm:text-sm font-medium border border-green-500/30">
                                                        <svg className="w-2 h-2 sm:w-3 sm:h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                        <span className="hidden sm:inline">Resolved</span>
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2 sm:px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs sm:text-sm font-medium border border-yellow-500/30">
                                                        <svg className="w-2 h-2 sm:w-3 sm:h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                        <span className="hidden sm:inline">Pending</span>
                                                    </span>
                                                )}
                                            </div>

                                            {/* Description */}
                                            <div>
                                                <h3 className="text-base sm:text-lg font-light text-white mb-2 line-clamp-2">
                                                    {report.description.length > 60
                                                        ? `${report.description.substring(0, 60)}...`
                                                        : report.description}
                                                </h3>
                                            </div>

                                            {/* Reporter Info */}
                                            <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-white/10">
                                                <div className="flex items-center space-x-2 sm:space-x-3">
                                                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/10 rounded-full flex items-center justify-center">
                                                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-white/80 text-xs sm:text-sm font-light">
                                                            {report.user.name || 'Anonymous'}
                                                        </p>
                                                        <p className="text-white/50 text-xs font-light">
                                                            {new Date(report.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Location Button */}
                                                {report.location && (
                                                    <button
                                                        onClick={(e) => handleOpenGoogleMaps(report.location!, e)}
                                                        className="flex items-center px-2 sm:px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium border border-blue-500/30 hover:bg-blue-500/30 transition-colors"
                                                    >
                                                        <svg className="w-2 h-2 sm:w-3 sm:h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        <span className="hidden sm:inline">View</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
} 