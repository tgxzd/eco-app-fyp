'use client';

import dynamic from 'next/dynamic';

// Import GoogleMap component with client-side only rendering
const GoogleMap = dynamic(() => import('@/components/GoogleMap'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-gray-800/60 border border-amber-700/30 flex items-center justify-center">
      <div className="text-amber-100">Loading map...</div>
    </div>
  )
});

interface MapWrapperProps {
  apiKey: string;
}

export default function MapWrapper({ apiKey }: MapWrapperProps) {
  return (
    <div className="bg-black/40 p-4 border border-amber-700/50">
      <h2 className="text-amber-100 font-serif text-xl mb-4 tracking-wide text-center">Location Map</h2>
      <div className="relative">
        <GoogleMap apiKey={apiKey} />
        
        {/* Map Legend */}
        <div className="absolute bottom-4 right-4 bg-black/70 p-3 border border-amber-700/50 rounded text-sm">
          <h3 className="text-amber-100 font-serif text-base mb-2">Legend</h3>
          <ul className="space-y-2">
            <li className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-red-600 border border-white"></div>
              <span className="text-red-400">Reported Incident</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-amber-600 border border-amber-300"></div>
              <span className="text-amber-400">Your Location</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 