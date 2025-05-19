import { requireAuth } from '@/lib/session';
// import { redirect } from 'next/navigation';
import Image from 'next/image';
import NavHeader from '@/components/ui/nav-header';
import Link from 'next/link';
import GoogleMap, { ReportLocation } from '@/components/GoogleMap';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export default async function DashboardPage() {
  // Ensure user is authenticated
  await requireAuth();
  
  // Get Google Maps API key from env
  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
<<<<<<< HEAD
=======

  // Create a type-safe raw query
  const reportLocationsQuery = Prisma.sql`
    SELECT 
      r.id as report_id, 
      r.category, 
      r.status, 
      r.description,
      l.id as location_id, 
      l.latitude, 
      l.longitude, 
      l.address
    FROM "Report" r
    INNER JOIN "Location" l ON r."locationId" = l.id
    ORDER BY r."createdAt" DESC
  `;
  
  // Execute the query
  const reportLocations = await prisma.$queryRaw<ReportLocation[]>(reportLocationsQuery);
>>>>>>> 528656db88427d52c631000ff602942ad1a25b4f

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
          <NavHeader/>
        </header>
        
        <div className="flex flex-col items-center justify-center flex-grow px-4 py-8 md:py-8 w-full">
          {/* Google Maps Container */}
          <div className="mb-8 w-full max-w-4xl">
            <div className="bg-black/40 p-4 border border-amber-700/50">
              <h2 className="text-amber-100 font-serif text-xl mb-4 tracking-wide text-center">Location Map</h2>
              <GoogleMap reportLocations={reportLocations} />
            </div>
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
  );
} 