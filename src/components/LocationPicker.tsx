"use client";

import { LocationPicker as LocationPickerComponent } from './GoogleMap';
import { GoogleMapsProvider } from './GoogleMap';

interface LocationPickerProps {
  onLocationSelect: (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
  initialLocation?: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

export default function LocationPicker(props: LocationPickerProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  
  return (
    <GoogleMapsProvider apiKey={apiKey}>
      <LocationPickerComponent {...props} />
    </GoogleMapsProvider>
  );
} 