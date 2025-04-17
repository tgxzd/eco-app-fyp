import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Types
export type User = {
  id: string;
  name: string | null;
  email: string;
};

// Cookie and JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const COOKIE_NAME = 'session_token';

/**
 * Verifies a JWT token
 */
export async function verifyToken(token: string): Promise<User | null> {
  try {
    return verify(token, JWT_SECRET) as User;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

/**
 * Gets the current session information
 */
export async function getSession(): Promise<{ user: User | null; isAuthenticated: boolean }> {
  try {
    // Get the session cookie - ALWAYS AWAIT cookies()
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    
    if (!token) {
      return { user: null, isAuthenticated: false };
    }
    
    // Verify the token
    const user = await verifyToken(token);
    return {
      user,
      isAuthenticated: !!user,
    };
  } catch (error) {
    console.error('Session retrieval error:', error);
    return { user: null, isAuthenticated: false };
  }
}

/**
 * Gets the current authenticated user
 */
export async function getCurrentUser(): Promise<User | null> {
  const { user } = await getSession();
  return user;
}

/**
 * Requires authentication, redirects to login if not authenticated
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }
  return user;
}

/**
 * Checks if the user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const { isAuthenticated } = await getSession();
  return isAuthenticated;
} 