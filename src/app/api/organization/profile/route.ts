import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrganization } from '@/lib/auth';

export async function GET() {
  try {
    // Get the current organization from the session
    const organizationData = await getOrganization();
    
    if (!organizationData) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Fetch the organization's full profile
    const organization = await prisma.organization.findUnique({
      where: { id: organizationData.id },
      select: {
        id: true,
        organizationName: true,
        email: true,
        phoneNumber: true,
        category: true,
        createdAt: true,
      },
    });

    if (!organization) {
      return NextResponse.json(
        { success: false, error: 'Organization not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      organization,
    });
  } catch (error) {
    console.error('Error fetching organization profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch organization profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const organizationData = await getOrganization();
    
    if (!organizationData) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { organizationName, email, phoneNumber, category } = body;

    // Validate required fields
    if (!organizationName || !email || !phoneNumber || !category) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if email is already taken by another organization
    const existingOrg = await prisma.organization.findFirst({
      where: {
        email,
        id: { not: organizationData.id },
      },
    });

    if (existingOrg) {
      return NextResponse.json(
        { success: false, error: 'Email is already taken by another organization' },
        { status: 400 }
      );
    }

    // Update organization profile
    const updatedOrganization = await prisma.organization.update({
      where: { id: organizationData.id },
      data: {
        organizationName,
        email,
        phoneNumber,
        category,
      },
      select: {
        id: true,
        organizationName: true,
        email: true,
        phoneNumber: true,
        category: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      organization: updatedOrganization,
    });
  } catch (error) {
    console.error('Error updating organization profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update organization profile' },
      { status: 500 }
    );
  }
} 