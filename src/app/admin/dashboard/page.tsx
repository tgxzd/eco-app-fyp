'use client';

import LogoutButton from '@/components/ui/LogoutButton';

export default function AdminDashboard() {
    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-gray-900">
                                Admin Dashboard
                            </h1>
                        </div>
                        <div className="flex items-center">
                            <LogoutButton />
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h2 className="text-3xl font-bold text-gray-900">
                                Welcome, Admin!
                            </h2>
                            <p className="mt-4 text-gray-600">
                                You have successfully logged in to the admin dashboard.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
} 