/* eslint-disable @typescript-eslint/no-explicit-any */
// The above comment disables the no-explicit-any rule for this file since 
// we're declaring types for an external library

interface Window {
  google: {
    maps: {
      Map: any;
      Marker: any;
      InfoWindow: any;
      LatLng: any;
      SymbolPath: any;
      Animation: any;
      event: any;
      places: any;
      Geocoder: any;
      Size: any;
      Point: any;
      MapTypeId: any;
    }
  };
  initMap: () => void;
} 