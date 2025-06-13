'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { hashPassword } from '@/lib/auth';

// Types
export interface UpdateOrganizationData {
    organizationName?: string;
    email?: string;
    phoneNumber?: string;
    category?: string;
}

export interface CreateOrganizationData {
    organizationName: string;
    email: string;
    phoneNumber: string;
    password: string;
    category: string;
}

// Get all organizations
export async function getOrganizations() {
    try {
        await requireAdmin();

        const organizations = await prisma.organization.findMany({
            select: {
                id: true,
                organizationName: true,
                email: true,
                phoneNumber: true,
                category: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return { success: true, data: organizations };
    } catch (error) {
        console.error('Error fetching organizations:', error);
        if (error instanceof Error && error.message.includes('Unauthorized')) {
            return { success: false, message: 'Unauthorized' };
        }
        return { success: false, message: 'Failed to fetch organizations' };
    }
}

// Get organization by ID
export async function getOrganizationById(organizationId: string) {
    try {
        await requireAdmin();

        const organization = await prisma.organization.findUnique({
            where: { id: organizationId },
            select: {
                id: true,
                organizationName: true,
                email: true,
                phoneNumber: true,
                category: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!organization) {
            return { success: false, message: 'Organization not found' };
        }

        return { success: true, data: organization };
    } catch (error) {
        console.error('Error fetching organization:', error);
        if (error instanceof Error && error.message.includes('Unauthorized')) {
            return { success: false, message: 'Unauthorized' };
        }
        return { success: false, message: 'Failed to fetch organization' };
    }
}

// Create organization
export async function createOrganization(data: CreateOrganizationData) {
    try {
        await requireAdmin();

        // Check if organization with email already exists
        const existingOrganization = await prisma.organization.findUnique({
            where: { email: data.email }
        });

        if (existingOrganization) {
            return { success: false, message: 'Organization with this email already exists' };
        }

        // Hash the password
        const hashedPassword = await hashPassword(data.password);

        // Create the new organization
        const newOrganization = await prisma.organization.create({
            data: {
                organizationName: data.organizationName,
                email: data.email,
                phoneNumber: data.phoneNumber,
                password: hashedPassword,
                category: data.category,
            },
            select: {
                id: true,
                organizationName: true,
                email: true,
                phoneNumber: true,
                category: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        // Revalidate the organizations list page
        revalidatePath('/admin/dashboard/manage-organizations');

        return { success: true, data: newOrganization };
    } catch (error) {
        console.error('Error creating organization:', error);
        if (error instanceof Error && error.message.includes('Unauthorized')) {
            return { success: false, message: 'Unauthorized - Please log in' };
        }
        return { success: false, message: 'Failed to create organization' };
    }
}

// Update organization
export async function updateOrganization(organizationId: string, data: UpdateOrganizationData) {
    try {
        await requireAdmin();

        // Check if email is being updated and if it already exists
        if (data.email) {
            const existingOrganization = await prisma.organization.findFirst({
                where: { 
                    email: data.email,
                    NOT: { id: organizationId }
                }
            });

            if (existingOrganization) {
                return { success: false, message: 'An organization with this email already exists' };
            }
        }

        const updatedOrganization = await prisma.organization.update({
            where: { id: organizationId },
            data: {
                organizationName: data.organizationName,
                email: data.email,
                phoneNumber: data.phoneNumber,
                category: data.category,
            },
            select: {
                id: true,
                organizationName: true,
                email: true,
                phoneNumber: true,
                category: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        // Revalidate the organizations list and organization detail pages
        revalidatePath('/admin/dashboard/manage-organizations');
        revalidatePath(`/admin/dashboard/manage-organizations/${organizationId}`);

        return { success: true, data: updatedOrganization };
    } catch (error) {
        console.error('Error updating organization:', error);
        if (error instanceof Error && error.message.includes('Unauthorized')) {
            return { success: false, message: 'Unauthorized' };
        }
        return { success: false, message: 'Failed to update organization' };
    }
}

// Delete organization
export async function deleteOrganization(organizationId: string) {
    try {
        await requireAdmin();

        // Check if organization exists before deleting
        const organizationExists = await prisma.organization.findUnique({
            where: { id: organizationId },
            select: { id: true }
        });

        if (!organizationExists) {
            return { success: false, message: 'Organization not found' };
        }

        // Delete the organization
        await prisma.organization.delete({
            where: { id: organizationId },
        });

        // Revalidate the organizations list page
        revalidatePath('/admin/dashboard/manage-organizations');

        return { success: true, message: 'Organization deleted successfully' };
    } catch (error: unknown) {
        console.error('Server error in deleteOrganization:', error);
        if (error instanceof Error && error.message.includes('Unauthorized')) {
            return { success: false, message: 'Unauthorized - Please log in' };
        }
        return { success: false, message: 'Failed to delete organization. Please try again.' };
    }
} 