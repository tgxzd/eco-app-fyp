"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function YourReport() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen w-full">
      {/* Background Image */}
      <Image
        src="/images/wallpaper4.jpg"
        alt="Background"
        fill
        className="object-cover z-0"
        priority
      />

      {/* Content container - can add content here later */}
      <div className="relative z-10 min-h-screen p-8">
        {/* This div will contain your actual content */}
      </div>
    </div>
  );
}
