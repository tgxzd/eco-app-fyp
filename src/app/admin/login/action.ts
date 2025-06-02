'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

interface LoginState {
    error: string | null;
}

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (!username || !password) {
        return {
            error: 'Username and password are required'
        };
    }

    // Check if credentials match admin credentials
    if (username === 'admin' && password === 'admin') {
        // Create session
        const cookieStore = await cookies();
        cookieStore.set('admin-session', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 // 24 hours
        });

        console.log(JSON.stringify({
            event: 'admin_login',
            status: 'success',
            data: {
                username,
                timestamp: new Date().toISOString()
            }
        }, null, 2));

        redirect('/admin/dashboard');
    }

    return {
        error: 'Invalid credentials'
    };
}
