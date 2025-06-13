'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { getReportByIdForOrganization, markReportAsResolved } from '../action';
import artwork from '../../../../../../public/images/gambar.jpg';

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

    if (loading) {
        return (
            <div className="relative min-h-screen bg-[#121212] flex items-center justify-center">
                <div className="fixed inset-0 z-0">
                    <Image
                        src={artwork}
                        alt="Background artwork"
                        fill
                        className="object-cover opacity-60"
                        quality={100}
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30"></div>
                </div>
                <div className="relative z-10 text-amber-100">Loading report...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="relative min-h-screen bg-[#121212] flex items-center justify-center">
                <div className="fixed inset-0 z-0">
                    <Image
                        src={artwork}
                        alt="Background artwork"
                        fill
                        className="object-cover opacity-60"
                        quality={100}
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30"></div>
                </div>
                <div className="relative z-10 text-center">
                    <div className="bg-red-500/10 border border-red-500/50 rounded text-red-500 p-4 max-w-md mx-auto">
                        {error}
                    </div>
                    <button
                        onClick={() => router.push('/environmental-organization/dashboard/view-reports')}
                        className="mt-4 px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded-md transition-colors"
                    >
                        Back to Reports
                    </button>
                </div>
            </div>
        );
    }

    if (!report) {
        return (
            <div className="relative min-h-screen bg-[#121212] flex items-center justify-center">
                <div className="fixed inset-0 z-0">
                    <Image
                        src={artwork}
                        alt="Background artwork"
                        fill
                        className="object-cover opacity-60"
                        quality={100}
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30"></div>
                </div>
                <div className="relative z-10 text-amber-100">Report not found</div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-[#121212]">
            {/* Background Image */}
            <div className="fixed inset-0 z-0">
                <Image
                    src={artwork}
                    alt="Background artwork"
                    fill
                    className="object-cover opacity-60"
                    quality={100}
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30"></div>
            </div>

            <div className="relative z-10">
                {/* Header */}
                <header className="bg-black/50 backdrop-blur-sm border-b border-amber-700/30">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-6">
                            <div className="flex items-center">
                                <h1 className="text-2xl font-bold text-amber-100">Report Details</h1>
                                <span className="ml-4 px-3 py-1 bg-amber-700/50 text-amber-100 rounded-full text-sm">
                                    {report.category.charAt(0).toUpperCase() + report.category.slice(1)}
                                </span>
                                {report.status === 'resolved' && (
                                    <span className="ml-2 px-3 py-1 bg-green-600 text-white rounded-full text-sm flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Resolved
                                    </span>
                                )}
                            </div>
                            <div className="flex gap-2">
                                {report.status !== 'resolved' && (
                                    <button
                                        onClick={handleMarkAsResolved}
                                        disabled={isMarking}
                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors disabled:opacity-50 flex items-center"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        {isMarking ? 'Marking...' : 'Mark as Resolved'}
                                    </button>
                                )}
                                <button
                                    onClick={() => router.push('/environmental-organization/dashboard/view-reports')}
                                    className="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded-md transition-colors"
                                >
                                    Back to Reports
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-black/50 border border-amber-700/30 rounded-lg backdrop-blur-sm overflow-hidden">
                        {/* Report Image */}
                        {report.imagePath && (
                            <div className="w-full">
                                <Image
                                    src={report.imagePath}
                                    alt="Report image"
                                    width={800}
                                    height={400}
                                    className="w-full h-64 md:h-96 object-cover"
                                />
                            </div>
                        )}

                        {/* Report Content */}
                        <div className="p-6 md:p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Main Content */}
                                <div className="lg:col-span-2 space-y-6">
                                    {/* Description */}
                                    <div>
                                        <h2 className="text-lg font-medium text-amber-100 mb-3">Description</h2>
                                        <p className="text-amber-100/90 leading-relaxed">{report.description}</p>
                                    </div>

                                    {/* Location Details */}
                                    {report.location && (
                                        <div>
                                            <h2 className="text-lg font-medium text-amber-100 mb-3">Location</h2>
                                            <div className="bg-black/30 border border-amber-700/20 rounded-lg p-4">
                                                <div className="space-y-2">
                                                    <div>
                                                        <span className="text-amber-100/70 text-sm">Address:</span>
                                                        <p className="text-amber-100">{report.location.address || 'No address provided'}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-amber-100/70 text-sm">Coordinates:</span>
                                                        <p className="text-amber-100">
                                                            {report.location.latitude}, {report.location.longitude}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Sidebar */}
                                <div className="space-y-6">
                                    {/* Reporter Information */}
                                    <div className="bg-black/30 border border-amber-700/20 rounded-lg p-4">
                                        <h3 className="text-lg font-medium text-amber-100 mb-3">Reporter</h3>
                                        <div className="space-y-2">
                                            <div>
                                                <span className="text-amber-100/70 text-sm">Name:</span>
                                                <p className="text-amber-100">{report.user.name || 'Anonymous'}</p>
                                            </div>
                                            <div>
                                                <span className="text-amber-100/70 text-sm">Email:</span>
                                                <p className="text-amber-100">{report.user.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Report Metadata */}
                                    <div className="bg-black/30 border border-amber-700/20 rounded-lg p-4">
                                        <h3 className="text-lg font-medium text-amber-100 mb-3">Report Information</h3>
                                        <div className="space-y-3">
                                            <div>
                                                <span className="text-amber-100/70 text-sm">Category:</span>
                                                <p className="text-amber-100">{report.category}</p>
                                            </div>
                                            <div>
                                                <span className="text-amber-100/70 text-sm">Status:</span>
                                                <p className={`${report.status === 'resolved' ? 'text-green-400' : 'text-yellow-400'}`}>
                                                    {report.status === 'resolved' ? 'Resolved' : 'Pending'}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-amber-100/70 text-sm">Submitted:</span>
                                                <p className="text-amber-100">
                                                    {new Date(report.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                                <p className="text-amber-100/70 text-sm">
                                                    at {new Date(report.createdAt).toLocaleTimeString()}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-amber-100/70 text-sm">Last Updated:</span>
                                                <p className="text-amber-100">
                                                    {new Date(report.updatedAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                                <p className="text-amber-100/70 text-sm">
                                                    at {new Date(report.updatedAt).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
} 