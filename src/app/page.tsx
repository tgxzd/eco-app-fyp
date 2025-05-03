"use client";

import Image from 'next/image';


export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Wallpaper Background */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/wallpaper.jpg"
          alt="Wallpaper background"
          fill
          className="object-cover"
          quality={100}
          priority
        />
      </div>
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-center text-4xl font-bold tracking-tighter md:text-5xl lg:text-7xl text-yellow-400 font-serif">
          EnviroConnect
        </h1>
        <p className="mt-6 text-lg text-yellow-400 font-serif italic max-w-2xl text-center">
          "The Future of Environmental Awareness is in Your Pocket "
        </p>
        <div className="mt-10 flex gap-4">
          <button className="px-6 py-3 bg-[#1E7E6A] text-white font-serif rounded border-2 border-[#1E7E6A] hover:bg-transparent hover:text-[#1E7E6A] transition-colors duration-300 shadow-md">
            Get Started
          </button>
          <button className="px-6 py-3 bg-[#1E7E6A] text-white font-serif rounded border-2 border-[#1E7E6A] hover:bg-transparent hover:text-[#1E7E6A] transition-colors duration-300 shadow-md">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}
