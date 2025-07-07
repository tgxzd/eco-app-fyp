import { writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

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

const PENDING_FILE_PATH = path.join(process.cwd(), 'data', 'pending-organizations.json');

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.dirname(PENDING_FILE_PATH);
  if (!existsSync(dataDir)) {
    await mkdir(dataDir, { recursive: true });
  }
}

// Read pending organizations from file
export async function readPendingOrganizations(): Promise<PendingOrganization[]> {
  try {
    await ensureDataDir();
    
    if (!existsSync(PENDING_FILE_PATH)) {
      return [];
    }
    
    const data = await readFile(PENDING_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading pending organizations:', error);
    return [];
  }
}

// Write pending organizations to file
export async function writePendingOrganizations(organizations: PendingOrganization[]): Promise<void> {
  try {
    await ensureDataDir();
    await writeFile(PENDING_FILE_PATH, JSON.stringify(organizations, null, 2));
  } catch (error) {
    console.error('Error writing pending organizations:', error);
    throw error;
  }
}

// Add a new pending organization
export async function addPendingOrganization(organizationData: Omit<PendingOrganization, 'id' | 'submittedAt' | 'status'>): Promise<string> {
  const organizations = await readPendingOrganizations();
  
  // Check if email already exists in pending or rejected applications
  const existingPending = organizations.find(org => org.email === organizationData.email && org.status !== 'approved');
  if (existingPending) {
    throw new Error('An application with this email is already pending or has been rejected');
  }
  
  const newOrganization: PendingOrganization = {
    id: `pending_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...organizationData,
    submittedAt: new Date().toISOString(),
    status: 'pending'
  };
  
  organizations.push(newOrganization);
  await writePendingOrganizations(organizations);
  
  return newOrganization.id;
}

// Get pending organizations (only those with status 'pending')
export async function getPendingOrganizations(): Promise<PendingOrganization[]> {
  const organizations = await readPendingOrganizations();
  return organizations.filter(org => org.status === 'pending');
}

// Update organization status
export async function updateOrganizationStatus(id: string, status: 'approved' | 'rejected'): Promise<PendingOrganization | null> {
  const organizations = await readPendingOrganizations();
  const orgIndex = organizations.findIndex(org => org.id === id);
  
  if (orgIndex === -1) {
    return null;
  }
  
  organizations[orgIndex].status = status;
  await writePendingOrganizations(organizations);
  
  return organizations[orgIndex];
}

// Remove organization from pending list (used after successful approval and DB creation)
export async function removePendingOrganization(id: string): Promise<void> {
  const organizations = await readPendingOrganizations();
  const filteredOrganizations = organizations.filter(org => org.id !== id);
  await writePendingOrganizations(filteredOrganizations);
}

// Get organization by ID
export async function getPendingOrganizationById(id: string): Promise<PendingOrganization | null> {
  const organizations = await readPendingOrganizations();
  return organizations.find(org => org.id === id) || null;
} 