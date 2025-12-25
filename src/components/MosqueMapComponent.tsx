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

// Beautiful mosque marker icon
const createMosqueMarkerIcon = (isSelected: boolean) => {
  const size = isSelected ? 56 : 48;
  const color = isSelected ? "#d4af37" : "#0d9488";

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size + 12}" viewBox="0 0 48 60">
      <defs>
        <filter id="shadow" x="-30%" y="-20%" width="160%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" flood-opacity="0.35"/>
        </filter>
        <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:${isSelected ? '#f0d060' : '#14b8a6'};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color};stop-opacity:1" />
        </linearGradient>
      </defs>
      <g filter="url(%23shadow)">
        <!-- Pin body -->
        <path d="M24 4C14.06 4 6 12.06 6 22c0 14 18 32 18 32s18-18 18-32c0-9.94-8.06-18-18-18z" fill="url(%23grad)"/>
        <!-- White inner circle -->
        <circle cx="24" cy="20" r="12" fill="white"/>
        <!-- Mosque silhouette -->
        <g fill="${color}">
          <!-- Central dome -->
          <ellipse cx="24" cy="17" rx="6" ry="4"/>
          <!-- Crescent on dome -->
          <circle cx="24" cy="13" r="1.5"/>
          <!-- Building base -->
          <rect x="16" y="20" width="16" height="8" rx="1"/>
          <!-- Door -->
          <path d="M22 28v-5a2 2 0 0 1 4 0v5" fill="white"/>
          <!-- Left minaret -->
          <rect x="13" y="16" width="3" height="12"/>
          <ellipse cx="14.5" cy="15" rx="2" ry="1.5"/>
          <circle cx="14.5" cy="13.5" r="1"/>
          <!-- Right minaret -->
          <rect x="32" y="16" width="3" height="12"/>
          <ellipse cx="33.5" cy="15" rx="2" ry="1.5"/>
          <circle cx="33.5" cy="13.5" r="1"/>
        </g>
      </g>
    </svg>
  `;

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new google.maps.Size(size, size + 12),
    anchor: new google.maps.Point(size / 2, size + 12),
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
