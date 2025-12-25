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

// Custom mosque icon - mosque silhouette with dome and minaret
const createMosqueIcon = (isSelected: boolean) => {
  const size = isSelected ? 44 : 36;
  return L.divIcon({
    className: "custom-mosque-marker",
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        display: flex;
        align-items: center;
        justify-content: center;
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        transition: all 0.2s;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
          <!-- Background circle -->
          <circle cx="32" cy="32" r="30" fill="${isSelected ? "#d4af37" : "#0d9488"}" stroke="white" stroke-width="3"/>
          <!-- Mosque building -->
          <g fill="white">
            <!-- Main dome -->
            <path d="M32 14c-6 0-11 4-11 9v2h22v-2c0-5-5-9-11-9z"/>
            <!-- Dome crescent -->
            <circle cx="32" cy="13" r="2"/>
            <path d="M32 10l1 2h-2z"/>
            <!-- Building body -->
            <rect x="21" y="25" width="22" height="18" rx="1"/>
            <!-- Door -->
            <path d="M28 43v-10c0-2.2 1.8-4 4-4s4 1.8 4 4v10h-8z"/>
            <!-- Left minaret -->
            <rect x="16" y="20" width="4" height="23"/>
            <path d="M18 15c-1.5 0-3 1.5-3 3v2h6v-2c0-1.5-1.5-3-3-3z"/>
            <circle cx="18" cy="14" r="1.5"/>
            <!-- Right minaret -->
            <rect x="44" y="20" width="4" height="23"/>
            <path d="M46 15c-1.5 0-3 1.5-3 3v2h6v-2c0-1.5-1.5-3-3-3z"/>
            <circle cx="46" cy="14" r="1.5"/>
            <!-- Windows -->
            <circle cx="26" cy="32" r="2"/>
            <circle cx="38" cy="32" r="2"/>
          </g>
        </svg>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
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
