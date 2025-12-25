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

// Clean, minimal mosque marker
const createMosqueMarkerIcon = (isSelected: boolean) => {
  const size = isSelected ? 44 : 38;
  const color = isSelected ? "#d4af37" : "#0d9488";

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 40 40">
      <defs>
        <filter id="s" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.25"/>
        </filter>
      </defs>
      <g filter="url(%23s)">
        <circle cx="20" cy="20" r="16" fill="${color}"/>
        <circle cx="20" cy="20" r="13" fill="white"/>
        <g fill="${color}">
          <path d="M20 10 L20 8 M19 9 L21 9" stroke="${color}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
          <path d="M20 11c-4 0-7 2.5-7 5.5v8h14v-8c0-3-3-5.5-7-5.5z"/>
          <rect x="18" y="20" width="4" height="5" rx="2" fill="white"/>
        </g>
      </g>
    </svg>
  `;

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new google.maps.Size(size, size),
    anchor: new google.maps.Point(size / 2, size / 2),
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
