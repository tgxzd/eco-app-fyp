'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginOrganization } from '../action';
import Link from 'next/link';
import Image from 'next/image';
import artwork from '../../../../public/images/gambar.jpg';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    const result = await loginOrganization(formData);
    
    if (result.error) {
      setError(result.error);
    } else {
      router.push('/environmental-organization/dashboard');
    }
  }

  return (
    <div className="relative min-h-screen bg-[#121212] flex items-center justify-center">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src={artwork}
          alt="Background artwork"
          fill
          className="object-cover opacity-60"
          quality={100}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-6 py-12 bg-black/50 backdrop-blur-sm rounded-lg shadow-xl border border-amber-700/30">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-amber-100 mb-2">Organization Login</h1>
          <div className="w-16 h-1 mx-auto bg-amber-700"></div>
        </div>

        <form action={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-amber-100 mb-2">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-2 bg-black/30 border border-amber-700/50 rounded-md text-amber-100 placeholder-amber-100/50 focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-amber-100 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-2 bg-black/30 border border-amber-700/50 rounded-md text-amber-100 placeholder-amber-100/50 focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded text-red-500 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 bg-amber-700 hover:bg-amber-600 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors"
          >
            Sign In
          </button>

          <p className="text-center text-sm text-amber-100/70">
            Don&apos;t have an account?{' '}
            <Link
              href="/environmental-organization/register"
              className="text-amber-500 hover:text-amber-400 font-medium"
            >
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
