/// <reference types="@types/google.maps" />
'use client';

import { createContext, useContext, ReactNode, useState, useEffect, useRef, useCallback } from 'react';
import Script from 'next/script';
import { GoogleMap as GoogleMapComponent, Marker } from '@react-google-maps/api';

// Type definitions
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

interface GoogleMapsContextType {
  isLoaded: boolean;
  hasError: boolean;
}

// Create context to track if Maps API is loaded
const GoogleMapsContext = createContext<GoogleMapsContextType>({
  isLoaded: false,
  hasError: false
});

// Hook to use the Google Maps context
export const useGoogleMaps = () => useContext(GoogleMapsContext);

// Common map styles and settings
export const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

export const defaultCenter = {
  lat: 3.139, // Default to Malaysia
  lng: 101.6869
};

// Map styling (dark mode)
export const mapStyles = [
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
];

// Define marker colors based on report category
export const getCategoryColor = (category: string): { fill: string; stroke: string } => {
  switch (category) {
    case 'air-pollution':
      return { fill: '#EF4444', stroke: '#B91C1C' }; // Red
    case 'water-pollution':
      return { fill: '#3B82F6', stroke: '#1D4ED8' }; // Blue
    case 'global-warming':
      return { fill: '#F59E0B', stroke: '#B45309' }; // Amber
    case 'wildfire':
      return { fill: '#D97706', stroke: '#92400E' }; // Orange
    default:
      return { fill: '#10B981', stroke: '#047857' }; // Green
  }
};

// ========== Provider Component ==========
interface GoogleMapsProviderProps {
  apiKey: string;
  children: ReactNode;
}

export function GoogleMapsProvider({ apiKey, children }: GoogleMapsProviderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Check if Google Maps is already loaded
  useEffect(() => {
    if (window.google && window.google.maps) {
      setIsLoaded(true);
    }
  }, []);

  // Handle the script load
  const handleScriptLoad = () => {
    setIsLoaded(true);
  };

  // Handle the script error
  const handleScriptError = () => {
    setHasError(true);
  };

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, hasError }}>
      {!isLoaded && !window.google?.maps && (
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`}
          onLoad={handleScriptLoad}
          onError={handleScriptError}
          strategy="afterInteractive"
        />
      )}
      {children}
    </GoogleMapsContext.Provider>
  );
}

// ========== Map Component for Reports ==========
interface ReportMapProps {
  reportLocations?: ReportLocation[];
  height?: string | number;
}

export function ReportMap({ reportLocations = [], height = '400px' }: ReportMapProps) {
  const { isLoaded, hasError } = useGoogleMaps();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const mapInitialized = useRef(false);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const pulseEffectsRef = useRef<number[]>([]);
  
  // Custom container style
  const containerStyle = {
    ...mapContainerStyle,
    height
  };
  
  // Clean up pulse effects on unmount
  useEffect(() => {
    return () => {
      pulseEffectsRef.current.forEach(id => {
        if (id) window.cancelAnimationFrame(id);
      });
    };
  }, []);
  
  // Initialize map after component mounts and Google Maps is loaded
  useEffect(() => {
    // Skip if already initialized or Maps not loaded
    if (mapInitialized.current || !isLoaded || hasError) return;
    
    // Function to initialize the map
    const initMap = () => {
      if (!window.google || !window.google.maps || !mapRef.current) return;
      
      // Mark as initialized to prevent duplicate initialization
      mapInitialized.current = true;
      
      // Create the map
      const map = new google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 13,
        mapTypeId: "roadmap",
        styles: mapStyles
      });
      
      // Store map instance for later use
      mapInstanceRef.current = map;
      
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
    
    initMap();
  }, [isLoaded, hasError]);

  // Add report markers when map is initialized and reportLocations change
  useEffect(() => {
    const addReportMarkers = () => {
      if (!mapInstanceRef.current || !window.google || reportLocations.length === 0) return;
      
      // Clear any existing markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
      
      // Stop any existing pulse animations
      pulseEffectsRef.current.forEach(id => {
        if (id) window.cancelAnimationFrame(id);
      });
      pulseEffectsRef.current = [];
      
      // Create a bounds object to fit all markers
      const bounds = new google.maps.LatLngBounds();
      
      // Add markers for each report location
      reportLocations.forEach((report, index) => {
        const position = {
          lat: parseFloat(report.latitude.toString()),
          lng: parseFloat(report.longitude.toString())
        };
        
        const colors = getCategoryColor(report.category);
        
        // Create marker
        const marker = new google.maps.Marker({
          position,
          map: mapInstanceRef.current,
          title: `${report.category}: ${report.description.substring(0, 30)}${report.description.length > 30 ? '...' : ''}`,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: colors.fill,
            fillOpacity: 0.7,
            strokeWeight: 2,
            strokeColor: colors.stroke,
          },
        });
        
        // Add info window with report details
        const infoWindow = new google.maps.InfoWindow({
          content: \`
            <div style="padding: 10px; max-width: 200px;">
              <div style="font-weight: bold; margin-bottom: 5px;">${report.category.replace('-', ' ').toUpperCase()}</div>
              <div style="margin-bottom: 5px;">${report.description.substring(0, 100)}${report.description.length > 100 ? '...' : ''}</div>
              <div style="font-size: 0.8em; opacity: 0.8;">${report.address}</div>
            </div>
          \`
        });
        
        // Add click listener to open info window
        marker.addListener('click', () => {
          infoWindow.open(mapInstanceRef.current, marker);
        });
        
        // Store marker reference
        markersRef.current.push(marker);
        
        // Extend bounds to include this position
        bounds.extend(position);
        
        // Create pulse effect
        const startTime = Date.now();
        const createPulseEffect = () => {
          if (!mapInstanceRef.current) return;
          
          const elapsed = Date.now() - startTime;
          const scale = 10 + Math.sin(elapsed / 500) * 3; // Pulsing effect
          
          marker.setIcon({
            path: google.maps.SymbolPath.CIRCLE,
            scale,
            fillColor: colors.fill,
            fillOpacity: 0.7,
            strokeWeight: 2,
            strokeColor: colors.stroke,
          });
          
          // Continue animation
          pulseEffectsRef.current[index] = requestAnimationFrame(createPulseEffect);
        };
        
        // Start pulse animation
        pulseEffectsRef.current[index] = requestAnimationFrame(createPulseEffect);
      });
      
      // Fit map to show all markers if there are any
      if (reportLocations.length > 0 && mapInstanceRef.current) {
        mapInstanceRef.current.fitBounds(bounds);
        
        // Don't zoom in too far
        const zoom = mapInstanceRef.current.getZoom();
        if (zoom !== undefined && zoom > 15) {
          mapInstanceRef.current.setZoom(15);
        }
      }
    };
    
    // Wait for map to be initialized before adding markers
    const checkAndAddMarkers = () => {
      if (mapInitialized.current && mapInstanceRef.current) {
        addReportMarkers();
      } else if (isLoaded) {
        setTimeout(checkAndAddMarkers, 100);
      }
    };
    
    checkAndAddMarkers();
  }, [reportLocations, isLoaded]);

  if (hasError) return <div className="text-red-500 p-4 text-center">Error loading maps</div>;
  if (!isLoaded) return <div className="text-amber-100 p-4 text-center">Loading maps...</div>;

  return (
    <div 
      ref={mapRef} 
      className="w-full bg-gray-800/60 border border-amber-700/30"
      style={{ height }}
    />
  );
}

// ========== Location Picker Component ==========
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
  const { isLoaded, hasError } = useGoogleMaps();
  const [currentPosition, setCurrentPosition] = useState(initialLocation ? {
    lat: initialLocation.latitude,
    lng: initialLocation.longitude
  } : defaultCenter);
  
  const [address, setAddress] = useState(initialLocation?.address || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const getAddressFromCoordinates = useCallback(async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        \`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}\`
      );
      const data = await response.json();
      
      if (data.status === 'OK' && data.results && data.results.length > 0) {
        const formattedAddress = data.results[0].formatted_address;
        setAddress(formattedAddress);
        
        // Send data back to parent component
        onLocationSelect({
          latitude: lat,
          longitude: lng,
          address: formattedAddress
        });
      }
    } catch (error) {
      console.error('Error getting address:', error);
      setError('Error getting address from coordinates');
    }
  }, [onLocationSelect]);

  // Get current location from browser
  const getCurrentLocation = useCallback(() => {
    setIsLoading(true);
    setError('');
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentPosition(pos);
          getAddressFromCoordinates(pos.lat, pos.lng);
          setIsLoading(false);
        },
        (error) => {
          setError(\`Error getting location: ${error.message}\`);
          setIsLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setIsLoading(false);
    }
  }, [getAddressFromCoordinates]);

  // Get current location on component mount
  useEffect(() => {
    if (!initialLocation) {
      getCurrentLocation();
    }
  }, [initialLocation, getCurrentLocation]);

  // Handle map click to update marker position
  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newPosition = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      };
      setCurrentPosition(newPosition);
      getAddressFromCoordinates(newPosition.lat, newPosition.lng);
    }
  }, [getAddressFromCoordinates]);

  if (hasError) return <div className="text-red-500 p-4">Error loading maps</div>;
  if (!isLoaded) return <div className="p-4">Loading maps...</div>;

  return (
    <div className="mb-6">
      <div className="mb-2">
        <button
          type="button"
          onClick={getCurrentLocation}
          className="px-4 py-2 bg-amber-700 text-amber-100 font-serif mb-2"
          disabled={isLoading}
        >
          {isLoading ? 'Detecting Location...' : 'Detect My Location'}
        </button>
      </div>
      
      {error && <p className="text-red-500 mb-2">{error}</p>}
      
      <div className="border-2 border-amber-700/50 mb-2">
        <GoogleMapComponent
          mapContainerStyle={{ ...mapContainerStyle, height: '300px' }}
          center={currentPosition}
          zoom={15}
          onClick={handleMapClick}
          options={{ styles: mapStyles }}
        >
          <Marker position={currentPosition} />
        </GoogleMapComponent>
      </div>
      
      <div className="mt-2">
        <label className="block text-sm font-medium text-amber-100 font-serif mb-1">
          Current Address
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full p-2 bg-black/20 border-amber-700/60 border text-amber-100"
          placeholder="Address will appear here..."
          readOnly
        />
      </div>
    </div>
  );
}

// Default export for the main component
export default function GoogleMap({ reportLocations = [] }: ReportMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  
  return (
    <GoogleMapsProvider apiKey={apiKey}>
      <ReportMap reportLocations={reportLocations} />
    </GoogleMapsProvider>
  );
} 