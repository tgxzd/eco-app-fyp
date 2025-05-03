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
    <div className="relative min-h-screen flex flex-col items-center justify-center py-2">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/wallpaper2.jpg"
          alt="Forest background"
          fill
          className="object-cover"
          quality={100}
          priority
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      
      <div className="z-10 text-center mb-10">
        <h1 className="text-yellow-400 text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tighter">
          Welcome Back
        </h1>
        
      </div>
      
      <div className="w-full max-w-md z-10 px-8">
        {error && (
          <div className="rounded-md bg-red-900/50 backdrop-blur-sm p-4 mb-6 text-yellow-400 font-serif text-center">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-5">
            <div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full bg-transparent backdrop-blur-sm border-0 border-b-2 border-yellow-400 px-3 py-3 text-yellow-400 placeholder-yellow-400/60 focus:border-yellow-500 focus:outline-none focus:ring-0 font-serif text-lg"
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
                className="mt-1 block w-full bg-transparent backdrop-blur-sm border-0 border-b-2 border-yellow-400 px-3 py-3 text-yellow-400 placeholder-yellow-400/60 focus:border-yellow-500 focus:outline-none focus:ring-0 font-serif text-lg"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-yellow-400 font-serif">
            <div className="flex items-center">
              <input
                id="remember_me"
                name="remember_me"
                type="checkbox"
                className="h-4 w-4 rounded border-yellow-400 text-[#1E7E6A] focus:ring-[#1E7E6A]"
              />
              <label htmlFor="remember_me" className="ml-2 block text-sm">
                Remember me
              </label>
            </div>

           
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-[#1E7E6A] text-white font-serif rounded border-2 border-[#1E7E6A] hover:bg-transparent hover:text-[#1E7E6A] transition-colors duration-300 shadow-md text-lg"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
          
          <div className="text-center mt-6 font-serif text-yellow-400">
            <p>Don't have an account? Register{' '}
              <Link href="/register" className="font-semibold text-green-500 ">
                Here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
