import { requireAuth } from '@/lib/session';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import NavHeader from '@/components/ui/nav-header';

export default async function DashboardPage() {
  // Ensure user is authenticated
  const user = await requireAuth();

  return (
    <div className="relative min-h-screen bg-[#121212]">
      {/* Wallpaper Background with overlay */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/wallpaper3.jpg"
          alt="Wallpaper background"
          fill
          className="object-cover opacity-60"
          quality={100}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center">
        <header className="w-full py-4 md:py-8 bg-black/50 border-b border-amber-700/30">
          <NavHeader />
        </header>
        
        <div className="flex flex-col items-center justify-center flex-grow px-4 py-8 md:py-0 w-full">
          <div className="flex flex-col items-center px-6 py-8 md:px-8 md:py-10 bg-black/40 border-t-2 border-b-2 border-amber-700/50 max-w-lg w-full mx-4">
            <h1 className="font-serif text-xl md:text-2xl font-bold mb-2 md:mb-3 text-amber-100 tracking-wide uppercase text-center">
              Welcome
            </h1>
            <div className="w-12 md:w-16 h-0.5 bg-amber-700 mb-4 md:mb-6"></div>
            <p className="font-serif text-lg md:text-xl text-amber-100 tracking-wider text-center break-words">
              {user.name || user.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 