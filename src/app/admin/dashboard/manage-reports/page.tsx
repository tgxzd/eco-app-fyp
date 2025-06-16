'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { deleteReport, getReports } from './action';
import Background from '@/components/Background';

interface Location {
    id: string;
    address: string | null;
    latitude: number;
    longitude: number;
}

interface User {
    user_id: string;
    name: string | null;
    email: string;
}

interface Report {
    id: string;
    description: string;
    category: string;
    createdAt: string | Date;
    updatedAt: string | Date;
    imagePath: string | null;
    userId: string;
    locationId: string | null;
    user: User;
    location: Location | null;
}

export default function ManageReports() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const result = await getReports();
            
            if (!result.success) {
                throw new Error(result.message || 'Failed to fetch reports');
            }
            
            setReports(result.data || []);
            setError(null);
        } catch (err) {
            setError('Failed to load reports. Please try again later.');
            console.error('Error fetching reports:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (reportId: string) => {
        if (!confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
            return;
        }

        try {
            const result = await deleteReport(reportId);

            if (!result.success) {
                alert(result.message || 'Failed to delete report');
                return;
            }

            setReports(reports.filter(report => report.id !== reportId));
            alert('Report deleted successfully');
        } catch {
            alert('Failed to delete report. Please try again.');
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

    if (error) {
        return (
            <>
                <Background variant="web3-emerald" />
                <div className="min-h-screen flex items-center justify-center relative z-10">
                    <div className="text-center max-w-md mx-auto px-4">
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/20 shadow-2xl shadow-black/20 overflow-hidden p-6 sm:p-8">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h2 className="text-lg sm:text-xl font-light text-white mb-3 sm:mb-4">Error Loading Reports</h2>
                            <p className="text-white/70 font-light mb-4 sm:mb-6 text-sm sm:text-base">{error}</p>
                            <button
                                onClick={() => router.push('/admin/dashboard')}
                                className="flex items-center px-4 py-2 bg-emerald-500/20 text-emerald-300 font-light rounded-xl sm:rounded-2xl hover:bg-emerald-500/30 transition-all duration-300 backdrop-blur-sm border border-emerald-500/30 hover:border-emerald-500/50 mx-auto text-sm sm:text-base"
                            >
                                <svg className="mr-2 h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Dashboard
                            </button>
                        </div>
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
                                    Manage Reports
                                </h1>
                            </div>

                            {/* Back Button */}
                            <button
                                onClick={() => router.push('/admin/dashboard')}
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
                    {/* Header Section */}
                    <div className="text-center mb-8 sm:mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-green-500/20 backdrop-blur-sm rounded-full mb-4 sm:mb-6 border border-green-500/30 shadow-lg">
                            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-3 sm:mb-4 tracking-tight px-4">
                            Environmental Reports
                        </h2>
                        <p className="text-base sm:text-lg text-white/70 font-light leading-relaxed max-w-2xl mx-auto px-4">
                            Review and manage environmental reports submitted by users
                        </p>
                    </div>

                    {/* Reports Table/Cards */}
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/20 shadow-2xl shadow-black/20 overflow-hidden">
                        {reports.length === 0 ? (
                            <div className="text-center py-12 sm:py-16">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
                                    <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl sm:text-2xl font-light text-white mb-3 sm:mb-4">No Reports Found</h3>
                                <p className="text-white/60 font-light text-sm sm:text-base px-4">No environmental reports have been submitted yet.</p>
                            </div>
                        ) : (
                            <>
                                {/* Desktop Table View */}
                                <div className="hidden lg:block overflow-x-auto">
                                    <table className="min-w-full">
                                        <thead>
                                            <tr className="border-b border-white/10">
                                                <th className="px-6 py-4 text-left text-sm font-medium text-white/90">Report</th>
                                                <th className="px-6 py-4 text-left text-sm font-medium text-white/90">Category</th>
                                                <th className="px-6 py-4 text-left text-sm font-medium text-white/90">Reporter</th>
                                                <th className="px-6 py-4 text-left text-sm font-medium text-white/90">Location</th>
                                                <th className="px-6 py-4 text-left text-sm font-medium text-white/90">Submitted</th>
                                                <th className="px-6 py-4 text-right text-sm font-medium text-white/90">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {reports.map((report) => (
                                                <tr 
                                                    key={report.id} 
                                                    className="hover:bg-white/5 transition-colors cursor-pointer group"
                                                    onClick={() => router.push(`/admin/dashboard/manage-reports/${report.id}`)}
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="max-w-xs">
                                                            <div className="text-white font-light group-hover:text-emerald-300 transition-colors">
                                                                {report.description.length > 60 
                                                                    ? `${report.description.substring(0, 60)}...` 
                                                                    : report.description}
                                                            </div>
                                                            <div className="text-white/50 text-sm font-mono mt-1">{report.id}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-lg">{getCategoryIcon(report.category)}</span>
                                                            <span className="text-white/80 font-light">{report.category}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <div className="text-white/80 font-light">{report.user.name || 'Anonymous'}</div>
                                                            <div className="text-white/60 font-light text-sm">{report.user.email}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-white/70 font-light text-sm max-w-xs truncate">
                                                            {report.location?.address || 'No address provided'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-white/70 font-light text-sm">
                                                            {new Date(report.createdAt).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric',
                                                            })}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDelete(report.id);
                                                            }}
                                                            className="text-red-300 hover:text-red-200 font-light transition-colors"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Card View */}
                                <div className="lg:hidden divide-y divide-white/5">
                                    {reports.map((report) => (
                                        <div 
                                            key={report.id} 
                                            className="p-4 sm:p-6 cursor-pointer hover:bg-white/5 transition-colors"
                                            onClick={() => router.push(`/admin/dashboard/manage-reports/${report.id}`)}
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <span className="text-lg">{getCategoryIcon(report.category)}</span>
                                                        <span className="text-emerald-300 font-medium text-sm px-2 py-1 bg-emerald-500/20 rounded-full border border-emerald-500/30">
                                                            {report.category}
                                                        </span>
                                                    </div>
                                                    <p className="text-white font-light text-sm sm:text-base line-clamp-2 mb-2">
                                                        {report.description.length > 80 
                                                            ? `${report.description.substring(0, 80)}...` 
                                                            : report.description}
                                                    </p>
                                                    <p className="text-white/50 text-xs font-mono break-all">{report.id}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                                <div>
                                                    <p className="text-white/60 text-xs font-medium">Reporter</p>
                                                    <p className="text-white/80 font-light text-sm">{report.user.name || 'Anonymous'}</p>
                                                    <p className="text-white/60 font-light text-xs break-all">{report.user.email}</p>
                                                </div>
                                                
                                                <div>
                                                    <p className="text-white/60 text-xs font-medium">Submitted</p>
                                                    <p className="text-white/70 font-light text-sm">
                                                        {new Date(report.createdAt).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                        })}
                                                    </p>
                                                </div>
                                            </div>

                                            {report.location?.address && (
                                                <div className="mb-4">
                                                    <p className="text-white/60 text-xs font-medium">Location</p>
                                                    <p className="text-white/70 font-light text-sm truncate">{report.location.address}</p>
                                                </div>
                                            )}

                                            <div className="flex space-x-3">
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        router.push(`/admin/dashboard/manage-reports/${report.id}`);
                                                    }}
                                                    className="flex-1 text-center px-3 py-2 bg-emerald-500/20 text-emerald-300 font-light rounded-lg hover:bg-emerald-500/30 transition-all duration-300 border border-emerald-500/30 text-sm"
                                                >
                                                    View Details
                                                </button>
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(report.id);
                                                    }}
                                                    className="flex-1 text-center px-3 py-2 bg-red-500/20 text-red-300 font-light rounded-lg hover:bg-red-500/30 transition-all duration-300 border border-red-500/30 text-sm"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
} 