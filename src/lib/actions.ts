'use server';

import { logout } from './auth';

/**
 * Server action to handle user logout
 */
export async function handleLogout() {
  await logout();
  return { success: true };
} 