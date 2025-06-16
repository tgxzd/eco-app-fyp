'use client';

import LogoutButton from '@/components/ui/LogoutButton';
import Background from '@/components/Background';
import Link from 'next/link';

export default function AdminDashboard() {
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
                                    Admin Dashboard
                                </h1>
                            </div>

                            {/* Logout Button */}
                            <LogoutButton />
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
                    {/* Welcome Section */}
                    <div className="text-center mb-8 sm:mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500/20 backdrop-blur-sm rounded-full mb-4 sm:mb-6 border border-emerald-500/30 shadow-lg">
                            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-3 sm:mb-4 tracking-tight px-4">
                            Welcome, Admin!
                        </h2>
                        <p className="text-base sm:text-lg text-white/70 font-light leading-relaxed max-w-2xl mx-auto px-4">
                            Manage users, reports, and environmental organizations from your centralized dashboard
                        </p>
                    </div>

                    {/* Admin Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                        {/* Manage Users Card */}
                        <Link href="/admin/dashboard/manage-users" className="block group">
                            <div className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/20 shadow-2xl shadow-black/20 overflow-hidden hover:bg-white/15 transition-all duration-300">
                                <div className="p-6 sm:p-8">
                                    <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg sm:text-xl font-light text-white mb-1 sm:mb-2">Manage Users</h3>
                                            <div className="w-10 sm:w-12 h-px bg-blue-400/30"></div>
                                        </div>
                                    </div>
                                    <p className="text-white/70 font-light leading-relaxed text-sm sm:text-base">
                                        View and manage user accounts, roles, and permissions across the platform
                                    </p>
                                    <div className="flex items-center justify-end mt-4 sm:mt-6">
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white/40 group-hover:text-white/70 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Manage Reports Card */}
                        <Link href="/admin/dashboard/manage-reports" className="block group">
                            <div className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/20 shadow-2xl shadow-black/20 overflow-hidden hover:bg-white/15 transition-all duration-300">
                                <div className="p-6 sm:p-8">
                                    <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg sm:text-xl font-light text-white mb-1 sm:mb-2">Manage Reports</h3>
                                            <div className="w-10 sm:w-12 h-px bg-green-400/30"></div>
                                        </div>
                                    </div>
                                    <p className="text-white/70 font-light leading-relaxed text-sm sm:text-base">
                                        Review and handle environmental reports and feedback from users
                                    </p>
                                    <div className="flex items-center justify-end mt-4 sm:mt-6">
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white/40 group-hover:text-white/70 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Manage Organizations Card */}
                        <Link href="/admin/dashboard/manage-organizations" className="block group md:col-span-2 xl:col-span-1">
                            <div className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/20 shadow-2xl shadow-black/20 overflow-hidden hover:bg-white/15 transition-all duration-300">
                                <div className="p-6 sm:p-8">
                                    <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg sm:text-xl font-light text-white mb-1 sm:mb-2">Manage Organizations</h3>
                                            <div className="w-10 sm:w-12 h-px bg-emerald-400/30"></div>
                                        </div>
                                    </div>
                                    <p className="text-white/70 font-light leading-relaxed text-sm sm:text-base">
                                        View and manage environmental organizations and their operations
                                    </p>
                                    <div className="flex items-center justify-end mt-4 sm:mt-6">
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white/40 group-hover:text-white/70 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </main>
            </div>
        </>
    );
} 