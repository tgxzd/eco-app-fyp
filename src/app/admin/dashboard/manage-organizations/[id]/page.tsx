'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getOrganizationById, updateOrganization, deleteOrganization } from '../action';

interface Organization {
    id: string;
    organizationName: string;
    email: string;
    phoneNumber: string;
    createdAt: string | Date;
    updatedAt: string | Date;
    category: string;
}

export default function OrganizationDetails() {
    const router = useRouter();
    const params = useParams();
    const [isPending, startTransition] = useTransition();
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"success" | "error">("success");
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchOrganization();
    }, []);

    const fetchOrganization = async () => {
        try {
            const result = await getOrganizationById(params.id as string);

            if (!result.success) {
                throw new Error(result.message || 'Failed to fetch organization');
            }

            setOrganization(result.data || null);
            setError(null);
        } catch (err) {
            setError('Failed to load organization details. Please try again later.');
            console.error('Error fetching organization:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (formData: FormData) => {
        if (!organization) return;

        setMessage("");
        
        const organizationName = formData.get("organizationName") as string;
        const email = formData.get("email") as string;
        const phoneNumber = formData.get("phoneNumber") as string;
        const category = formData.get("category") as string;

        startTransition(async () => {
            try {
                const result = await updateOrganization(organization.id, {
                    organizationName,
                    email,
                    phoneNumber,
                    category
                });
                
                if (result.success) {
                    setMessageType("success");
                    setMessage("Organization updated successfully!");
                    setOrganization(result.data || organization);
                    setIsEditing(false);
                } else {
                    setMessageType("error");
                    setMessage(result.message || "An error occurred");
                }
            } catch (error) {
                setMessageType("error");
                setMessage("An unexpected error occurred. Please try again.");
                console.error('Error updating organization:', error);
            }
        });
    };

    const handleDelete = async () => {
        if (!organization) return;

        if (!confirm(`Are you sure you want to delete "${organization.organizationName}"? This action cannot be undone.`)) {
            return;
        }

        try {
            const result = await deleteOrganization(organization.id);

            if (result.success) {
                alert('Organization deleted successfully');
                router.push('/admin/dashboard/manage-organizations');
            } else {
                alert(result.message || 'Failed to delete organization');
            }
        } catch (error) {
            alert('Failed to delete organization. Please try again.');
            console.error('Error deleting organization:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 py-8">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">Loading organization details...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 py-8">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center text-red-600">{error}</div>
                </div>
            </div>
        );
    }

    if (!organization) {
        return (
            <div className="min-h-screen bg-gray-100 py-8">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">Organization not found</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Organization Details</h1>
                    <div className="flex gap-2">
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                Edit
                            </button>
                        )}
                        <button
                            onClick={handleDelete}
                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                        >
                            Delete
                        </button>
                        <button
                            onClick={() => router.push('/admin/dashboard/manage-organizations')}
                            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
                        >
                            Back to Organizations
                        </button>
                    </div>
                </div>

                {message && (
                    <div className={`border-l-4 p-4 mb-6 ${
                        messageType === "error" 
                            ? "bg-red-50 border-red-400 text-red-700" 
                            : "bg-green-50 border-green-400 text-green-700"
                    }`}>
                        <p>{message}</p>
                    </div>
                )}

                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900">
                            {isEditing ? 'Edit Organization' : 'Organization Information'}
                        </h2>
                    </div>

                    <div className="px-6 py-4">
                        {isEditing ? (
                            <form action={handleUpdate}>
                                <div className="grid grid-cols-1 gap-6">
                                    <div>
                                        <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-2">
                                            Organization Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="organizationName"
                                            name="organizationName"
                                            defaultValue={organization.organizationName}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            defaultValue={organization.email}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            id="phoneNumber"
                                            name="phoneNumber"
                                            defaultValue={organization.phoneNumber}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                            Environmental Focus *
                                        </label>
                                        <select
                                            id="category"
                                            name="category"
                                            defaultValue={organization.category}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="air pollution">Air Pollution</option>
                                            <option value="water pollution">Water Pollution</option>
                                            <option value="wildfire">Wildfire</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setMessage("");
                                        }}
                                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isPending}
                                        className="px-4 py-2 border border-transparent rounded-md shadow-sm bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {isPending ? "Updating..." : "Update Organization"}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <dl className="grid grid-cols-1 gap-6">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Organization Name</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{organization.organizationName}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{organization.email}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{organization.phoneNumber}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Environmental Focus</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{organization.category}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Created At</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {new Date(organization.createdAt).toLocaleString()}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {new Date(organization.updatedAt).toLocaleString()}
                                    </dd>
                                </div>
                            </dl>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 