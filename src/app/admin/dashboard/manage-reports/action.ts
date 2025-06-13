'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/session';
import { revalidatePath } from 'next/cache';

// Types
export interface UpdateReportData {
    description?: string;
    category?: string;
}

// Get all reports
export async function getReports() {
    try {
        await requireAdmin();

        const reports = await prisma.report.findMany({
            select: {
                id: true,
                description: true,
                category: true,
                createdAt: true,
                updatedAt: true,
                imagePath: true,
                userId: true,
                locationId: true,
                user: {
                    select: {
                        user_id: true,
                        name: true,
                        email: true,
                    }
                },
                location: {
                    select: {
                        id: true,
                        address: true,
                        latitude: true,
                        longitude: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return { success: true, data: reports };
    } catch (error) {
        console.error('Error fetching reports:', error);
        if (error instanceof Error && error.message.includes('Unauthorized')) {
            return { success: false, message: 'Unauthorized' };
        }
        return { success: false, message: 'Failed to fetch reports' };
    }
}

// Get report by ID
export async function getReportById(reportId: string) {
    try {
        await requireAdmin();

        const report = await prisma.report.findUnique({
            where: { id: reportId },
            select: {
                id: true,
                description: true,
                category: true,
                createdAt: true,
                updatedAt: true,
                imagePath: true,
                userId: true,
                locationId: true,
                user: {
                    select: {
                        user_id: true,
                        name: true,
                        email: true,
                    }
                },
                location: {
                    select: {
                        id: true,
                        address: true,
                        latitude: true,
                        longitude: true,
                    }
                }
            },
        });

        if (!report) {
            return { success: false, message: 'Report not found' };
        }

        return { success: true, data: report };
    } catch (error) {
        console.error('Error fetching report:', error);
        if (error instanceof Error && error.message.includes('Unauthorized')) {
            return { success: false, message: 'Unauthorized' };
        }
        return { success: false, message: 'Failed to fetch report' };
    }
}

// Update report
export async function updateReport(reportId: string, data: UpdateReportData) {
    try {
        await requireAdmin();

        const updatedReport = await prisma.report.update({
            where: { id: reportId },
            data: {
                description: data.description,
                category: data.category,
            },
            select: {
                id: true,
                description: true,
                category: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        user_id: true,
                        name: true,
                        email: true,
                    }
                },
                location: {
                    select: {
                        id: true,
                        address: true,
                        latitude: true,
                        longitude: true,
                    }
                }
            },
        });

        // Revalidate the reports list and report detail pages
        revalidatePath('/admin/dashboard/manage-reports');
        revalidatePath(`/admin/dashboard/manage-reports/${reportId}`);

        return { success: true, data: updatedReport };
    } catch (error) {
        console.error('Error updating report:', error);
        if (error instanceof Error && error.message.includes('Unauthorized')) {
            return { success: false, message: 'Unauthorized' };
        }
        return { success: false, message: 'Failed to update report' };
    }
}

// Delete report
export async function deleteReport(reportId: string) {
    try {
        await requireAdmin();

        // Check if report exists before deleting
        const reportExists = await prisma.report.findUnique({
            where: { id: reportId },
            select: { 
                id: true,
                locationId: true 
            }
        });

        if (!reportExists) {
            return { success: false, message: 'Report not found' };
        }

        // Delete the report and its associated location in a transaction
        await prisma.$transaction(async (tx) => {
            // First delete the report (this will automatically handle the relationship)
            await tx.report.delete({
                where: { id: reportId },
            });

            // If there's a location associated, delete it
            if (reportExists.locationId) {
                await tx.location.delete({
                    where: { id: reportExists.locationId }
                });
            }
        });

        // Revalidate the reports list page
        revalidatePath('/admin/dashboard/manage-reports');

        return { success: true, message: 'Report deleted successfully' };
    } catch (error: unknown) {
        console.error('Server error in deleteReport:', error);
        if (error instanceof Error && error.message.includes('Unauthorized')) {
            return { success: false, message: 'Unauthorized - Please log in' };
        }
        return { success: false, message: 'Failed to delete report. Please try again.' };
    }
} 