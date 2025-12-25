"use client";

import { useCallback, useState, useEffect } from "react";
import { GoogleMap, useJsApiLoader, MarkerF, OverlayView } from "@react-google-maps/api";
import { Navigation, X } from "lucide-react";

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
    // Subtle dark teal theme
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
  ],
};

// Elegant drop-pin marker for mosques
const createMosqueMarkerIcon = (isSelected: boolean) => {
  const scale = isSelected ? 1.2 : 1;
  const width = Math.round(40 * scale);
  const height = Math.round(52 * scale);
  const color = isSelected ? "#d4af37" : "#2d9596";
  const glowColor = isSelected ? "#d4af37" : "#2d9596";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 40 52">
    <defs>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="${glowColor}" flood-opacity="0.4"/>
      </filter>
      <linearGradient id="pinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${isSelected ? '#b8962f' : '#1f6b6c'};stop-opacity:1" />
      </linearGradient>
    </defs>
    <g filter="url(%23glow)">
      <path d="M20 50c0 0-17-19-17-32C3 9.16 10.16 2 20 2s17 7.16 17 16c0 13-17 32-17 32z" fill="url(%23pinGrad)"/>
      <circle cx="20" cy="18" r="11" fill="white"/>
      <text x="20" y="23" text-anchor="middle" font-family="Arial" font-size="14" font-weight="bold" fill="${color}">☪</text>
    </g>
  </svg>`;

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new google.maps.Size(width, height),
    anchor: new google.maps.Point(width / 2, height),
  };
};

// Custom InfoWindow component that matches the design
interface CustomInfoWindowProps {
  mosque: Mosque;
  onClose: () => void;
}

const CustomInfoWindow = ({ mosque, onClose }: CustomInfoWindowProps) => {
  return (
    <div className="relative">
      {/* Arrow pointing down */}
      <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-4 h-4 bg-white rotate-45 shadow-lg" />

      {/* Card content */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-5 min-w-[280px] max-w-[320px] border border-gray-100">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with icon */}
        <div className="flex items-start gap-3 mb-3 pr-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white text-lg shadow-md flex-shrink-0">
            ☪
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-base leading-tight">
              {mosque.name}
            </h3>
            <span className="text-xs text-teal-600 font-medium">{mosque.city}</span>
          </div>
        </div>

        {/* Address */}
        <p className="text-sm text-gray-500 mb-4 pl-[52px]">
          {mosque.fullAddress}
        </p>

        {/* Route button */}
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mosque.fullAddress)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-medium rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all shadow-md shadow-teal-500/20"
        >
          <Navigation className="w-4 h-4" />
          Route plannen
        </a>
      </div>
    </div>
  );
};

export default function MosqueMapComponent({ mosques, selectedMosqueId, onMosqueSelect }: MosqueMapComponentProps) {
  const [activeInfoWindow, setActiveInfoWindow] = useState<string | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [activeMosque, setActiveMosque] = useState<Mosque | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  // Find and set active mosque when activeInfoWindow changes
  useEffect(() => {
    if (activeInfoWindow) {
      const mosque = mosques.find(m => m.id === activeInfoWindow);
      setActiveMosque(mosque || null);
    } else {
      setActiveMosque(null);
    }
  }, [activeInfoWindow, mosques]);

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
      map.fitBounds(bounds, 60);
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

    // Pan to mosque with offset for info window
    if (map && mosque.latitude && mosque.longitude) {
      map.panTo({ lat: mosque.latitude + 0.003, lng: mosque.longitude });
    }
  };

  const handleCloseInfoWindow = () => {
    setActiveInfoWindow(null);
    setActiveMosque(null);
  };

  if (loadError) {
    return (
      <div className="w-full h-full bg-[#0a2020] rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="text-white/30 text-4xl mb-4">☪</div>
          <div className="text-white/50">Kaart kon niet geladen worden</div>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full bg-[#0a2020] rounded-2xl flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-2 border-teal-500/30 border-t-teal-500 rounded-full animate-spin mb-4" />
          <div className="text-white/50">Kaart laden...</div>
        </div>
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
      onClick={handleCloseInfoWindow}
    >
      {mosquesWithCoords.map((mosque) => (
        <MarkerF
          key={mosque.id}
          position={{ lat: mosque.latitude!, lng: mosque.longitude! }}
          icon={createMosqueMarkerIcon(mosque.id === selectedMosqueId || mosque.id === activeInfoWindow)}
          onClick={() => handleMarkerClick(mosque)}
          zIndex={mosque.id === selectedMosqueId || mosque.id === activeInfoWindow ? 1000 : 1}
        />
      ))}

      {/* Custom InfoWindow using OverlayView */}
      {activeMosque && activeMosque.latitude && activeMosque.longitude && (
        <OverlayView
          position={{ lat: activeMosque.latitude, lng: activeMosque.longitude }}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          getPixelPositionOffset={(width, height) => ({
            x: -(width / 2),
            y: -(height + 60),
          })}
        >
          <CustomInfoWindow mosque={activeMosque} onClose={handleCloseInfoWindow} />
        </OverlayView>
      )}
    </GoogleMap>
  );
}
