'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getPendingApplications, approveOrganization, rejectOrganization } from './action';
import { sendApprovalEmail, sendRejectionEmail } from '@/lib/email-service';
import Background from '@/components/Background';

interface PendingOrganization {
    id: string;
    organizationName: string;
    email: string;
    phoneNumber: string;
    category: string;
    submittedAt: string;
    status: 'pending' | 'approved' | 'rejected';
}

export default function PendingOrganizations() {
    const router = useRouter();
    const [pendingOrganizations, setPendingOrganizations] = useState<PendingOrganization[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        fetchPendingOrganizations();
    }, []);

    const fetchPendingOrganizations = async () => {
        try {
            const result = await getPendingApplications();

            if (!result.success) {
                throw new Error(result.message || 'Failed to fetch pending organizations');
            }

            if (result.data) {
                setPendingOrganizations(result.data);
            }
            setError(null);
        } catch (err) {
            setError('Failed to load pending organizations. Please try again later.');
            console.error('Error fetching pending organizations:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (organizationId: string) => {
        if (!confirm('Are you sure you want to approve this organization? They will be able to login immediately.')) {
            return;
        }

        setProcessingId(organizationId);
        try {
            // Get organization details before approval
            const organization = pendingOrganizations.find(org => org.id === organizationId);
            
            const result = await approveOrganization(organizationId);

            if (!result.success) {
                alert(result.message || 'Failed to approve organization');
                return;
            }

            // Send approval email notification
            if (organization) {
                try {
                    const emailResult = await sendApprovalEmail({
                        to_email: organization.email,
                        organization_name: organization.organizationName,
                    });
                    
                    if (!emailResult.success) {
                        console.warn('Failed to send approval email:', emailResult.error);
                        // Don't fail the entire process if email fails
                    }
                } catch (emailErr) {
                    console.warn('Email notification failed:', emailErr);
                    // Continue with approval even if email fails
                }
            }

            // Remove from pending list
            setPendingOrganizations(pending => pending.filter(org => org.id !== organizationId));
            alert('Organization approved successfully! They can now login and have been notified via email.');
        } catch (err) {
            console.error('Error approving organization:', err);
            alert('Failed to approve organization. Please try again.');
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (organizationId: string) => {
        const rejectionReason = prompt('Please provide a reason for rejection (optional):');
        
        if (!confirm('Are you sure you want to reject this organization? This action cannot be undone.')) {
            return;
        }

        setProcessingId(organizationId);
        try {
            // Get organization details before rejection
            const organization = pendingOrganizations.find(org => org.id === organizationId);
            
            const result = await rejectOrganization(organizationId);

            if (!result.success) {
                alert(result.message || 'Failed to reject organization');
                return;
            }

            // Send rejection email notification
            if (organization) {
                try {
                    const emailResult = await sendRejectionEmail({
                        to_email: organization.email,
                        organization_name: organization.organizationName,
                        message: rejectionReason ? 
                            `We regret to inform you that your application for "${organization.organizationName}" has been rejected. Reason: ${rejectionReason}. Please contact our support team if you have any questions.` : 
                            undefined
                    });
                    
                    if (!emailResult.success) {
                        console.warn('Failed to send rejection email:', emailResult.error);
                        // Don't fail the entire process if email fails
                    }
                } catch (emailErr) {
                    console.warn('Email notification failed:', emailErr);
                    // Continue with rejection even if email fails
                }
            }

            // Remove from pending list
            setPendingOrganizations(pending => pending.filter(org => org.id !== organizationId));
            alert('Organization application rejected and they have been notified via email.');
        } catch (err) {
            console.error('Error rejecting organization:', err);
            alert('Failed to reject organization. Please try again.');
        } finally {
            setProcessingId(null);
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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
                        <span className="text-white font-light text-lg">Loading pending applications...</span>
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
                            <h2 className="text-xl font-light text-white mb-4">Error Loading Applications</h2>
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
                                    Pending Applications
                                </h1>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full lg:w-auto">
                                <button
                                    onClick={() => router.push('/admin/dashboard/manage-organizations')}
                                    className="w-full sm:w-auto flex items-center justify-center px-3 sm:px-4 py-2 bg-emerald-500/20 text-emerald-300 font-light rounded-xl sm:rounded-2xl hover:bg-emerald-500/30 transition-all duration-300 backdrop-blur-sm border border-emerald-500/30 hover:border-emerald-500/50 text-sm sm:text-base"
                                >
                                    <svg className="mr-2 h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    Manage Organizations
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
                        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-orange-500/20 backdrop-blur-sm rounded-full mb-4 sm:mb-6 border border-orange-500/30 shadow-lg">
                            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-3 sm:mb-4 tracking-tight px-4">
                            Pending Organization Applications
                        </h2>
                        <p className="text-base sm:text-lg text-white/70 font-light leading-relaxed max-w-2xl mx-auto px-4">
                            Review and approve or reject environmental organization registration requests
                        </p>
                    </div>

                    {/* Applications List */}
                    {pendingOrganizations.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/20 backdrop-blur-sm rounded-full mb-6 border border-emerald-500/30">
                                <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-light text-white mb-3">All Caught Up!</h3>
                            <p className="text-white/70 font-light">No pending organization applications at the moment.</p>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {pendingOrganizations.map((organization) => (
                                <div
                                    key={organization.id}
                                    className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg overflow-hidden hover:bg-white/15 transition-all duration-300"
                                >
                                    <div className="p-6">
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                                            <div className="flex-1">
                                                <div className="flex items-start space-x-4">
                                                    <div className="flex-shrink-0">
                                                        <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30">
                                                            <span className="text-lg">{getCategoryIcon(organization.category)}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-lg font-medium text-white mb-1 truncate">
                                                            {organization.organizationName}
                                                        </h3>
                                                        <div className="space-y-1">
                                                            <p className="text-sm text-white/70">
                                                                <span className="font-medium">Email:</span> {organization.email}
                                                            </p>
                                                            <p className="text-sm text-white/70">
                                                                <span className="font-medium">Phone:</span> {organization.phoneNumber}
                                                            </p>
                                                            <p className="text-sm text-white/70">
                                                                <span className="font-medium">Focus:</span> {organization.category}
                                                            </p>
                                                            <p className="text-sm text-white/60">
                                                                <span className="font-medium">Submitted:</span> {formatDate(organization.submittedAt)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col sm:flex-row gap-3 lg:ml-6">
                                                <button
                                                    onClick={() => handleApprove(organization.id)}
                                                    disabled={processingId === organization.id}
                                                    className="flex items-center justify-center px-4 py-2 bg-emerald-500/20 text-emerald-300 font-light rounded-xl hover:bg-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 backdrop-blur-sm border border-emerald-500/30 hover:border-emerald-500/50"
                                                >
                                                    {processingId === organization.id ? (
                                                        <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                    ) : (
                                                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleReject(organization.id)}
                                                    disabled={processingId === organization.id}
                                                    className="flex items-center justify-center px-4 py-2 bg-red-500/20 text-red-300 font-light rounded-xl hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 backdrop-blur-sm border border-red-500/30 hover:border-red-500/50"
                                                >
                                                    {processingId === organization.id ? (
                                                        <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                    ) : (
                                                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    )}
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </>
    );
} 