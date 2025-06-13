'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/session';
import { prisma } from '@/lib/prisma';

export async function getOrganization(id: string) {
    try {
        await requireAdmin();

        const organization = await prisma.organization.findUnique({
            where: { id },
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

export async function updateOrganization(
    id: string,
    data: {
        organizationName: string;
        email: string;
        phoneNumber: string;
        category: string;
    }
) {
    try {
        await requireAdmin();

        // Check if the email is already in use by another organization
        if (data.email) {
            const existingOrganization = await prisma.organization.findFirst({
                where: {
                    email: data.email,
                    NOT: {
                        id: id
                    }
                }
            });

            if (existingOrganization) {
                return { success: false, message: 'Email is already in use by another organization' };
            }
        }

        // Update the organization
        const updatedOrganization = await prisma.organization.update({
            where: { id },
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
            }
        });

        // Revalidate the organization page
        revalidatePath(`/admin/dashboard/manage-organizations/${id}`);
        revalidatePath('/admin/dashboard/manage-organizations');

        return { success: true, data: updatedOrganization };
    } catch (error) {
        console.error('Error updating organization:', error);
        if (error instanceof Error && error.message.includes('Unauthorized')) {
            return { success: false, message: 'Unauthorized - Please log in' };
        }
        if (error instanceof Error && error.message.includes('Record to update not found')) {
            return { success: false, message: 'Organization not found' };
        }
        return { success: false, message: 'Failed to update organization' };
    }
}

export async function deleteOrganization(id: string) {
    try {
        await requireAdmin();

        await prisma.organization.delete({
            where: { id }
        });

        // Revalidate the organizations list page
        revalidatePath('/admin/dashboard/manage-organizations');

        return { success: true };
    } catch (error) {
        console.error('Error deleting organization:', error);
        if (error instanceof Error && error.message.includes('Unauthorized')) {
            return { success: false, message: 'Unauthorized - Please log in' };
        }
        if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
            return { success: false, message: 'Organization not found' };
        }
        return { success: false, message: 'Failed to delete organization' };
    }
} 