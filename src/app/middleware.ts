import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@/lib/session';

// Public routes that don't require authentication
const publicRoutes = ['/login', '/register'];

/**
 * Middleware function to protect routes and handle API requests
 */
export async function middleware(req: NextRequest) {
  // Skip middleware for API routes
  if (req.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // 1. check if route is protected
  const protectedRoutes = ['/dashboard'];
  const currentPath = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(currentPath);
  const isPublicRoute = publicRoutes.includes(currentPath);

  // 2. Check for valid session
  const session = await getSession();

  // 3. Handle protected routes
  if (isProtectedRoute && !session.isAuthenticated) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // 4. Prevent accessing login/signup when already logged in
  if (session.isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

/**
 * Configure the middleware to run on specific paths
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ],
};
