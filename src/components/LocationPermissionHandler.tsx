'use client';

import { useEffect } from 'react';
import { useLocation } from '@/contexts/LocationContext';

export default function LocationPermissionHandler() {
  const { error, isLoading } = useLocation();

  if (!error && !isLoading) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-black/80 border border-amber-700/50 p-4 rounded-lg shadow-lg max-w-sm">
      <p className="text-amber-100 font-serif text-sm">
        {isLoading ? 'Getting your location...' : error}
      </p>
    </div>
  );
} 