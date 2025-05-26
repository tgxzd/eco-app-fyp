import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';

export async function GET(
  request: Request, // Standard Request object
  { params }: { params: { id: string } }
) {
  try {
    const reportId = params.id;

    if (!reportId) {
      return NextResponse.json(
        { success: false, message: 'Report ID is required' },
        { status: 400 }
      );
    }

    const report = await prisma.report.findUnique({
      where: {
        id: reportId,
      },
      include: {
        location: true, // Include location details
        user: { // Optionally include basic user details (like name/email)
          select: {
            name: true,
            email: true,
          }
        }
      },
    });

    if (!report) {
      return NextResponse.json(
        { success: false, message: 'Report not found' },
        { status: 404 }
      );
    }

    // Optional: Check if the current user is authorized to view this report
    // This is important if reports are private or have specific access controls
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.user_id !== report.userId) {
        // If you want to restrict access only to the report owner
        // return NextResponse.json(
        //     { success: false, message: 'Unauthorized' },
        //     { status: 403 }
        // );
        // For now, let's assume reports can be viewed if found, 
        // but this is a place for future permission checks.
    }

    return NextResponse.json({
      success: true,
      data: report,
    });

  } catch (error) {
    console.error(`Error fetching report ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch report' },
      { status: 500 }
    );
  }
} 