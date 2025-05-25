'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { ReportLocation } from './MapWrapper';

// Interface for the raw data from /api/reports
interface ApiReportData {
  id: string;
  category: string;
  status: string;
  description: string;
  imagePath: string | null;
  createdAt: string;
  locationId: string | null;
  location: {
    id: string;
    latitude: number;
    longitude: number;
    address: string | null;
  } | null;
}

interface ReportLocation {
  report_id: string;
  category: string;
  status: string;
  description: string;
  location_id: string;
  latitude: number;
  longitude: number;
  address: string;
  imagePath: string | null;
  createdAt: string;
}

interface GoogleMapProps {
  apiKey: string;
  reportLocations?: ReportLocation[];
  initialLocation?: {
    lat: number;
    lng: number;
  };
}

export default function GoogleMap({ apiKey, reportLocations = [], initialLocation }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInitialized = useRef(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const [processedReportLocations, setProcessedReportLocations] = useState<ReportLocation[]>([]);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  
  const googleMapsApiKey = apiKey || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  // Initialize map after component mounts
  useEffect(() => {
    if (mapInitialized.current || !window.google || !window.google.maps || !mapRef.current) {
      return;
    }
    
    const initMap = () => {
      if (!window.google || !window.google.maps || !mapRef.current) {
        return;
      }
      
      if (mapInitialized.current) return;
      mapInitialized.current = true;
      
      const defaultLocation = initialLocation || { lat: 3.1390, lng: 101.6869 };
      
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
      
      // Add marker for user's location if available
      if (initialLocation) {
        new google.maps.Marker({
          position: initialLocation,
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
      }
      
      // Signal that the map is ready
      setIsMapReady(true);
    };
    
    if (window.google && window.google.maps) {
      initMap();
    } else {
      window.initMap = initMap;
    }
  }, [googleMapsApiKey, initialLocation]);

  // Fetch and process report locations
  useEffect(() => {
    if (reportLocations.length > 0) {
      const validReportsFromProps = reportLocations.filter((report: ReportLocation) =>
        report &&
        typeof report === 'object' &&
        Object.keys(report).length > 0 &&
        typeof report.latitude === 'number' &&
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
              report.location &&
              typeof report.location.latitude === 'number' &&
              typeof report.location.longitude === 'number'
            )
            .map((report: ApiReportData): ReportLocation => ({
              report_id: report.id,
              category: report.category,
              status: report.status,
              description: report.description,
              location_id: report.locationId || '',
              latitude: report.location!.latitude,
              longitude: report.location!.longitude,
              address: report.location!.address || 'Address not available',
              imagePath: report.imagePath,
              createdAt: report.createdAt
            }));
          setProcessedReportLocations(validAndFlattenedReports);
        }
      } catch (error) {
        console.error('Failed to fetch or process report locations:', error);
        setProcessedReportLocations([]);
      }
    }

    fetchAndProcessReportLocations();
  }, [reportLocations]);

  // Add markers only when both map and data are ready
  useEffect(() => {
    if (!isMapReady || processedReportLocations.length === 0 || !mapInstanceRef.current || !window.google) {
      return;
    }

    // Clear existing markers if any
    const map = mapInstanceRef.current;

    processedReportLocations.forEach(report => {
      const reportPosition = {
        lat: Number(report.latitude),
        lng: Number(report.longitude)
      };

      const marker = new google.maps.Marker({
        position: reportPosition,
        map: map,
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

      // Format the date
      const reportDate = new Date(report.createdAt);
      const formattedDate = reportDate.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      // Create the info window content with image and details
      const infoWindowContent = `
        <div style="padding: 16px; max-width: 300px; font-family: system-ui, sans-serif;">
          <h3 style="margin: 0 0 12px; color: #FF0000; font-weight: bold; font-size: 18px; text-transform: uppercase;">
            ${report.category}
          </h3>
          ${report.imagePath ? `
            <div style="margin-bottom: 12px;">
              <img src="${report.imagePath}" alt="Report evidence" style="width: 100%; height: auto; border-radius: 4px; border: 2px solid rgba(180, 83, 9, 0.5);">
            </div>
          ` : ''}
          <div style="margin-bottom: 12px;">
            <p style="margin: 0 0 8px; line-height: 1.5;">${report.description}</p>
            <p style="margin: 0; font-size: 12px; color: #666;">
              <strong>Location:</strong> ${report.address}
            </p>
          </div>
          <div style="font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 8px;">
            <p style="margin: 0 0 4px;">
              <strong>Status:</strong> 
              <span style="color: ${report.status === 'pending' ? '#FFA500' : '#4CAF50'};">
                ${report.status.charAt(0).toUpperCase() + report.status.slice(1)}
              </span>
            </p>
            <p style="margin: 0; font-style: italic;">
              Reported on ${formattedDate}
            </p>
          </div>
        </div>
      `;

      const infoWindow = new google.maps.InfoWindow({
        content: infoWindowContent,
        maxWidth: 320
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });
    });
  }, [isMapReady, processedReportLocations]);

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places&callback=initMap`}
        strategy="afterInteractive"
      />
      <div 
        ref={mapRef} 
        className="w-full h-[400px] bg-gray-800/60 border border-amber-700/30"
      />
    </>
  );
} 