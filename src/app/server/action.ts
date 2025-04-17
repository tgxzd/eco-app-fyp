'use server';

import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/session';
import { ApiResponse } from '@/lib/definitions';

/**
 * Check if the current session is valid
 */
export async function checkSession(): Promise<{ isAuthenticated: boolean }> {
  const user = await getCurrentUser();
  return { isAuthenticated: !!user };
}

/**
 * Get the current user from the session
 */
export async function getUser() {
  const user = await getCurrentUser();
  return user;
}


export async function getProtectedData(): Promise<ApiResponse> {
  const user = await getCurrentUser();
  
  if (!user) {
    return {
      success: false,
      error: 'Unauthorized',
    };
  }
  
  // Return some protected data
  return {
    success: true,
    data: {
      message: 'This is protected data',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    },
  };
}

/**
 * Generic server action for updating data with revalidation
 */
export async function updateData<T>(
  updateFn: () => Promise<T>,
  path: string
): Promise<ApiResponse<T>> {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return {
        success: false,
        error: 'Unauthorized',
      };
    }
    
    const result = await updateFn();
    
    // Revalidate the path to update the UI
    revalidatePath(path);
    
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred',
    };
  }
}