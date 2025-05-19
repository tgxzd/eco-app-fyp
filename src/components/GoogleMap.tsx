'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { ReportLocation } from './MapWrapper';

// Interface for the raw data from /api/reports
interface ApiReportData {
  id: string; // Assuming 'id' is the primary key for Report model
  category: string;
  status: string;
  description: string;
  locationId: string | null;
  location: {
    id: string; // Assuming 'id' is the primary key for Location model
    latitude: number;
    longitude: number;
    address: string | null;
  } | null;
  // Add other fields from your Report model if necessary
}

interface GoogleMapProps {
  apiKey: string;
  reportLocations?: ReportLocation[];
}

export default function GoogleMap({ apiKey, reportLocations = [] }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInitialized = useRef(false);
  // This state will hold the flattened ReportLocation data ready for markers
  const [processedReportLocations, setProcessedReportLocations] = useState<ReportLocation[]>([]);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  
  // Use the API key directly from environment variables if provided
  const googleMapsApiKey = apiKey || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  
  // Fetch report locations if none provided as props
  useEffect(() => {
    if (reportLocations.length > 0) {
      // If props are provided, assume they are already in the correct flattened format
      const validReportsFromProps = reportLocations.filter((report: ReportLocation) =>
        report &&
        typeof report === 'object' &&
        Object.keys(report).length > 0 &&
        typeof report.latitude === 'number' && // Check type directly
        typeof report.longitude === 'number'
      );
      setProcessedReportLocations(validReportsFromProps);
      return;
    }

    async function fetchAndProcessReportLocations() {
      try {
        const response = await fetch('/api/reports');
        const apiResponse = await response.json();

        if (apiResponse.success && Array.isArray(apiResponse.data)) {
          const rawReports: ApiReportData[] = apiResponse.data;

          const validAndFlattenedReports = rawReports
            .filter((report: ApiReportData) =>
              report &&
              typeof report === 'object' &&
              report.location && // Ensure location object exists
              typeof report.location.latitude === 'number' &&
              typeof report.location.longitude === 'number'
            )
            .map((report: ApiReportData): ReportLocation => ({
              report_id: report.id, // Map 'id' to 'report_id'
              category: report.category,
              status: report.status,
              description: report.description,
              location_id: report.locationId || '', // Handle potential null
              latitude: report.location!.latitude, // location is checked above
              longitude: report.location!.longitude, // location is checked above
              address: report.location!.address || 'Address not available', // Handle potential null
            }));
          setProcessedReportLocations(validAndFlattenedReports);
        } else {
          console.error('API response for reports was not successful or data is not an array:', apiResponse);
          setProcessedReportLocations([]);
        }
      } catch (error) {
        console.error('Failed to fetch or process report locations:', error);
        setProcessedReportLocations([]);
      }
    }

    fetchAndProcessReportLocations();
  }, [reportLocations]);

  // Add report location markers
  useEffect(() => {
    if (processedReportLocations.length > 0 && mapInstanceRef.current && window.google) {
      // Clear any existing markers if necessary (e.g. by keeping a list of markers and calling setMap(null) on them)
      // For simplicity here, we're not clearing, assuming markers are added once.
      // mapInstanceRef.current.setOptions({ clickableIcons: false }); // This was for something else

      processedReportLocations.forEach(report => {
        // The data in processedReportLocations is already validated and flattened
        const reportPosition = {
          lat: Number(report.latitude), // Already number, but Number() is safe
          lng: Number(report.longitude) // Already number, but Number() is safe
        };

        console.log('Attempting to create marker for:', report.report_id, 'at', reportPosition);

        const marker = new google.maps.Marker({
          position: reportPosition,
          map: mapInstanceRef.current,
          title: `Report: ${report.category}`,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#FF0000",
            fillOpacity: 0.7,
            strokeWeight: 2,
            strokeColor: "#FFFFFF",
          },
          animation: google.maps.Animation.DROP,
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; max-width: 200px;">
              <h3 style="margin: 0 0 8px; color: #FF0000; font-weight: bold;">${report.category}</h3>
              <p style="margin: 0 0 8px;">${report.description}</p>
              <p style="margin: 0; font-style: italic; font-size: 12px;">Status: ${report.status}</p>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(mapInstanceRef.current, marker);
        });
      });
    }
  }, [processedReportLocations, mapInstanceRef.current]); // Rerun when processed locations change or map is ready
  
  // Initialize map after component mounts
  useEffect(() => {
    if (mapInitialized.current || !window.google || !window.google.maps || !mapRef.current) {
      // If already initialized or google maps not ready or mapRef not ready, do nothing
      if (!window.google || !window.google.maps) {
          // console.log("Google Maps API not ready yet for initMap");
      }
      return;
    }
    
    const initMap = () => {
      if (!window.google || !window.google.maps || !mapRef.current) {
        // console.log("initMap called but dependencies not ready");
        return; // Redundant check, but safe
      }
      
      if (mapInitialized.current) return; // Prevent re-initialization
      mapInitialized.current = true;
      // console.log("Initializing map...");
      
      const defaultLocation = { lat: 3.1390, lng: 101.6869 };
      
      const map = new google.maps.Map(mapRef.current, {
        center: defaultLocation,
        zoom: 13,
        mapTypeId: "roadmap",
        styles: [
          { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
          { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
          { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
          { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
          { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
          { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
          { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
          { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
          { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
          { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
          { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
          { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
          { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
          { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
          { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
          { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] },
        ]
      });
      
      mapInstanceRef.current = map;
      // console.log("Map instance created and stored in ref.");
      
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            map.setCenter(userLocation);
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
            console.log("Unable to retrieve your location for map centering.");
          }
        );
      }
    };
    
    if (window.google && window.google.maps) {
      // console.log("Google Maps API already loaded, calling initMap directly.");
      initMap();
    } else {
      // console.log("Google Maps API not loaded yet, setting window.initMap callback.");
      window.initMap = initMap; // This is for the <Script> callback
    }
    // Adding dependencies that should trigger re-initialization IF they change,
    // though for map init this usually runs once.
  }, [googleMapsApiKey]); // apiKey is part of googleMapsApiKey

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places&callback=initMap`}
        strategy="afterInteractive"
        // onReady and onError could be useful for more robust loading indication
      />
      <div 
        ref={mapRef} 
        className="w-full h-[400px] bg-gray-800/60 border border-amber-700/30"
      />
    </>
  );
} 