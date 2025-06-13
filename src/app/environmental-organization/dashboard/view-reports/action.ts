'use server';

import { prisma } from '@/lib/prisma';
import { getOrganization } from '@/lib/auth';

export async function getReportsByCategory() {
    try {
        // Get the current organization
        const organizationData = await getOrganization();
        
        if (!organizationData) {
            return { success: false, message: 'Not authenticated' };
        }

        // Fetch the organization's category
        const organization = await prisma.organization.findUnique({
            where: { id: organizationData.id },
            select: { category: true }
        });

        if (!organization) {
            return { success: false, message: 'Organization not found' };
        }

        // Fetch reports that match the organization's category
        const reports = await prisma.report.findMany({
            where: {
                category: organization.category
            },
            select: {
                id: true,
                description: true,
                category: true,
                status: true,
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

        return { success: true, data: reports, category: organization.category };
    } catch (error) {
        console.error('Error fetching reports by category:', error);
        return { success: false, message: 'Failed to fetch reports' };
    }
}

export async function getReportByIdForOrganization(reportId: string) {
    try {
        // Get the current organization
        const organizationData = await getOrganization();
        
        if (!organizationData) {
            return { success: false, message: 'Not authenticated' };
        }

        // Fetch the organization's category
        const organization = await prisma.organization.findUnique({
            where: { id: organizationData.id },
            select: { category: true }
        });

        if (!organization) {
            return { success: false, message: 'Organization not found' };
        }

        const report = await prisma.report.findUnique({
            where: { id: reportId },
            select: {
                id: true,
                description: true,
                category: true,
                status: true,
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

        // Check if the report matches the organization's category
        if (report.category !== organization.category) {
            return { success: false, message: 'Report category does not match organization focus' };
        }

        return { success: true, data: report };
    } catch (error) {
        console.error('Error fetching report:', error);
        return { success: false, message: 'Failed to fetch report' };
    }
}

export async function markReportAsResolved(reportId: string) {
    try {
        // Get the current organization
        const organizationData = await getOrganization();
        
        if (!organizationData) {
            return { success: false, message: 'Not authenticated' };
        }

        // Fetch the organization's category
        const organization = await prisma.organization.findUnique({
            where: { id: organizationData.id },
            select: { category: true }
        });

        if (!organization) {
            return { success: false, message: 'Organization not found' };
        }

        // First check if the report exists and matches the organization's category
        const report = await prisma.report.findUnique({
            where: { id: reportId },
            select: { category: true, status: true }
        });

        if (!report) {
            return { success: false, message: 'Report not found' };
        }

        if (report.category !== organization.category) {
            return { success: false, message: 'You can only resolve reports in your organization\'s focus area' };
        }

        if (report.status === 'resolved') {
            return { success: false, message: 'Report is already marked as resolved' };
        }

        // Update the report status to resolved
        const updatedReport = await prisma.report.update({
            where: { id: reportId },
            data: { status: 'resolved' },
            select: {
                id: true,
                description: true,
                category: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        return { success: true, data: updatedReport, message: 'Report marked as resolved successfully' };
    } catch (error) {
        console.error('Error marking report as resolved:', error);
        return { success: false, message: 'Failed to mark report as resolved' };
    }
} 