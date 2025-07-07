import { prisma } from './prisma';

export interface PendingOrganization {
  id: string;
  organizationName: string;
  email: string;
  phoneNumber: string;
  password: string; // hashed
  category: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

// Helper function to validate status
function validateStatus(status: string): 'pending' | 'approved' | 'rejected' {
  if (status === 'pending' || status === 'approved' || status === 'rejected') {
    return status;
  }
  // Default fallback
  return 'pending';
}

// Add a new pending organization
export async function addPendingOrganization(organizationData: Omit<PendingOrganization, 'id' | 'submittedAt' | 'status'>): Promise<string> {
  try {
    // Check if email already exists in pending applications
    const existingPending = await prisma.pendingOrganization.findUnique({
      where: { email: organizationData.email }
    });

    if (existingPending) {
      throw new Error('An application with this email is already pending or has been rejected');
    }

    // Check if email already exists in approved organizations
    const existingOrganization = await prisma.organization.findUnique({
      where: { email: organizationData.email }
    });

    if (existingOrganization) {
      throw new Error('An organization with this email already exists');
    }

    // Create a new pending organization
    const newOrganization = await prisma.pendingOrganization.create({
      data: {
        organizationName: organizationData.organizationName,
        email: organizationData.email,
        phoneNumber: organizationData.phoneNumber,
        password: organizationData.password,
        category: organizationData.category,
        status: 'pending'
      }
    });

    return newOrganization.id;
  } catch (error) {
    console.error('Error adding pending organization:', error);
    throw error;
  }
}

// Get pending organizations (only those with status 'pending')
export async function getPendingOrganizations(): Promise<PendingOrganization[]> {
  try {
    const pendingOrgs = await prisma.pendingOrganization.findMany({
      where: { status: 'pending' }
    });

    // Convert date to string for compatibility with interface and validate status
    return pendingOrgs.map(org => ({
      id: org.id,
      organizationName: org.organizationName,
      email: org.email,
      phoneNumber: org.phoneNumber,
      password: org.password,
      category: org.category,
      submittedAt: org.submittedAt.toISOString(),
      status: validateStatus(org.status)
    }));
  } catch (error) {
    console.error('Error getting pending organizations:', error);
    return [];
  }
}

// Update organization status
export async function updateOrganizationStatus(id: string, status: 'approved' | 'rejected'): Promise<PendingOrganization | null> {
  try {
    const updatedOrg = await prisma.pendingOrganization.update({
      where: { id },
      data: { status }
    });

    return {
      id: updatedOrg.id,
      organizationName: updatedOrg.organizationName,
      email: updatedOrg.email,
      phoneNumber: updatedOrg.phoneNumber,
      password: updatedOrg.password,
      category: updatedOrg.category,
      submittedAt: updatedOrg.submittedAt.toISOString(),
      status: validateStatus(updatedOrg.status)
    };
  } catch (error) {
    console.error('Error updating organization status:', error);
    return null;
  }
}

// Remove organization from pending list (used after successful approval and DB creation)
export async function removePendingOrganization(id: string): Promise<void> {
  try {
    await prisma.pendingOrganization.delete({
      where: { id }
    });
  } catch (error) {
    console.error('Error removing pending organization:', error);
    throw error;
  }
}

// Get organization by ID
export async function getPendingOrganizationById(id: string): Promise<PendingOrganization | null> {
  try {
    const org = await prisma.pendingOrganization.findUnique({
      where: { id }
    });

    if (!org) {
      return null;
    }

    return {
      id: org.id,
      organizationName: org.organizationName,
      email: org.email,
      phoneNumber: org.phoneNumber,
      password: org.password,
      category: org.category,
      submittedAt: org.submittedAt.toISOString(),
      status: validateStatus(org.status)
    };
  } catch (error) {
    console.error('Error getting pending organization by ID:', error);
    return null;
  }
} 