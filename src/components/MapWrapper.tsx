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
      <h2 className="text-amber-100 font-serif text-xl mb-4 tracking-wide text-center">Location Map</h2>
      <div className="relative">
        <GoogleMap apiKey={apiKey} reportLocations={reportLocations} />
        
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