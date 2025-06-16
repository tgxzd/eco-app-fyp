'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { getReportByIdForOrganization, markReportAsResolved } from '../action';
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

export default function ReportDetail() {
    const router = useRouter();
    const params = useParams();
    const [report, setReport] = useState<Report | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isMarking, setIsMarking] = useState(false);

    useEffect(() => {
        if (params.id) {
            fetchReport(params.id as string);
        }
    }, [params.id]);

    const fetchReport = async (reportId: string) => {
        try {
            const result = await getReportByIdForOrganization(reportId);

            if (!result.success) {
                throw new Error(result.message || 'Failed to fetch report');
            }

            if (result.data) {
                setReport(result.data);
            }
            setError(null);
        } catch (err) {
            setError('Failed to load report. Please try again later.');
            console.error('Error fetching report:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsResolved = async () => {
        if (!report || report.status === 'resolved') return;

        setIsMarking(true);
        try {
            const result = await markReportAsResolved(report.id);

            if (result.success) {
                setReport({ ...report, status: 'resolved' });
                setError(null);
            } else {
                setError(result.message || 'Failed to mark report as resolved');
            }
        } catch (err) {
            setError('Failed to mark report as resolved. Please try again.');
            console.error('Error marking report as resolved:', err);
        } finally {
            setIsMarking(false);
        }
    };

    const handleOpenGoogleMaps = (location: Location) => {
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
                        <svg className="animate-spin h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-white font-light text-lg">Loading report...</span>
                    </div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Background variant="web3-emerald" />
                <div className="min-h-screen flex items-center justify-center relative z-10">
                    <div className="text-center max-w-md mx-auto px-4">
                        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl shadow-black/20 overflow-hidden p-8">
                            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-light text-white mb-4">Error Loading Report</h2>
                            <p className="text-white/70 font-light mb-6">{error}</p>
                            <button
                                onClick={() => router.push('/environmental-organization/dashboard/view-reports')}
                                className="flex items-center px-4 py-2 bg-emerald-500/20 text-emerald-300 font-light rounded-2xl hover:bg-emerald-500/30 transition-all duration-300 backdrop-blur-sm border border-emerald-500/30 hover:border-emerald-500/50 mx-auto"
                            >
                                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Reports
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (!report) {
        return (
            <>
                <Background variant="web3-emerald" />
                <div className="min-h-screen flex items-center justify-center relative z-10">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <p className="text-white/60 font-light">Report not found</p>
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
                        <div className="flex justify-between items-center py-6">
                            {/* Logo and Title */}
                            <div className="flex items-center space-x-4">
                                <Link href="/" className="flex items-center space-x-2">
                                    <div className="h-8 w-8 relative">
                                        <div className="absolute inset-0 bg-emerald-500 rounded-full opacity-70"></div>
                                        <div className="absolute inset-0 border border-emerald-400 rounded-full"></div>
                                        <div className="absolute inset-[2px] border-2 border-dashed border-emerald-300/30 rounded-full"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-[3px] h-4 bg-white/80 rounded-full"></div>
                                        </div>
                                    </div>
                                    <span className="text-lg font-medium font-poppins leading-none">
                                        <span className="text-white">Enviro</span><span className="text-emerald-400">Connect</span>
                                    </span>
                                </Link>
                                <div className="h-6 w-px bg-white/20"></div>
                                <div className="flex items-center space-x-3">
                                    <h1 className="text-xl sm:text-2xl font-light text-white">Report Details</h1>
                                    <span className="inline-flex items-center px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm font-medium border border-emerald-500/30">
                                        <span className="mr-2">{getCategoryIcon(report.category)}</span>
                                        {report.category.charAt(0).toUpperCase() + report.category.slice(1)}
                                    </span>
                                    {report.status === 'resolved' && (
                                        <span className="inline-flex items-center px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-medium border border-green-500/30">
                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Resolved
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center space-x-3">
                                {report.status !== 'resolved' && (
                                    <button
                                        onClick={handleMarkAsResolved}
                                        disabled={isMarking}
                                        className="flex items-center px-4 py-2 bg-green-500/20 text-green-300 font-light rounded-2xl hover:bg-green-500/30 disabled:bg-white/5 disabled:text-white/30 disabled:cursor-not-allowed transition-all duration-300 backdrop-blur-sm border border-green-500/30 hover:border-green-500/50 disabled:border-white/10"
                                    >
                                        {isMarking ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Marking...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                Mark as Resolved
                                            </>
                                        )}
                                    </button>
                                )}
                                <button
                                    onClick={() => router.push('/environmental-organization/dashboard/view-reports')}
                                    className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-light rounded-2xl transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/30"
                                >
                                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Back to Reports
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                    <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl shadow-black/20 overflow-hidden">
                        {/* Report Image */}
                        {report.imagePath && (
                            <div className="relative">
                                <Image
                                    src={report.imagePath}
                                    alt="Report image"
                                    width={1200}
                                    height={600}
                                    className="w-full h-64 md:h-96 object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <span className="inline-flex items-center px-3 py-1 bg-black/50 backdrop-blur-sm text-white rounded-full text-sm font-medium border border-white/20">
                                                <span className="mr-2">{getCategoryIcon(report.category)}</span>
                                                {report.category}
                                            </span>
                                            {report.status === 'resolved' ? (
                                                <span className="inline-flex items-center px-3 py-1 bg-green-500/80 backdrop-blur-sm text-white rounded-full text-sm font-medium">
                                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                    Resolved
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-3 py-1 bg-yellow-500/80 backdrop-blur-sm text-white rounded-full text-sm font-medium">
                                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    Pending
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Report Content */}
                        <div className="p-8 sm:p-10">
                            {/* Description Section */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-light text-white mb-4">Report Description</h2>
                                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                    <p className="text-white/90 font-light leading-relaxed text-lg">
                                        {report.description}
                                    </p>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                                {/* Reporter Information */}
                                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                                            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-light text-white">Reporter Information</h3>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-white/60 mb-1">Name</label>
                                            <p className="text-white font-light">{report.user.name || 'Anonymous'}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-white/60 mb-1">Email</label>
                                            <p className="text-white/80 font-light">{report.user.email}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-white/60 mb-1">User ID</label>
                                            <p className="text-white/50 font-light font-mono text-sm">{report.user.user_id}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Report Metadata */}
                                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                                            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-light text-white">Report Details</h3>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-white/60 mb-1">Report ID</label>
                                            <p className="text-white/50 font-light font-mono text-sm">{report.id}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-white/60 mb-1">Category</label>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-lg">{getCategoryIcon(report.category)}</span>
                                                <p className="text-white font-light">{report.category}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-white/60 mb-1">Status</label>
                                            <div className="flex items-center">
                                                {report.status === 'resolved' ? (
                                                    <span className="inline-flex items-center px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-medium border border-green-500/30">
                                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                        Resolved
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm font-medium border border-yellow-500/30">
                                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                        Pending
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-white/60 mb-1">Submitted</label>
                                            <p className="text-white font-light">
                                                {new Date(report.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                        {report.updatedAt !== report.createdAt && (
                                            <div>
                                                <label className="block text-sm font-medium text-white/60 mb-1">Last Updated</label>
                                                <p className="text-white font-light">
                                                    {new Date(report.updatedAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Location Section */}
                            {report.location && (
                                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                                                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-xl font-light text-white">Location Information</h3>
                                        </div>
                                        <button
                                            onClick={() => handleOpenGoogleMaps(report.location!)}
                                            className="flex items-center px-4 py-2 bg-blue-500/20 text-blue-300 font-light rounded-2xl hover:bg-blue-500/30 transition-all duration-300 backdrop-blur-sm border border-blue-500/30 hover:border-blue-500/50"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                            Open in Maps
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-white/60 mb-1">Address</label>
                                            <p className="text-white font-light">
                                                {report.location.address || 'Address not provided'}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-white/60 mb-1">Coordinates</label>
                                            <p className="text-white/80 font-light font-mono text-sm">
                                                {report.location.latitude.toFixed(6)}, {report.location.longitude.toFixed(6)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
} 