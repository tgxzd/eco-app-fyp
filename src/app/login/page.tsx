'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { handleLogin } from './action';

import Background from '@/components/Background';
import { motion } from 'framer-motion';

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
    <>
      <Background variant="web3-emerald" />
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center py-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <Link href="/" className="flex items-center justify-center space-x-2 mb-6">
            <div className="h-8 w-8 relative">
              <div className="absolute inset-0 bg-emerald-500 rounded-full opacity-70"></div>
              <div className="absolute inset-0 border border-emerald-400 rounded-full"></div>
              <div className="absolute inset-[2px] border-2 border-dashed border-emerald-300/30 rounded-full"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[3px] h-4 bg-white/80 rounded-full"></div>
              </div>
            </div>
            <span className="text-xl font-medium font-poppins leading-none">
              <span className="text-white">Enviro</span><span className="text-emerald-500">Connect</span>
            </span>
          </Link>
          <div className="mb-2 w-24 h-0.5 bg-emerald-500 mx-auto"></div>
          <h1 className="font-poppins text-3xl md:text-4xl font-light tracking-wide text-white">
            Welcome Back
          </h1>
          <div className="mt-2 w-24 h-0.5 bg-emerald-500 mx-auto"></div>
        </motion.div>
        
        <div className="w-full max-w-md px-6 md:px-8">
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="border-l-2 border-emerald-500 bg-black/40 backdrop-blur-md p-4 mb-6 text-white font-poppins text-center rounded-r-md"
            >
              <p>{error}</p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-xl p-6 md:p-8 shadow-lg relative overflow-hidden"
          >
            {/* Glass reflections */}
            <motion.div 
              animate={{ 
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"
            ></motion.div>
            <motion.div 
              animate={{ 
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"
            ></motion.div>
            
            {/* Subtle border glow */}
            <div className="absolute inset-0 rounded-xl border border-emerald-500/20 pointer-events-none"></div>
            
            <form onSubmit={onSubmit} className="space-y-6 relative z-10">
              <div className="space-y-5">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md px-3 py-3 text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-poppins transition-all duration-200"
                    placeholder="Email address"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md px-3 py-3 text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-poppins transition-all duration-200"
                    placeholder="Password"
                  />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="flex items-center justify-between text-gray-300 font-poppins"
              >
                <div className="flex items-center">
                  <input
                    id="remember_me"
                    name="remember_me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-white/20 bg-white/5 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0"
                  />
                  <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-200">
                    Remember me
                  </label>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-8 py-3 bg-emerald-500/80 backdrop-blur-sm text-white font-poppins rounded-md hover:bg-emerald-500 transition-all duration-300 font-medium relative overflow-hidden group"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-emerald-500/0 via-emerald-500/30 to-emerald-500/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                  <span className="relative">{isLoading ? 'Signing in...' : 'Sign in'}</span>
                </button>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="text-center mt-6 font-poppins text-gray-300"
              >
                <p>Don&apos;t have an account?{' '}
                  <Link href="/register" className="text-emerald-400 hover:text-emerald-300 transition-colors duration-200">
                    Register Here
                  </Link>
                </p>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
}
