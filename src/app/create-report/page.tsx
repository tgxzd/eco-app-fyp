"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CreateReport() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen w-full">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/wallpaper4.jpg"
          alt="Background"
          fill
          className="object-cover opacity-60"
          quality={100}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30"></div>
      </div>

      {/* Content container - can add content here later */}
      <div className="relative z-10 min-h-screen p-8">
        {/* This div will contain your actual content */}
      </div>
    </div>
  );
}
