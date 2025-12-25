"use client";

import { useCallback, useState } from "react";
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from "@react-google-maps/api";
import { Navigation } from "lucide-react";

interface Mosque {
  id: string;
  name: string;
  address: string;
  houseNumber: string;
  city: string;
  fullAddress: string;
  latitude: number | null;
  longitude: number | null;
}

interface MosqueMapComponentProps {
  mosques: Mosque[];
  selectedMosqueId?: string | null;
  onMosqueSelect?: (mosque: Mosque) => void;
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

// Center of Gent
const center = {
  lat: 51.0543,
  lng: 3.7174,
};

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "transit",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
  ],
};

// Simple mosque marker icon as SVG data URL
const createMosqueMarkerIcon = (isSelected: boolean) => {
  const color = isSelected ? "#d4af37" : "#0d9488";
  const size = isSelected ? 40 : 32;

  // Simple, clean mosque icon - just a dome shape
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-opacity="0.3"/>
        </filter>
      </defs>
      <g filter="url(%23shadow)">
        <!-- Pin shape -->
        <path d="M16 2C10.48 2 6 6.48 6 12c0 7.5 10 17 10 17s10-9.5 10-17c0-5.52-4.48-10-10-10z" fill="${color}"/>
        <!-- Inner circle -->
        <circle cx="16" cy="12" r="6" fill="white"/>
        <!-- Simple mosque dome -->
        <path d="M16 8c-2.5 0-4.5 1.5-4.5 3.5v2.5h9v-2.5c0-2-2-3.5-4.5-3.5z" fill="${color}"/>
        <!-- Crescent on top -->
        <circle cx="16" cy="8" r="1" fill="${color}"/>
      </g>
    </svg>
  `;

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new google.maps.Size(size, size),
    anchor: new google.maps.Point(size / 2, size),
  };
};

export default function MosqueMapComponent({ mosques, selectedMosqueId, onMosqueSelect }: MosqueMapComponentProps) {
  const [activeInfoWindow, setActiveInfoWindow] = useState<string | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);

    // Fit bounds to show all mosques
    const mosquesWithCoords = mosques.filter((m) => m.latitude && m.longitude);
    if (mosquesWithCoords.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      mosquesWithCoords.forEach((mosque) => {
        if (mosque.latitude && mosque.longitude) {
          bounds.extend({ lat: mosque.latitude, lng: mosque.longitude });
        }
      });
      map.fitBounds(bounds, 50);
    }
  }, [mosques]);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleMarkerClick = (mosque: Mosque) => {
    setActiveInfoWindow(mosque.id);
    if (onMosqueSelect) {
      onMosqueSelect(mosque);
    }
  };

  if (loadError) {
    return (
      <div className="w-full h-full bg-[#0a2020] rounded-2xl flex items-center justify-center">
        <div className="text-white/50">Kaart kon niet geladen worden</div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full bg-[#0a2020] rounded-2xl flex items-center justify-center">
        <div className="text-white/50">Kaart laden...</div>
      </div>
    );
  }

  const mosquesWithCoords = mosques.filter((m) => m.latitude && m.longitude);

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={13}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={mapOptions}
    >
      {mosquesWithCoords.map((mosque) => (
        <MarkerF
          key={mosque.id}
          position={{ lat: mosque.latitude!, lng: mosque.longitude! }}
          icon={createMosqueMarkerIcon(mosque.id === selectedMosqueId || mosque.id === activeInfoWindow)}
          onClick={() => handleMarkerClick(mosque)}
          zIndex={mosque.id === selectedMosqueId ? 1000 : 1}
        >
          {activeInfoWindow === mosque.id && (
            <InfoWindowF
              position={{ lat: mosque.latitude!, lng: mosque.longitude! }}
              onCloseClick={() => setActiveInfoWindow(null)}
            >
              <div className="p-2 min-w-[200px]">
                <h3 className="font-semibold text-base text-teal mb-1">
                  {mosque.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {mosque.fullAddress}
                </p>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mosque.fullAddress)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal text-white text-sm rounded-full hover:bg-teal/90 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Route
                </a>
              </div>
            </InfoWindowF>
          )}
        </MarkerF>
      ))}
    </GoogleMap>
  );
}
