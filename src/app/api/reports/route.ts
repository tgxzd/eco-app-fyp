import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Fetch all reports that have locations with all necessary details
    const reportsWithLocations = await prisma.report.findMany({
      where: {
        locationId: {
          not: null
        }
      },
      include: {
        location: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ 
      success: true, 
      data: reportsWithLocations 
    });
  } catch (error) {
    console.error('Error fetching reports with locations:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
} 