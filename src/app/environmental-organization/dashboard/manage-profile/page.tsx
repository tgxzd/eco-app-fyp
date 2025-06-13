'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import artwork from '../../../../../public/images/gambar.jpg';

interface OrganizationInfo {
  id: string;
  organizationName: string;
  email: string;
  phoneNumber: string;
  category?: string;
}

export default function ManageProfilePage() {
  const [organizationInfo, setOrganizationInfo] = useState<OrganizationInfo | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchOrganizationInfo();
  }, []);

  const fetchOrganizationInfo = async () => {
    try {
      const response = await fetch('/api/organization/profile');
      const data = await response.json();
      
      if (data.success) {
        setOrganizationInfo(data.organization);
      } else {
        setError(data.error || 'Failed to fetch organization info');
      }
    } catch {
      setError('Error fetching organization information');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch('/api/organization/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organizationName: formData.get('organizationName'),
          email: formData.get('email'),
          phoneNumber: formData.get('phoneNumber'),
          category: formData.get('category'),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Profile updated successfully');
        setOrganizationInfo(data.organization);
        setIsEditing(false);
      } else {
        setError(data.error || 'Failed to update profile');
      }
    } catch {
      setError('An error occurred while updating profile');
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
              Manage Organization Profile
            </h1>
            <button
              onClick={() => router.push('/environmental-organization/dashboard')}
              className="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded-md transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-3xl mx-auto p-6">
          <div className="bg-black/50 border border-amber-700/30 rounded-lg p-6 backdrop-blur-sm">
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded text-red-500">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-3 bg-green-500/10 border border-green-500/50 rounded text-green-500">
                {success}
              </div>
            )}

            {organizationInfo ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-amber-100">Profile Information</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2 bg-amber-700/50 hover:bg-amber-700 text-amber-100 rounded-md transition-colors"
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>

                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="organizationName" className="block text-sm text-amber-100/70 mb-1">
                        Organization Name
                      </label>
                      <input
                        type="text"
                        id="organizationName"
                        name="organizationName"
                        defaultValue={organizationInfo.organizationName}
                        className="w-full px-4 py-2 bg-black/30 border border-amber-700/50 rounded-md text-amber-100 placeholder-amber-100/50 focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm text-amber-100/70 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        defaultValue={organizationInfo.email}
                        className="w-full px-4 py-2 bg-black/30 border border-amber-700/50 rounded-md text-amber-100 placeholder-amber-100/50 focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="phoneNumber" className="block text-sm text-amber-100/70 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        defaultValue={organizationInfo.phoneNumber}
                        className="w-full px-4 py-2 bg-black/30 border border-amber-700/50 rounded-md text-amber-100 placeholder-amber-100/50 focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="category" className="block text-sm text-amber-100/70 mb-1">
                        Environmental Focus
                      </label>
                      <select
                        id="category"
                        name="category"
                        defaultValue={organizationInfo.category || ''}
                        className="w-full px-4 py-2 bg-black/30 border border-amber-700/50 rounded-md text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent"
                        required
                      >
                        <option value="air pollution">Air Pollution</option>
                        <option value="water pollution">Water Pollution</option>
                        <option value="wildfire">Wildfire</option>
                      </select>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded-md transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
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
                    <div>
                      <label className="block text-sm text-amber-100/70">Environmental Focus</label>
                      <p className="text-amber-100">{organizationInfo.category || 'Not specified'}</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-amber-100/70">Loading organization information...</div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
} 