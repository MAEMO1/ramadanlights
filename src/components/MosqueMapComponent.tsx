"use client";

import { useCallback, useState, useEffect } from "react";
import { GoogleMap, useJsApiLoader, MarkerF, OverlayView } from "@react-google-maps/api";
import { Navigation, MapPin } from "lucide-react";

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

// Simple clean marker
const createMosqueMarkerIcon = (isSelected: boolean) => {
  const size = isSelected ? 44 : 36;
  const color = isSelected ? "#d4af37" : "#2d9596";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 36 36">
    <circle cx="18" cy="18" r="16" fill="${color}" stroke="white" stroke-width="3"/>
    <text x="18" y="23" text-anchor="middle" font-family="Arial" font-size="14" fill="white">☪</text>
  </svg>`;

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new google.maps.Size(size, size),
    anchor: new google.maps.Point(size / 2, size / 2),
  };
};

// Clean minimal tooltip
interface InfoTooltipProps {
  mosque: Mosque;
  onClose: () => void;
}

const InfoTooltip = ({ mosque, onClose }: InfoTooltipProps) => {
  return (
    <div
      className="bg-[#0f2d2d] text-white rounded-lg shadow-xl min-w-[240px] max-w-[280px] overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-white text-base mb-1 pr-2">
          {mosque.name}
        </h3>
        <p className="text-white/60 text-sm flex items-start gap-1.5 mb-4">
          <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
          <span>{mosque.fullAddress}</span>
        </p>

        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mosque.fullAddress)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-teal text-white text-sm font-medium rounded-lg hover:bg-teal/90 transition-colors"
        >
          <Navigation className="w-4 h-4" />
          Route plannen
        </a>
      </div>

      {/* Arrow */}
      <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-[#0f2d2d]" />
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
    if (map && mosque.latitude && mosque.longitude) {
      map.panTo({ lat: mosque.latitude + 0.002, lng: mosque.longitude });
    }
  };

  const handleCloseInfoWindow = () => {
    setActiveInfoWindow(null);
    setActiveMosque(null);
  };

  if (loadError) {
    return (
      <div className="w-full h-full bg-[#0f2d2d] flex items-center justify-center">
        <div className="text-white/50">Kaart kon niet geladen worden</div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full bg-[#0f2d2d] flex items-center justify-center">
        <div className="flex items-center gap-3 text-white/50">
          <div className="w-5 h-5 border-2 border-teal/30 border-t-teal rounded-full animate-spin" />
          <span>Kaart laden...</span>
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

      {activeMosque && activeMosque.latitude && activeMosque.longitude && (
        <OverlayView
          position={{ lat: activeMosque.latitude, lng: activeMosque.longitude }}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          getPixelPositionOffset={(width, height) => ({
            x: -(width / 2),
            y: -(height + 28),
          })}
        >
          <InfoTooltip mosque={activeMosque} onClose={handleCloseInfoWindow} />
        </OverlayView>
      )}
    </GoogleMap>
  );
}
