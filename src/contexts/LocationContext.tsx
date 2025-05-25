'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LocationContextType {
  location: {
    latitude: number;
    longitude: number;
    address: string;
  } | null;
  isLoading: boolean;
  error: string | null;
  refreshLocation: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<LocationContextType['location']>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshLocation = async () => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setIsLoading(false);
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;

      // Attempt to get address using reverse geocoding
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
        );
        
        if (response.ok) {
          const data = await response.json();
          const address = data.results[0]?.formatted_address || "Unknown location";
          
          setLocation({
            latitude,
            longitude,
            address
          });
        } else {
          setLocation({
            latitude,
            longitude,
            address: "Unknown location"
          });
        }
      } catch {
        setLocation({
          latitude,
          longitude,
          address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
        });
      }
    } catch (error) {
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('Location access denied. Please enable location services to continue.');
            break;
          case error.POSITION_UNAVAILABLE:
            setError('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            setError('Location request timed out.');
            break;
          default:
            setError('An error occurred while getting your location.');
        }
      } else {
        setError('An error occurred while getting your location.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Request location permission when the provider mounts
  useEffect(() => {
    refreshLocation();
  }, []);

  return (
    <LocationContext.Provider value={{ location, isLoading, error, refreshLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
} 