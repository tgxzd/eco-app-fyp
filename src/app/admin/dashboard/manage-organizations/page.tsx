'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getOrganizations, deleteOrganization } from './action';
import Background from '@/components/Background';

interface Organization {
    id: string;
    organizationName: string;
    email: string;
    phoneNumber: string;
    category: string;
    createdAt: string | Date;
    updatedAt: string | Date;
}

export default function ManageOrganizations() {
    const router = useRouter();
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchOrganizations();
    }, []);

    const fetchOrganizations = async () => {
        try {
            const result = await getOrganizations();

            if (!result.success) {
                throw new Error(result.message || 'Failed to fetch organizations');
            }

            if (result.data) {
                setOrganizations(result.data);
            }
            setError(null);
        } catch (err) {
            setError('Failed to load organizations. Please try again later.');
            console.error('Error fetching organizations:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (organizationId: string) => {
        if (!confirm('Are you sure you want to delete this organization? This action cannot be undone.')) {
            return;
        }

        try {
            console.log('Attempting to delete organization:', organizationId);
            const result = await deleteOrganization(organizationId);
            console.log('Delete result:', result);

            if (!result.success) {
                console.error('Delete failed:', result.message);
                alert(result.message || 'Failed to delete organization');
                return;
            }

            // Remove the organization from the list
            setOrganizations(organizations.filter(org => org.id !== organizationId));
            alert('Organization deleted successfully');
        } catch (err) {
            console.error('Error in handleDelete:', err);
            alert('Failed to delete organization. Please try again.');
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
                        <svg className="animate-spin h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-white font-light text-lg">Loading organizations...</span>
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
                            <h2 className="text-xl font-light text-white mb-4">Error Loading Organizations</h2>
                            <p className="text-white/70 font-light mb-6">{error}</p>
                            <button
                                onClick={() => router.push('/admin/dashboard')}
                                className="flex items-center px-4 py-2 bg-emerald-500/20 text-emerald-300 font-light rounded-2xl hover:bg-emerald-500/30 transition-all duration-300 backdrop-blur-sm border border-emerald-500/30 hover:border-emerald-500/50 mx-auto"
                            >
                                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                <h1 className="text-lg sm:text-xl lg:text-2xl font-light text-white">
                                    Manage Organizations
                                </h1>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full lg:w-auto">
                        <button
                            onClick={() => router.push('/admin/dashboard/manage-organizations/new')}
                                    className="w-full sm:w-auto flex items-center justify-center px-3 sm:px-4 py-2 bg-emerald-500/20 text-emerald-300 font-light rounded-xl sm:rounded-2xl hover:bg-emerald-500/30 transition-all duration-300 backdrop-blur-sm border border-emerald-500/30 hover:border-emerald-500/50 text-sm sm:text-base"
                        >
                                    <svg className="mr-2 h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                                    </svg>
                            Add New Organization
                        </button>
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
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
                    {/* Header Section */}
                    <div className="text-center mb-8 sm:mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500/20 backdrop-blur-sm rounded-full mb-4 sm:mb-6 border border-emerald-500/30 shadow-lg">
                            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-3 sm:mb-4 tracking-tight px-4">
                            Environmental Organizations
                        </h2>
                        <p className="text-base sm:text-lg text-white/70 font-light leading-relaxed max-w-2xl mx-auto px-4">
                            Manage environmental organizations and their operations across the platform
                        </p>
                </div>

                    {/* Organizations Table/Cards */}
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/20 shadow-2xl shadow-black/20 overflow-hidden">
                        {organizations.length === 0 ? (
                            <div className="text-center py-12 sm:py-16">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
                                    <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <h3 className="text-xl sm:text-2xl font-light text-white mb-3 sm:mb-4">No Organizations Found</h3>
                                <p className="text-white/60 font-light mb-6 sm:mb-8 text-sm sm:text-base px-4">No environmental organizations have registered on the platform yet.</p>
                                <button
                                    onClick={() => router.push('/admin/dashboard/manage-organizations/new')}
                                    className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-emerald-500/20 text-emerald-300 font-light rounded-xl sm:rounded-2xl hover:bg-emerald-500/30 transition-all duration-300 backdrop-blur-sm border border-emerald-500/30 hover:border-emerald-500/50 text-sm sm:text-base"
                                >
                                    <svg className="mr-2 h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add First Organization
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Desktop Table View */}
                                <div className="hidden lg:block overflow-x-auto">
                                    <table className="min-w-full">
                                        <thead>
                                            <tr className="border-b border-white/10">
                                                <th className="px-6 py-4 text-left text-sm font-medium text-white/90">Organization</th>
                                                <th className="px-6 py-4 text-left text-sm font-medium text-white/90">Contact</th>
                                                <th className="px-6 py-4 text-left text-sm font-medium text-white/90">Category</th>
                                                <th className="px-6 py-4 text-left text-sm font-medium text-white/90">Created</th>
                                                <th className="px-6 py-4 text-right text-sm font-medium text-white/90">Actions</th>
                            </tr>
                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {organizations.map((org) => (
                                                <tr key={org.id} className="hover:bg-white/5 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <Link 
                                                                href={`/admin/dashboard/manage-organizations/${org.id}`}
                                                                className="text-white font-light hover:text-emerald-300 transition-colors"
                                                            >
                                                                {org.organizationName}
                                                            </Link>
                                                            <div className="text-white/50 text-sm font-mono mt-1">{org.id}</div>
                                        </div>
                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <div className="text-white/80 font-light">{org.email}</div>
                                                            <div className="text-white/60 font-light text-sm">{org.phoneNumber}</div>
                                        </div>
                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="inline-flex items-center px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm font-medium border border-emerald-500/30">
                                                            <span className="mr-2">{getCategoryIcon(org.category)}</span>
                                                            {org.category}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-white/70 font-light text-sm">
                                                            {new Date(org.createdAt).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric'
                                                            })}
                                        </div>
                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end space-x-3">
                                        <Link 
                                                                href={`/admin/dashboard/manage-organizations/${org.id}`}
                                                                className="text-emerald-300 hover:text-emerald-200 font-light transition-colors"
                                        >
                                            View
                                        </Link>
                                        <button 
                                                                onClick={() => handleDelete(org.id)}
                                                                className="text-red-300 hover:text-red-200 font-light transition-colors"
                                        >
                                            Delete
                                        </button>
                                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                                </div>

                                {/* Mobile Card View */}
                                <div className="lg:hidden divide-y divide-white/5">
                                    {organizations.map((org) => (
                                        <div key={org.id} className="p-4 sm:p-6">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1 min-w-0">
                                                    <Link 
                                                        href={`/admin/dashboard/manage-organizations/${org.id}`}
                                                        className="block text-white font-light hover:text-emerald-300 transition-colors text-base sm:text-lg"
                                                    >
                                                        {org.organizationName}
                                                    </Link>
                                                    <p className="text-white/50 text-xs font-mono mt-1 break-all">{org.id}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-3 mb-4">
                                                <div>
                                                    <p className="text-white/60 text-xs font-medium">Contact Information</p>
                                                    <p className="text-white/80 font-light text-sm break-all">{org.email}</p>
                                                    <p className="text-white/60 font-light text-sm">{org.phoneNumber}</p>
                                                </div>
                                                
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-white/60 text-xs font-medium">Category</p>
                                                        <span className="inline-flex items-center px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-medium border border-emerald-500/30 mt-1">
                                                            <span className="mr-1">{getCategoryIcon(org.category)}</span>
                                                            {org.category}
                                                        </span>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-white/60 text-xs font-medium">Created</p>
                                                        <p className="text-white/70 font-light text-sm">
                                                            {new Date(org.createdAt).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric'
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex space-x-3">
                                                <Link 
                                                    href={`/admin/dashboard/manage-organizations/${org.id}`}
                                                    className="flex-1 text-center px-3 py-2 bg-emerald-500/20 text-emerald-300 font-light rounded-lg hover:bg-emerald-500/30 transition-all duration-300 border border-emerald-500/30 text-sm"
                                                >
                                                    View Details
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(org.id)}
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