import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session'; // Assuming getCurrentUser can be used in API routes

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user || !user.user_id) {
      return NextResponse.json(
        { success: false, message: 'User not authenticated' },
        { status: 401 }
      );
    }

    const userReports = await prisma.report.findMany({
      where: {
        userId: user.user_id,
      },
      select: {
        id: true,
        description: true,
        category: true,
        status: true,
        imagePath: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
        locationId: true,
        location: true, // Include location data if needed
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: userReports,
    });
  } catch (error) {
    console.error('Error fetching user reports:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch user reports' },
      { status: 500 }
    );
  }
} 