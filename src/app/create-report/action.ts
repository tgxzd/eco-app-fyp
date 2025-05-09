'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';

export type CreateReportResponse = {
  success: boolean;
  message: string;
  data?: any;
};

export async function createReport(formData: FormData): Promise<CreateReportResponse> {
  try {
    // Get the current user
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        message: 'You must be logged in to create a report',
      };
    }

    // Extract data from form
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;

    // Validate input
    if (!description || !category) {
      return {
        success: false,
        message: 'Description and category are required',
      };
    }

    // Insert the report using raw SQL query
    // This is a workaround for Prisma client generation issues
    const result = await prisma.$queryRaw`
      INSERT INTO "Report" ("id", "description", "category", "status", "createdAt", "updatedAt", "userId")
      VALUES (gen_random_uuid(), ${description}, ${category}, 'pending', NOW(), NOW(), ${user.user_id})
      RETURNING *
    `;

    // Revalidate the report page
    revalidatePath('/create-report');
    revalidatePath('/your-report');

    return {
      success: true,
      message: 'Report created successfully',
      data: result,
    };
  } catch (error) {
    console.error('Error creating report:', error);
    return {
      success: false,
      message: 'Failed to create report',
    };
  }
} 