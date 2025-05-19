"use client";

import Image from 'next/image';
import Link from 'next/link';


export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#121212]">
      {/* Wallpaper Background */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/wallpaper.jpg"
          alt="Wallpaper background"
          fill
          className="object-cover opacity-60"
          quality={100}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center mb-8">
          <div className="mb-4 w-32 h-1 bg-amber-700 mx-auto"></div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-wide uppercase text-amber-100">
            EnviroConnect
          </h1>
          <div className="mt-4 w-32 h-1 bg-amber-700 mx-auto"></div>
        </div>
        
        <p className="mt-6 text-lg text-amber-100 font-serif italic max-w-2xl text-center border-l-2 border-r-2 border-amber-700/30 px-6 py-2">
          &quot;The Future of Environmental Awareness is in Your Pocket&quot;
        </p>
        
        <div className="mt-12 flex flex-col sm:flex-row gap-6">
          <Link 
            href="/login" 
            className="px-8 py-2 bg-transparent text-amber-100 font-serif border-2 border-amber-700 hover:bg-amber-700/20 transition-colors duration-300 uppercase tracking-widest text-sm shadow-lg"
          >
            Sign In
          </Link>
          <Link 
            href="/register" 
            className="px-8 py-2 bg-transparent text-amber-100 font-serif border-2 border-amber-700 hover:bg-amber-700/20 transition-colors duration-300 uppercase tracking-widest text-sm shadow-lg"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
