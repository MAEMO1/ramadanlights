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

// Dark teal map style (matching mosques page)
const darkTealMapStyle: google.maps.MapTypeStyle[] = [
  {
    elementType: "geometry",
    stylers: [{ color: "#1d3d3d" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#1d3d3d" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#8ec3c3" }],
  },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [{ color: "#2d5a5a" }],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "labels.text.fill",
    stylers: [{ color: "#5a8a8a" }],
  },
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#243f3f" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#2a4f4f" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f3a3a" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#3a6363" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#2a4f4f" }],
  },
  {
    featureType: "transit",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "transit.line",
    elementType: "geometry",
    stylers: [{ color: "#2a4f4f" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0f2828" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#4a7a7a" }],
  },
];

// Simple drop-pin marker for iftar locations (mobile compatible)
const createIftarMarkerIcon = (isSelected: boolean) => {
  const scale = isSelected ? 1.2 : 1;
  const width = Math.round(40 * scale);
  const height = Math.round(52 * scale);
  const color = isSelected ? "%23d4af37" : "%232d9596";

  // Simple SVG - crescent made with two circles
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 40 52"><path d="M20 50c0 0-17-19-17-32C3 9.16 10.16 2 20 2s17 7.16 17 16c0 13-17 32-17 32z" fill="${color}" stroke="white" stroke-width="2"/><circle cx="20" cy="18" r="10" fill="white"/><circle cx="18" cy="18" r="6" fill="${color}"/><circle cx="21" cy="18" r="5" fill="white"/></svg>`;

  return {
    url: `data:image/svg+xml,${svg}`,
    scaledSize: new google.maps.Size(width, height),
    anchor: new google.maps.Point(width / 2, height),
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
      map.fitBounds(bounds, 80);
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
        styles: darkTealMapStyle,
        maxZoom: 15,
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
