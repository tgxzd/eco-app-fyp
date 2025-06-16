'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { ReportLocation } from './MapWrapper';

// Interface for the raw data from /api/reports
interface ApiReportData {
  id: string;
  category: string;
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
          // Enhanced dark theme with emerald accents
          { elementType: "geometry", stylers: [{ color: "#0f1419" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#0f1419" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#6b7280" }] },
          
          // Administrative areas
          { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#10b981" }] },
          { featureType: "administrative.country", elementType: "labels.text.fill", stylers: [{ color: "#059669" }] },
          
          // Points of interest
          { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#34d399" }] },
          { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#064e3b" }] },
          { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#10b981" }] },
          { featureType: "poi.business", elementType: "geometry", stylers: [{ color: "#1f2937" }] },
          
          // Roads with emerald highlights
          { featureType: "road", elementType: "geometry", stylers: [{ color: "#1f2937" }] },
          { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#111827" }] },
          { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca3af" }] },
          { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#374151" }] },
          { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2937" }] },
          { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#d1fae5" }] },
          { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#2d3748" }] },
          { featureType: "road.local", elementType: "geometry", stylers: [{ color: "#1a202c" }] },
          
          // Transit
          { featureType: "transit", elementType: "geometry", stylers: [{ color: "#1f2937" }] },
          { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#10b981" }] },
          
          // Water with emerald tint
          { featureType: "water", elementType: "geometry", stylers: [{ color: "#0c4a6e" }] },
          { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#0891b2" }] },
          { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#0c4a6e" }] },
          
          // Landscape
          { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#111827" }] },
          { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: "#1f2937" }] },
        ],
        // Enhanced map options
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true,
        gestureHandling: 'cooperative',
        // Custom styling for controls
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_BOTTOM,
          style: google.maps.ZoomControlStyle.SMALL
        },
        fullscreenControlOptions: {
          position: google.maps.ControlPosition.RIGHT_TOP
        }
      });
      
      mapInstanceRef.current = map;
      
      // Add custom user location marker with enhanced styling
      if (initialLocation) {
        // Create custom user marker with pulsing effect
        const userMarker = new google.maps.Marker({
          position: initialLocation,
          map: map,
          title: "Your Location",
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: "#10b981",
            fillOpacity: 0.8,
            strokeWeight: 3,
            strokeColor: "#ffffff",
            strokeOpacity: 0.9,
          },
          animation: google.maps.Animation.DROP,
        });

        // Add pulsing circle around user location
        const userCircle = new google.maps.Circle({
          strokeColor: "#10b981",
          strokeOpacity: 0.6,
          strokeWeight: 2,
          fillColor: "#10b981",
          fillOpacity: 0.1,
          map: map,
          center: initialLocation,
          radius: 500, // 500 meters
        });

        // Create info window for user location
        const userInfoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 12px; font-family: 'Poppins', sans-serif; max-width: 200px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <div style="width: 12px; height: 12px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 50%; box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);"></div>
                <h3 style="margin: 0; color: #10b981; font-weight: 600; font-size: 16px;">Your Location</h3>
              </div>
              <p style="margin: 0; color: #374151; font-size: 14px; line-height: 1.4;">
                You are here! Start exploring environmental reports in your area.
              </p>
            </div>
          `,
          maxWidth: 250
        });

        userMarker.addListener('click', () => {
          userInfoWindow.open(map, userMarker);
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
              status: 'pending', // Default status since it's not in the API data
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

  // Add enhanced markers for reports
  useEffect(() => {
    if (!isMapReady || processedReportLocations.length === 0 || !mapInstanceRef.current || !window.google) {
      return;
    }

    const map = mapInstanceRef.current;

    // Category-based marker styling
    const getCategoryIcon = (category: string) => {
      const categoryColors = {
        'pollution': { color: '#ef4444', bgColor: '#fef2f2' },
        'waste': { color: '#f59e0b', bgColor: '#fffbeb' },
        'water': { color: '#3b82f6', bgColor: '#eff6ff' },
        'air': { color: '#8b5cf6', bgColor: '#f5f3ff' },
        'noise': { color: '#ec4899', bgColor: '#fdf2f8' },
        'default': { color: '#ef4444', bgColor: '#fef2f2' }
      };

      const categoryStyle = categoryColors[category.toLowerCase() as keyof typeof categoryColors] || categoryColors.default;

      return {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 14,
        fillColor: categoryStyle.color,
        fillOpacity: 0.9,
        strokeWeight: 3,
        strokeColor: "#ffffff",
        strokeOpacity: 1,
      };
    };

    processedReportLocations.forEach((report, index) => {
      const reportPosition = {
        lat: Number(report.latitude),
        lng: Number(report.longitude)
      };

      // Create enhanced marker with category-based styling
      const marker = new google.maps.Marker({
        position: reportPosition,
        map: map,
        title: `${report.category} Report`,
        icon: getCategoryIcon(report.category),
        animation: google.maps.Animation.DROP,
        // Add slight delay for staggered animation
        optimized: false
      });

      // Add subtle bounce animation on hover
      marker.addListener('mouseover', () => {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(() => marker.setAnimation(null), 1400);
      });

      // Format the date
      const reportDate = new Date(report.createdAt || Date.now());
      const formattedDate = reportDate.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      // Enhanced info window with modern styling
      const infoWindowContent = `
        <div style="padding: 20px; max-width: 320px; font-family: 'Poppins', sans-serif; background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
            <div style="width: 40px; height: 40px; background: linear-gradient(135deg, ${getCategoryIcon(report.category).fillColor}, ${getCategoryIcon(report.category).fillColor}dd); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);">
              <div style="width: 12px; height: 12px; background: white; border-radius: 50%;"></div>
            </div>
            <div>
              <h3 style="margin: 0; color: #1f2937; font-weight: 600; font-size: 18px; text-transform: capitalize;">
                ${report.category} Issue
          </h3>
              <div style="display: flex; align-items: center; gap: 6px; margin-top: 4px;">
                <div style="width: 8px; height: 8px; background: #10b981; border-radius: 50%; animation: pulse 2s infinite;"></div>
                <span style="color: #10b981; font-size: 12px; font-weight: 500;">Active Report</span>
              </div>
            </div>
          </div>
          
          ${report.imagePath ? `
            <div style="margin-bottom: 16px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
              <img src="${report.imagePath}" alt="Report evidence" style="width: 100%; height: 160px; object-fit: cover; border: none;">
            </div>
          ` : ''}
          
          <div style="margin-bottom: 16px;">
            <p style="margin: 0 0 12px; line-height: 1.6; color: #374151; font-size: 14px;">${report.description}</p>
            <div style="background: #f3f4f6; padding: 12px; border-radius: 8px; border-left: 4px solid #10b981;">
              <p style="margin: 0; font-size: 13px; color: #6b7280;">
                <strong style="color: #374151;">📍 Location:</strong> ${report.address}
            </p>
            </div>
          </div>
          
          <div style="display: flex; justify-content: between; align-items: center; padding-top: 12px; border-top: 1px solid #e5e7eb;">
            <div style="font-size: 12px; color: #9ca3af;">
              <span style="color: #6b7280;">🕒 Reported ${report.createdAt ? formattedDate : 'Recently'}</span>
            </div>
          </div>
        </div>
      `;

      const infoWindow = new google.maps.InfoWindow({
        content: infoWindowContent,
        maxWidth: 350,
        pixelOffset: new google.maps.Size(0, -10)
      });

      marker.addListener('click', () => {
        // Close other info windows
        infoWindow.open(map, marker);
        
        // Center map on clicked marker with smooth animation
        map.panTo(reportPosition);
      });

      // Add clustering effect for nearby markers (simple version)
      setTimeout(() => {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        }
      }, 1000 + (index * 100));
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
        className="w-full h-[450px] bg-gradient-to-br from-gray-900 to-emerald-900/20 rounded-xl border border-emerald-500/20 shadow-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #111827 0%, #1f2937 50%, #064e3b 100%)'
        }}
      />
    </>
  );
} 