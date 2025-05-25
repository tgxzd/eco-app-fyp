'use client';

import GoogleMap from './GoogleMap';

export interface ReportLocation {
  report_id: string;
  category: string;
  status: string;
  description: string;
  location_id: string;
  latitude: number;
  longitude: number;
  address: string;
}

interface MapWrapperProps {
  apiKey: string;
  reportLocations?: ReportLocation[];
}

export default function MapWrapper({ apiKey, reportLocations = [] }: MapWrapperProps) {
  return (
    <div className="bg-black/40 p-4 border border-amber-700/50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-amber-100 font-serif text-xl tracking-wide">Location Map</h2>
        {/* Modern Legend */}
        <div className="flex items-center gap-4 px-3 py-1.5 bg-black/40 rounded-full border border-amber-700/30">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-600 border border-white/30"></div>
            <span className="text-red-400 text-xs">Incident</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-600 border border-amber-300/30"></div>
            <span className="text-amber-400 text-xs">You</span>
          </div>
        </div>
      </div>
      <div className="relative">
        <GoogleMap apiKey={apiKey} reportLocations={reportLocations} />
      </div>
    </div>
  );
} 