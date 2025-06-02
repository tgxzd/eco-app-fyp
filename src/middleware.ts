import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Check if the request is for an admin route
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Skip middleware for login page
        if (request.nextUrl.pathname === '/admin/login') {
            return NextResponse.next();
        }

        const adminSession = request.cookies.get('admin-session');

        // Redirect to login if no session exists
        if (!adminSession) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
}; 