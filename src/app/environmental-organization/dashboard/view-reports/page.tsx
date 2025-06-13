'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getReportsByCategory } from './action';
import artwork from '../../../../../public/images/gambar.jpg';

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
                <div className="relative z-10 text-amber-100">Loading reports...</div>
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
                                <h1 className="text-2xl font-bold text-amber-100">Environmental Reports</h1>
                                {category && (
                                    <span className="ml-4 px-3 py-1 bg-amber-700/50 text-amber-100 rounded-full text-sm">
                                        {category.charAt(0).toUpperCase() + category.slice(1)}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => router.push('/environmental-organization/dashboard')}
                                className="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded-md transition-colors"
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded text-red-500">
                            {error}
                        </div>
                    )}

                    {reports.length === 0 ? (
                        <div className="bg-black/50 border border-amber-700/30 rounded-lg p-8 backdrop-blur-sm text-center">
                            <h2 className="text-xl font-medium text-amber-100 mb-2">No Reports Found</h2>
                            <p className="text-amber-100/70">
                                No reports have been submitted in your organization&apos;s focus area ({category}) yet.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-black/50 border border-amber-700/30 rounded-lg p-4 backdrop-blur-sm">
                                <h2 className="text-lg font-medium text-amber-100 mb-2">
                                    Reports in Your Focus Area
                                </h2>
                                <p className="text-amber-100/70">
                                    Showing {reports.length} report{reports.length !== 1 ? 's' : ''} related to {category}
                                    {reports.length > 0 && (
                                        <span className="ml-2">
                                            ({reports.filter(r => r.status !== 'resolved').length} pending, {reports.filter(r => r.status === 'resolved').length} resolved)
                                        </span>
                                    )}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {reports.map((report) => (
                                    <div
                                        key={report.id}
                                        className="bg-black/50 border border-amber-700/30 rounded-lg p-6 backdrop-blur-sm hover:bg-black/60 transition-all duration-300 cursor-pointer"
                                        onClick={() => router.push(`/environmental-organization/dashboard/view-reports/${report.id}`)}
                                    >
                                        {/* Report Image */}
                                        {report.imagePath && (
                                            <div className="mb-4 rounded-lg overflow-hidden">
                                                <Image
                                                    src={report.imagePath}
                                                    alt="Report image"
                                                    width={300}
                                                    height={200}
                                                    className="w-full h-48 object-cover"
                                                />
                                            </div>
                                        )}

                                        {/* Report Details */}
                                        <div className="space-y-3">
                                            <div>
                                                <h3 className="text-lg font-medium text-amber-100 mb-2">
                                                    {report.description.length > 60
                                                        ? `${report.description.substring(0, 60)}...`
                                                        : report.description}
                                                </h3>
                                                <div className="flex items-center gap-2">
                                                    <span className="inline-block px-2 py-1 bg-amber-700/50 text-amber-100 rounded text-sm">
                                                        {report.category}
                                                    </span>
                                                    {report.status === 'resolved' ? (
                                                        <span className="inline-flex items-center px-2 py-1 bg-green-600 text-white rounded text-sm">
                                                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                            Resolved
                                                        </span>
                                                    ) : (
                                                        <span className="inline-block px-2 py-1 bg-yellow-600 text-white rounded text-sm">
                                                            Pending
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Reporter Info */}
                                            <div className="pt-3 border-t border-amber-700/30">
                                                <p className="text-sm text-amber-100/70">Reported by</p>
                                                <p className="text-amber-100">{report.user.name || 'Anonymous'}</p>
                                                <p className="text-amber-100/60 text-sm">{report.user.email}</p>
                                            </div>

                                            {/* Location */}
                                            {report.location && (
                                                <div>
                                                    <p className="text-sm text-amber-100/70">Location</p>
                                                    <p className="text-amber-100/90 text-sm">
                                                        {report.location.address || 'No address provided'}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Date */}
                                            <div>
                                                <p className="text-sm text-amber-100/70">Submitted</p>
                                                <p className="text-amber-100/90 text-sm">
                                                    {new Date(report.createdAt).toLocaleDateString()} at{' '}
                                                    {new Date(report.createdAt).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
} 