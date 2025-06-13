'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createOrganization } from '../action';

export default function NewOrganization() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"success" | "error">("success");

    const handleSubmit = async (formData: FormData) => {
        setMessage("");
        
        const organizationName = formData.get("organizationName") as string;
        const email = formData.get("email") as string;
        const phoneNumber = formData.get("phoneNumber") as string;
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;
        const category = formData.get("category") as string;

        // Client-side validation
        if (password !== confirmPassword) {
            setMessageType("error");
            setMessage("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setMessageType("error");
            setMessage("Password must be at least 6 characters long");
            return;
        }

        startTransition(async () => {
            try {
                const result = await createOrganization({
                    organizationName,
                    email,
                    phoneNumber,
                    password,
                    category
                });
                
                if (result.success) {
                    setMessageType("success");
                    setMessage("Organization created successfully!");
                    // Redirect after a short delay
                    setTimeout(() => {
                        router.push('/admin/dashboard/manage-organizations');
                    }, 2000);
                } else {
                    setMessageType("error");
                    setMessage(result.message || "An error occurred");
                }
            } catch (error) {
                setMessageType("error");
                setMessage("An unexpected error occurred. Please try again.");
                console.error('Error creating organization:', error);
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Add New Environmental Organization</h1>
                    <button
                        onClick={() => router.push('/admin/dashboard/manage-organizations')}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
                    >
                        Back to Organizations
                    </button>
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

                <div className="bg-white shadow-md rounded-lg p-6">
                    <form action={handleSubmit}>
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-2">
                                    Organization Name *
                                </label>
                                <input
                                    type="text"
                                    id="organizationName"
                                    name="organizationName"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter organization name"
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
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="organization@example.com"
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
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="+1234567890"
                                />
                            </div>

                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                    Environmental Focus *
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Select a focus area</option>
                                    <option value="air pollution">Air Pollution</option>
                                    <option value="water pollution">Water Pollution</option>
                                    <option value="wildfire">Wildfire</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password *
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    required
                                    minLength={6}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Minimum 6 characters"
                                />
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password *
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    required
                                    minLength={6}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Confirm password"
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => router.push('/admin/dashboard/manage-organizations')}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                {isPending ? "Creating..." : "Create Organization"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 