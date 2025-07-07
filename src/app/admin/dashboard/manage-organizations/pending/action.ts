'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import {
  getPendingOrganizations,
  getPendingOrganizationById,
  removePendingOrganization,
  updateOrganizationStatus
} from '@/lib/pending-organizations';
import type { PendingOrganization } from '@/lib/pending-organizations';

// Get all pending organization applications
export async function getPendingApplications() {
  try {
    await requireAdmin();

    const pendingOrganizations = await getPendingOrganizations();

    return { success: true, data: pendingOrganizations };
  } catch (error) {
    console.error('Error fetching pending organizations:', error);
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return { success: false, message: 'Unauthorized' };
    }
    return { success: false, message: 'Failed to fetch pending organizations' };
  }
}

// Approve organization and create it in the database
export async function approveOrganization(pendingId: string) {
  try {
    await requireAdmin();

    // Get the pending organization
    const pendingOrg = await getPendingOrganizationById(pendingId);
    
    if (!pendingOrg) {
      return { success: false, message: 'Pending organization not found' };
    }

    if (pendingOrg.status !== 'pending') {
      return { success: false, message: 'Organization has already been processed' };
    }

    // Check if organization with email already exists in database
    const existingOrganization = await prisma.organization.findUnique({
      where: { email: pendingOrg.email }
    });

    if (existingOrganization) {
      return { success: false, message: 'Organization with this email already exists in the system' };
    }

    // Create the organization in the database
    const newOrganization = await prisma.organization.create({
      data: {
        organizationName: pendingOrg.organizationName,
        email: pendingOrg.email,
        phoneNumber: pendingOrg.phoneNumber,
        password: pendingOrg.password, // Already hashed
        category: pendingOrg.category,
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

    // Remove from pending list
    await removePendingOrganization(pendingId);

    // Revalidate relevant pages
    revalidatePath('/admin/dashboard/manage-organizations');
    revalidatePath('/admin/dashboard/manage-organizations/pending');

    return { 
      success: true, 
      data: newOrganization,
      message: 'Organization approved and created successfully'
    };
  } catch (error) {
    console.error('Error approving organization:', error);
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return { success: false, message: 'Unauthorized - Please log in' };
    }
    return { success: false, message: 'Failed to approve organization' };
  }
}

// Reject organization application
export async function rejectOrganization(pendingId: string) {
  try {
    await requireAdmin();

    // Get the pending organization
    const pendingOrg = await getPendingOrganizationById(pendingId);
    
    if (!pendingOrg) {
      return { success: false, message: 'Pending organization not found' };
    }

    if (pendingOrg.status !== 'pending') {
      return { success: false, message: 'Organization has already been processed' };
    }

    // Update status to rejected (we keep the record for audit purposes)
    await updateOrganizationStatus(pendingId, 'rejected');

    // Revalidate relevant pages
    revalidatePath('/admin/dashboard/manage-organizations/pending');

    return { 
      success: true,
      message: 'Organization application rejected'
    };
  } catch (error) {
    console.error('Error rejecting organization:', error);
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return { success: false, message: 'Unauthorized - Please log in' };
    }
    return { success: false, message: 'Failed to reject organization' };
  }
} 