"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

// Custom mosque icon
const createMosqueIcon = (isSelected: boolean) => {
  return L.divIcon({
    className: "custom-mosque-marker",
    html: `
      <div style="
        width: ${isSelected ? "40px" : "32px"};
        height: ${isSelected ? "40px" : "32px"};
        background: ${isSelected ? "#d4af37" : "#0d9488"};
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="${isSelected ? "20" : "16"}" height="${isSelected ? "20" : "16"}" viewBox="0 0 24 24" fill="white">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
          <path d="M12 6c-2.21 0-4 1.79-4 4v6h2v-3h4v3h2v-6c0-2.21-1.79-4-4-4zm2 5h-4v-1c0-1.1.9-2 2-2s2 .9 2 2v1z"/>
        </svg>
      </div>
    `,
    iconSize: [isSelected ? 40 : 32, isSelected ? 40 : 32],
    iconAnchor: [isSelected ? 20 : 16, isSelected ? 40 : 32],
    popupAnchor: [0, isSelected ? -40 : -32],
  });
};

export default function MosqueMapComponent({ mosques, selectedMosqueId, onMosqueSelect }: MosqueMapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Center of Gent
  const center: [number, number] = [51.0543, 3.7174];
  const zoom = 13;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Initialize map
    mapRef.current = L.map(containerRef.current, {
      center,
      zoom,
      zoomControl: true,
    });

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update markers when mosques or selection changes
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add new markers
    const mosquesWithCoords = mosques.filter((m) => m.latitude && m.longitude);

    mosquesWithCoords.forEach((mosque) => {
      if (!mosque.latitude || !mosque.longitude || !mapRef.current) return;

      const isSelected = mosque.id === selectedMosqueId;
      const marker = L.marker([mosque.latitude, mosque.longitude], {
        icon: createMosqueIcon(isSelected),
      });

      marker.bindPopup(`
        <div style="min-width: 200px;">
          <h3 style="font-weight: 600; margin-bottom: 4px; color: #0d9488;">${mosque.name}</h3>
          <p style="font-size: 13px; color: #666;">${mosque.fullAddress}</p>
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mosque.fullAddress)}"
            target="_blank"
            rel="noopener noreferrer"
            style="display: inline-block; margin-top: 8px; padding: 6px 12px; background: #0d9488; color: white; border-radius: 6px; text-decoration: none; font-size: 12px;"
          >
            Route plannen
          </a>
        </div>
      `);

      marker.on("click", () => {
        if (onMosqueSelect) {
          onMosqueSelect(mosque);
        }
      });

      marker.addTo(mapRef.current!);
      markersRef.current.push(marker);

      // Open popup if selected
      if (isSelected) {
        marker.openPopup();
      }
    });

    // Fit bounds if there are markers
    if (mosquesWithCoords.length > 0) {
      const bounds = L.latLngBounds(
        mosquesWithCoords.map((m) => [m.latitude!, m.longitude!] as [number, number])
      );
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [mosques, selectedMosqueId, onMosqueSelect]);

  return <div ref={containerRef} className="w-full h-full" />;
}
