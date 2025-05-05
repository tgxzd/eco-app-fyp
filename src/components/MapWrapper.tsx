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
      <GoogleMap apiKey={apiKey} />
    </div>
  );
} 