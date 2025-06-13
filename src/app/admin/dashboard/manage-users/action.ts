'use server';

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { requireAdmin } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { hashPassword } from '@/lib/auth';

// Types
export interface UpdateUserData {
    name?: string | null;
    email?: string;
}

export interface CreateUserData {
    name: string;
    email: string;
    password: string;
}

// Create user
export async function createUser(data: CreateUserData) {
    try {
        await requireAdmin();

        // Check if user with email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email }
        });

        if (existingUser) {
            return { success: false, message: 'User with this email already exists' };
        }

        // Hash the password
        const hashedPassword = await hashPassword(data.password);

        // Create the new user
        const newUser = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
            },
            select: {
                user_id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        // Revalidate the users list page
        revalidatePath('/admin/dashboard/manage-users');

        return { success: true, data: newUser };
    } catch (error) {
        console.error('Error creating user:', error);
        return { success: false, message: 'Failed to create user' };
    }
}

// Get all users
export async function getUsers() {
    try {
        await requireAdmin();

        const users = await prisma.user.findMany({
            select: {
                user_id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return { success: true, data: users };
    } catch (error) {
        console.error('Error fetching users:', error);
        if (error instanceof Error && error.message.includes('Unauthorized')) {
            return { success: false, message: 'Unauthorized' };
        }
        return { success: false, message: 'Failed to fetch users' };
    }
}

// Get user by ID
export async function getUserById(userId: string) {
    try {
        await requireAdmin();

        const user = await prisma.user.findUnique({
            where: { user_id: userId },
            select: {
                user_id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
               
            },
        });

        if (!user) {
            return { success: false, message: 'User not found' };
        }

        return { success: true, data: user };
    } catch (error) {
        console.error('Error fetching user:', error);
        if (error instanceof Error && error.message.includes('Unauthorized')) {
            return { success: false, message: 'Unauthorized' };
        }
        return { success: false, message: 'Failed to fetch user' };
    }
}

// Update user
export async function updateUser(userId: string, data: UpdateUserData) {
    try {
        await requireAdmin();

        const updatedUser = await prisma.user.update({
            where: { user_id: userId },
            data: {
                name: data.name,
                email: data.email,
            },
            select: {
                user_id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        // Revalidate the users list and user detail pages
        revalidatePath('/admin/dashboard/manage-users');
        revalidatePath(`/admin/dashboard/manage-users/${userId}`);

        return { success: true, data: updatedUser };
    } catch (error) {
        console.error('Error updating user:', error);
        if (error instanceof Error && error.message.includes('Unauthorized')) {
            return { success: false, message: 'Unauthorized' };
        }
        return { success: false, message: 'Failed to update user' };
    }
}

// Delete user
export async function deleteUser(userId: string) {
    try {
        await requireAdmin();

        // Check if user exists before deleting
        const userExists = await prisma.user.findUnique({
            where: { user_id: userId },
            select: { user_id: true }
        });

        if (!userExists) {
            return { success: false, message: 'User not found' };
        }

        // Delete all related records in a transaction
        await prisma.$transaction(async (tx) => {
            // Delete all reports associated with the user
            await tx.report.deleteMany({
                where: { userId: userId }
            });

            // Delete all locations associated with the user
            await tx.location.deleteMany({
                where: { userId: userId }
            });

            // Finally delete the user
            await tx.user.delete({
                where: { user_id: userId },
            });
        });

        // Revalidate the users list page
        revalidatePath('/admin/dashboard/manage-users');

        return { success: true, message: 'User deleted successfully' };
    } catch (error: unknown) {
        console.error('Server error in deleteUser:', error);
        // Check for specific Prisma errors
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            return { success: false, message: 'User not found' };
        }
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
            return { success: false, message: 'Failed to delete user. Please ensure all related data is removed first.' };
        }
        if (error instanceof Error && error.message.includes('Unauthorized')) {
            return { success: false, message: 'Unauthorized - Please log in' };
        }
        return { success: false, message: 'Failed to delete user. Please try again.' };
    }
} 