import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Handle admin routes
    if (path.startsWith('/admin')) {
        // Skip middleware for login page
        if (path === '/admin/login') {
            return NextResponse.next();
        }

        const adminSession = request.cookies.get('admin-session');

        // Redirect to login if no session exists
        if (!adminSession) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    // Handle environmental organization routes
    if (path.startsWith('/environmental-organization')) {
        const isPublicPath = path === '/environmental-organization/login' || 
                           path === '/environmental-organization/register';

        const token = request.cookies.get('session-token')?.value;

        if (isPublicPath && token) {
            // If user is already logged in and tries to access login/register page,
            // redirect to dashboard
            return NextResponse.redirect(new URL('/environmental-organization/dashboard', request.url));
        }

        if (!isPublicPath && !token) {
            // If user is not logged in and tries to access protected route,
            // redirect to login
            return NextResponse.redirect(new URL('/environmental-organization/login', request.url));
        }
    }

    // For all other cases, continue with the request
    return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
    matcher: [
        '/admin/:path*',
        '/environmental-organization/login',
        '/environmental-organization/register',
        '/environmental-organization/dashboard/:path*'
    ]
}; 