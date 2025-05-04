'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { handleLogin } from './action';
import Image from 'next/image';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      
      // Call the server action directly
      const result = await handleLogin(formData);
      
      if (result.error) {
        setError(result.error);
      } else if (result.success) {
        // Redirect to dashboard
        router.push('/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-[#121212]">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/wallpaper2.jpg"
          alt="Background"
          fill
          className="object-cover opacity-60"
          quality={100}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30"></div>
      </div>
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center py-10">
        <div className="text-center mb-8">
          <div className="mb-2 w-24 h-1 bg-amber-700 mx-auto"></div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-wider uppercase text-amber-100">
            Welcome Back
          </h1>
          <div className="mt-2 w-24 h-1 bg-amber-700 mx-auto"></div>
        </div>
        
        <div className="w-full max-w-md px-6 md:px-8">
          {error && (
            <div className="border-l-2 border-amber-700 bg-black/40 p-4 mb-6 text-amber-100 font-serif text-center">
              <p>{error}</p>
            </div>
          )}

          <div className="bg-black/40 border-t-2 border-b-2 border-amber-700/50 p-6 md:p-8">
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-5">
                <div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="mt-1 block w-full bg-transparent border-0 border-b-2 border-amber-700/70 px-3 py-3 text-amber-100 placeholder-amber-100/50 focus:border-amber-700 focus:outline-none focus:ring-0 font-serif text-lg"
                    placeholder="Email address"
                  />
                </div>

                <div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="mt-1 block w-full bg-transparent border-0 border-b-2 border-amber-700/70 px-3 py-3 text-amber-100 placeholder-amber-100/50 focus:border-amber-700 focus:outline-none focus:ring-0 font-serif text-lg"
                    placeholder="Password"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-amber-100 font-serif">
                <div className="flex items-center">
                  <input
                    id="remember_me"
                    name="remember_me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-amber-700 text-amber-700 focus:ring-amber-700"
                  />
                  <label htmlFor="remember_me" className="ml-2 block text-sm tracking-wide">
                    Remember me
                  </label>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-8 py-2 bg-transparent text-amber-100 font-serif border-2 border-amber-700 hover:bg-amber-700/20 transition-colors duration-300 uppercase tracking-widest text-sm"
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
              
              <div className="text-center mt-6 font-serif text-amber-100 tracking-wide">
                <p>Don't have an account?{' '}
                  <Link href="/register" className="text-amber-700 border-b border-amber-700/50 hover:border-amber-700">
                    Register Here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
