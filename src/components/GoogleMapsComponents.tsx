"use client";

import React, { useState, useEffect, useRef, createContext, useContext, ReactNode } from 'react';
import Script from 'next/script';

// Google Maps Context
interface GoogleMapsContextType {
  isLoaded: boolean;
  google: typeof window.google | null;
}

const GoogleMapsContext = createContext<GoogleMapsContextType>({
  isLoaded: false,
  google: null
});

interface GoogleMapsProviderProps {
  apiKey: string;
  children: ReactNode;
}

export function GoogleMapsProvider({ apiKey, children }: GoogleMapsProviderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  const handleScriptLoad = () => {
    setIsLoaded(true);
  };
  
  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`}
        strategy="afterInteractive"
        onReady={() => {
          window.initMap = () => handleScriptLoad();
        }}
      />
      <GoogleMapsContext.Provider value={{ isLoaded, google: window.google || null }}>
        {children}
      </GoogleMapsContext.Provider>
    </>
  );
}

// Location Picker Component
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

export function LocationPicker({ onLocationSelect, initialLocation }: LocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const { isLoaded, google } = useContext(GoogleMapsContext);
  const [address, setAddress] = useState<string>(initialLocation?.address || "");
  
  // Initialize map after component mounts and Google Maps is loaded
  useEffect(() => {
    if (!isLoaded || !google || !mapRef.current) return;
    
    // Default coordinates (can be customized)
    const defaultLocation = initialLocation 
      ? { lat: initialLocation.latitude, lng: initialLocation.longitude }
      : { lat: 3.1390, lng: 101.6869 }; // Kuala Lumpur
    
    // Create the map
    const map = new google.maps.Map(mapRef.current, {
      center: defaultLocation,
      zoom: 13,
      mapTypeId: "roadmap",
      styles: [
        // Dark mode styling
        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
        {
          featureType: "administrative.locality",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        // ... additional styling if needed
      ]
    });
    
    mapInstanceRef.current = map;
    
    // Add a marker for the initial or default location
    const marker = new google.maps.Marker({
      position: defaultLocation,
      map: map,
      draggable: true,
      title: "Select Location",
    });
    
    markerRef.current = marker;
    
    // Create geocoder for reverse geocoding
    const geocoder = new google.maps.Geocoder();
    
    // Update location when marker is dragged
    google.maps.event.addListener(marker, 'dragend', () => {
      const position = marker.getPosition();
      if (position) {
        const lat = position.lat();
        const lng = position.lng();
        
        // Use geocoder to get address from coordinates
        geocoder.geocode(
          { location: { lat, lng } }, 
          (
            results: google.maps.GeocoderResult[] | null, 
            status: google.maps.GeocoderStatus
          ) => {
            if (status === 'OK' && results && results[0]) {
              const newAddress = results[0].formatted_address;
              setAddress(newAddress);
              
              // Pass location data to parent component
              onLocationSelect({
                latitude: lat,
                longitude: lng,
                address: newAddress
              });
            } else {
              setAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
              
              // Pass location data to parent component without address
              onLocationSelect({
                latitude: lat,
                longitude: lng,
                address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
              });
            }
          }
        );
      }
    });
    
    // Also update on map click
    google.maps.event.addListener(map, 'click', (event: google.maps.MapMouseEvent) => {
      const lat = event.latLng!.lat();
      const lng = event.latLng!.lng();
      
      // Update marker position
      marker.setPosition(event.latLng);
      
      // Use geocoder to get address from coordinates
      geocoder.geocode(
        { location: { lat, lng } }, 
        (
          results: google.maps.GeocoderResult[] | null, 
          status: google.maps.GeocoderStatus
        ) => {
          if (status === 'OK' && results && results[0]) {
            const newAddress = results[0].formatted_address;
            setAddress(newAddress);
            
            // Pass location data to parent component
            onLocationSelect({
              latitude: lat,
              longitude: lng,
              address: newAddress
            });
          } else {
            setAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
            
            // Pass location data to parent component without address
            onLocationSelect({
              latitude: lat,
              longitude: lng,
              address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
            });
          }
        }
      );
    });
    
  }, [isLoaded, google, onLocationSelect, initialLocation]);
  
  return (
    <div className="space-y-4">
      <div 
        ref={mapRef} 
        className="w-full h-[300px] bg-gray-800/60 border border-amber-700/30"
      />
      <div className="text-amber-100 font-serif">
        <p className="mb-1"><span className="text-amber-400">Selected Location:</span> {address || "No location selected"}</p>
      </div>
    </div>
  );
} 