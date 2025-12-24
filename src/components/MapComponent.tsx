"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapComponentProps {
  center: [number, number];
  zoom: number;
  routes: [number, number][][];
  activeLocation: string;
}

export default function MapComponent({ center, zoom, routes, activeLocation }: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const routeLayersRef = useRef<L.Polyline[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize map only once
    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current, {
        center: center,
        zoom: zoom,
        zoomControl: false,
        attributionControl: false,
      });

      // Dark themed map tiles (CartoDB Dark Matter)
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
      }).addTo(mapRef.current);
    }

    return () => {
      // Cleanup on unmount
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update map view and routes when location changes
  useEffect(() => {
    if (!mapRef.current) return;

    // Animate to new center
    mapRef.current.flyTo(center, zoom, {
      duration: 0.8,
    });

    // Clear existing route layers
    routeLayersRef.current.forEach(layer => {
      if (mapRef.current) {
        mapRef.current.removeLayer(layer);
      }
    });
    routeLayersRef.current = [];

    // Add new routes with glow effect
    routes.forEach((route) => {
      // Outer glow layer (wider, semi-transparent)
      const glowLayer = L.polyline(route, {
        color: "#FFD700",
        weight: 20,
        opacity: 0.3,
        lineCap: "round",
        lineJoin: "round",
      });

      // Middle glow layer
      const midGlowLayer = L.polyline(route, {
        color: "#FFD700",
        weight: 14,
        opacity: 0.5,
        lineCap: "round",
        lineJoin: "round",
      });

      // Core route layer (bright, solid)
      const coreLayer = L.polyline(route, {
        color: "#FFD700",
        weight: 8,
        opacity: 1,
        lineCap: "round",
        lineJoin: "round",
      });

      if (mapRef.current) {
        glowLayer.addTo(mapRef.current);
        midGlowLayer.addTo(mapRef.current);
        coreLayer.addTo(mapRef.current);
        routeLayersRef.current.push(glowLayer, midGlowLayer, coreLayer);
      }
    });

    // Add marker at center of first route
    if (routes.length > 0 && routes[0].length > 0) {
      const midIndex = Math.floor(routes[0].length / 2);
      const markerPos = routes[0][midIndex];

      // Custom white pin marker
      const pinIcon = L.divIcon({
        className: "custom-pin",
        html: `
          <svg width="32" height="42" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.4"/>
            </filter>
            <path d="M16 0C7.2 0 0 7.2 0 16c0 12 16 26 16 26s16-14 16-26c0-8.8-7.2-16-16-16z" fill="white" filter="url(#shadow)"/>
            <circle cx="16" cy="16" r="6" fill="#0f2d2d"/>
          </svg>
        `,
        iconSize: [32, 42],
        iconAnchor: [16, 42],
      });

      const marker = L.marker(markerPos, { icon: pinIcon });
      if (mapRef.current) {
        marker.addTo(mapRef.current);
        routeLayersRef.current.push(marker as unknown as L.Polyline);
      }
    }
  }, [center, zoom, routes, activeLocation]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ background: "#0a2020" }}
    />
  );
}
