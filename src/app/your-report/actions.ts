'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { revalidatePath } from 'next/cache';

export async function deleteReport(reportId: string) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return {
        success: false,
        message: 'You must be logged in to delete a report',
      };
    }

    // Find the report first to check ownership
    const report = await prisma.report.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      return {
        success: false,
        message: 'Report not found',
      };
    }

    // Check if the user owns this report
    if (report.userId !== user.user_id) {
      return {
        success: false,
        message: 'You are not authorized to delete this report',
      };
    }

    // Delete the report
    await prisma.report.delete({
      where: { id: reportId },
    });

    // Revalidate the reports pages
    revalidatePath('/your-report');
    revalidatePath(`/your-report/${reportId}`);

    return {
      success: true,
      message: 'Report deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting report:', error);
    return {
      success: false,
      message: 'Failed to delete report',
    };
  }
} 