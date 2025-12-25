"use client";

import { useCallback, useState } from "react";
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from "@react-google-maps/api";
import { type IftarLocation, formatFrequencyDisplay } from "@/lib/iftar-types";
import { Navigation, ExternalLink, Globe, Facebook, Instagram } from "lucide-react";

export type { IftarLocation };

interface IftarMapComponentProps {
  locations: IftarLocation[];
  center?: { lat: number; lng: number };
  zoom?: number;
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
  minHeight: "400px",
  borderRadius: "1rem",
};

// Dark mode map style
const darkMapStyle: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#0f2d2d" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0f2d2d" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d4af37" }],
  },
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#1a4a4a" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#2d5a5a" }],
  },
  {
    featureType: "transit",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0a1f1f" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
];

// Beautiful gold pin icon for iftar locations with plate/food symbol
const createIftarMarkerIcon = (isSelected: boolean) => {
  const size = isSelected ? 56 : 48;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size + 12}" viewBox="0 0 48 60">
      <defs>
        <filter id="shadow" x="-30%" y="-20%" width="160%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" flood-opacity="0.4"/>
        </filter>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#fcd34d;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#d4af37;stop-opacity:1" />
        </linearGradient>
      </defs>
      <g filter="url(%23shadow)">
        <!-- Pin body -->
        <path d="M24 4C14.06 4 6 12.06 6 22c0 14 18 32 18 32s18-18 18-32c0-9.94-8.06-18-18-18z" fill="url(%23goldGrad)"/>
        <!-- Dark inner circle -->
        <circle cx="24" cy="20" r="12" fill="#0f2d2d"/>
        <!-- Iftar symbol: crescent moon and star -->
        <g fill="#d4af37">
          <!-- Crescent moon -->
          <path d="M20 14c0 5.5 4.5 10 10 10a10 10 0 0 1-3-7c0-4.5-3-8-7-8a10 10 0 0 1 0 5z"/>
          <!-- Star -->
          <polygon points="30,12 31,15 34,15 31.5,17 32.5,20 30,18 27.5,20 28.5,17 26,15 29,15"/>
          <!-- Plate/dish at bottom -->
          <ellipse cx="24" cy="26" rx="8" ry="2.5"/>
          <path d="M16 25c0-1 3.5-2 8-2s8 1 8 2" fill="none" stroke="#d4af37" stroke-width="1.5"/>
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

export default function IftarMapComponent({
  locations,
  center = { lat: 51.0543, lng: 3.7174 },
  zoom = 13,
}: IftarMapComponentProps) {
  const [activeInfoWindow, setActiveInfoWindow] = useState<string | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);

    // Fit bounds to show all locations
    const locationsWithCoords = locations.filter((l) => l.latitude && l.longitude);
    if (locationsWithCoords.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      locationsWithCoords.forEach((location) => {
        if (location.latitude && location.longitude) {
          bounds.extend({ lat: location.latitude, lng: location.longitude });
        }
      });
      map.fitBounds(bounds, 50);
    }
  }, [locations]);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  if (loadError) {
    return (
      <div className="w-full h-full bg-[#0a2020] rounded-2xl flex items-center justify-center" style={{ minHeight: "400px" }}>
        <div className="text-white/50">Kaart kon niet geladen worden</div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full bg-[#0a2020] rounded-2xl flex items-center justify-center" style={{ minHeight: "400px" }}>
        <div className="text-white/50">Kaart laden...</div>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={zoom}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: true,
        styles: darkMapStyle,
      }}
    >
      {locations.map((location) => {
        if (!location.latitude || !location.longitude) return null;

        const isActive = activeInfoWindow === location.id;
        const frequencyText = formatFrequencyDisplay(location.frequency, location.days_of_week || []);

        return (
          <MarkerF
            key={location.id}
            position={{ lat: location.latitude, lng: location.longitude }}
            icon={createIftarMarkerIcon(isActive)}
            onClick={() => setActiveInfoWindow(location.id)}
            zIndex={isActive ? 1000 : 1}
          >
            {isActive && (
              <InfoWindowF
                position={{ lat: location.latitude, lng: location.longitude }}
                onCloseClick={() => setActiveInfoWindow(null)}
              >
                <div className="p-2 min-w-[220px] max-w-[280px]">
                  <h3 className="font-semibold text-base text-[#0f2d2d] mb-1">
                    {location.mosque_name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {location.address}, {location.city}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                      {location.iftar_time || "Tijd onbekend"}
                    </span>
                    <span className="px-2 py-0.5 bg-teal/10 text-teal rounded-full text-xs font-medium">
                      {frequencyText}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {location.is_free && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                        Gratis
                      </span>
                    )}
                    {location.capacity && (
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs">
                        {location.capacity} pers.
                      </span>
                    )}
                    {location.for_men && (
                      <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">M</span>
                    )}
                    {location.for_women && (
                      <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">V</span>
                    )}
                    {location.for_families && (
                      <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">Gezin</span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${location.address}, ${location.city}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-1 bg-teal text-white text-xs rounded-full hover:bg-teal/90"
                    >
                      <Navigation className="w-3 h-3" />
                      Route
                    </a>
                    {location.registration_url && (
                      <a
                        href={location.registration_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500 text-white text-xs rounded-full hover:bg-amber-600"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Inschrijven
                      </a>
                    )}
                    {location.website_url && (
                      <a
                        href={location.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-gray-200"
                      >
                        <Globe className="w-3 h-3" />
                      </a>
                    )}
                    {location.facebook_url && (
                      <a
                        href={location.facebook_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full hover:bg-blue-200"
                      >
                        <Facebook className="w-3 h-3" />
                      </a>
                    )}
                    {location.instagram_url && (
                      <a
                        href={location.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded-full hover:bg-pink-200"
                      >
                        <Instagram className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </InfoWindowF>
            )}
          </MarkerF>
        );
      })}
    </GoogleMap>
  );
}
