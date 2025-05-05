'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';

interface GoogleMapProps {
  apiKey: string;
}

export default function GoogleMap({ apiKey }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInitialized = useRef(false);
  
  // Initialize map after component mounts
  useEffect(() => {
    // Prevent initializing the map twice
    if (mapInitialized.current) return;
    
    // Function to initialize the map
    const initMap = () => {
      if (!window.google || !window.google.maps || !mapRef.current) return;
      
      // Mark as initialized to prevent duplicate initialization
      mapInitialized.current = true;
      
      // Default coordinates (can be customized)
      const defaultLocation = { lat: 3.1390, lng: 101.6869 }; // Kuala Lumpur
      
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
          {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
          },
          {
            featureType: "poi.park",
            elementType: "geometry",
            stylers: [{ color: "#263c3f" }],
          },
          {
            featureType: "poi.park",
            elementType: "labels.text.fill",
            stylers: [{ color: "#6b9a76" }],
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#38414e" }],
          },
          {
            featureType: "road",
            elementType: "geometry.stroke",
            stylers: [{ color: "#212a37" }],
          },
          {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: [{ color: "#9ca5b3" }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [{ color: "#746855" }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [{ color: "#1f2835" }],
          },
          {
            featureType: "road.highway",
            elementType: "labels.text.fill",
            stylers: [{ color: "#f3d19c" }],
          },
          {
            featureType: "transit",
            elementType: "geometry",
            stylers: [{ color: "#2f3948" }],
          },
          {
            featureType: "transit.station",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#17263c" }],
          },
          {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [{ color: "#515c6d" }],
          },
          {
            featureType: "water",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#17263c" }],
          },
        ]
      });
      
      // Try to get user's location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            
            // Center map on user's location
            map.setCenter(userLocation);
            
            // Add marker for user's location
            new google.maps.Marker({
              position: userLocation,
              map: map,
              title: "Your Location",
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: "#B45309",
                fillOpacity: 0.7,
                strokeWeight: 2,
                strokeColor: "#FBBF24",
              },
            });
          },
          () => {
            // Handle geolocation error
            console.log("Unable to retrieve your location");
          }
        );
      }
    };
    
    // Check if Google Maps API is already loaded
    if (window.google && window.google.maps) {
      initMap();
    } else {
      // Set up a global callback function for when the script loads
      window.initMap = initMap;
    }
  }, []);

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`}
        strategy="afterInteractive"
      />
      <div 
        ref={mapRef} 
        className="w-full h-[400px] bg-gray-800/60 border border-amber-700/30"
      />
    </>
  );
} 