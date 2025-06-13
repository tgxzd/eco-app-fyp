'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { logoutOrganization } from '../action';
import Image from 'next/image';
import artwork from '../../../../public/images/gambar.jpg';

interface OrganizationInfo {
  id: string;
  organizationName: string;
  email: string;
  phoneNumber: string;
}

export default function DashboardPage() {
  const [organizationInfo, setOrganizationInfo] = useState<OrganizationInfo | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch organization info
    const fetchOrganizationInfo = async () => {
      try {
        const response = await fetch('/api/organization/profile');
        const data = await response.json();
        
        if (data.success) {
          setOrganizationInfo(data.organization);
        } else {
          console.error('Failed to fetch organization info:', data.error);
        }
      } catch (error) {
        console.error('Error fetching organization info:', error);
      }
    };

    fetchOrganizationInfo();
  }, []);

  const handleLogout = async () => {
    const result = await logoutOrganization();
    if (result.success) {
      router.replace('/environmental-organization/login');
    }
  };

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

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <header className="bg-black/50 border-b border-amber-700/30 p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold text-amber-100">
              Environmental Organization Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded-md transition-colors"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto p-6">
          <div className="bg-black/50 border border-amber-700/30 rounded-lg p-6 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-amber-100 mb-6">Organization Information</h2>
            
            {organizationInfo ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-amber-100/70">Organization Name</label>
                  <p className="text-amber-100">{organizationInfo.organizationName}</p>
                </div>
                <div>
                  <label className="block text-sm text-amber-100/70">Email Address</label>
                  <p className="text-amber-100">{organizationInfo.email}</p>
                </div>
                <div>
                  <label className="block text-sm text-amber-100/70">Phone Number</label>
                  <p className="text-amber-100">{organizationInfo.phoneNumber}</p>
                </div>
              </div>
            ) : (
              <div className="text-amber-100/70">Loading organization information...</div>
            )}
          </div>

          {/* Additional Dashboard Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-black/50 border border-amber-700/30 rounded-lg p-6 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-amber-100 mb-4">Recent Activities</h2>
              <p className="text-amber-100/70">No recent activities to display.</p>
            </div>
            
            <div className="bg-black/50 border border-amber-700/30 rounded-lg p-6 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-amber-100 mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <button 
                  onClick={() => router.push('/environmental-organization/dashboard/view-reports')}
                  className="w-full px-4 py-2 bg-amber-700/50 hover:bg-amber-700 text-amber-100 rounded-md transition-colors"
                >
                  View Reports
                </button>
                <button 
                  onClick={() => router.push('/environmental-organization/dashboard/manage-profile')}
                  className="w-full px-4 py-2 bg-amber-700/50 hover:bg-amber-700 text-amber-100 rounded-md transition-colors"
                >
                  Manage Profile
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
