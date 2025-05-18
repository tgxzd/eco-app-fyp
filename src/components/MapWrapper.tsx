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
      <GoogleMap reportLocations={reportLocations} />
    </div>
  );
} 