import { requireAuth } from '@/lib/session';
// import { redirect } from 'next/navigation';
import Image from 'next/image';
import NavHeader from '@/components/ui/nav-header';
import Link from 'next/link';
import MapWrapper from '@/components/MapWrapper';
import LocationPermissionHandler from '@/components/LocationPermissionHandler';
import { LocationProvider } from '@/contexts/LocationContext';

export default async function DashboardPage() {
  // Ensure user is authenticated
  await requireAuth();
  
  // Get Google Maps API key from env
  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  return (
    <LocationProvider>
      <div className="relative min-h-screen bg-[#121212]">
        <LocationPermissionHandler />
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
            <NavHeader/>
          </header>
          
          <div className="flex flex-col items-center justify-center flex-grow px-4 py-8 md:py-8 w-full">
            {/* Google Maps Container */}
            <div className="mb-8 w-full max-w-4xl">
              <MapWrapper apiKey={mapsApiKey} />
            </div>
            
            <Link href="/create-report" className="group">
              <button className="px-8 py-4 bg-amber-700/30 text-amber-100 font-serif uppercase tracking-widest text-lg border-2 border-amber-700 hover:bg-amber-700/50 transition-all duration-300 shadow-lg hover:shadow-amber-700/20 flex items-center justify-center space-x-2">
                <span>Create New Report</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </LocationProvider>
  );
} 