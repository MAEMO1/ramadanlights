"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { type IftarLocation, formatFrequencyDisplay } from "@/lib/iftar-types";

export type { IftarLocation };

interface IftarMapComponentProps {
  locations: IftarLocation[];
  center?: [number, number];
  zoom?: number;
}

export default function IftarMapComponent({
  locations,
  center = [51.0543, 3.7174], // Gent centrum
  zoom = 13,
}: IftarMapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map
    mapRef.current = L.map(mapContainerRef.current, {
      center,
      zoom,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    // Add dark tile layer
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }
    ).addTo(mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update markers when locations change
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add new markers
    locations.forEach((location) => {
      if (location.latitude && location.longitude) {
        // Custom gold marker icon for iftar locations
        const markerIcon = L.divIcon({
          className: "custom-iftar-marker",
          html: `
            <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 24 16 24s16-12 16-24c0-8.837-7.163-16-16-16z" fill="#FFD700"/>
              <circle cx="16" cy="16" r="8" fill="#0f2d2d"/>
              <path d="M16 10c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2s2-.9 2-2v-4c0-1.1-.9-2-2-2z" fill="#FFD700"/>
              <circle cx="16" cy="20" r="1.5" fill="#FFD700"/>
            </svg>
          `,
          iconSize: [32, 40],
          iconAnchor: [16, 40],
          popupAnchor: [0, -40],
        });

        const marker = L.marker([location.latitude, location.longitude], {
          icon: markerIcon,
        });

        // Create popup content
        const accessibilityTags = [
          location.for_men ? "Mannen" : "",
          location.for_women ? "Vrouwen" : "",
          location.for_families ? "Gezinnen" : "",
        ]
          .filter(Boolean)
          .join(" • ");

        const frequencyText = formatFrequencyDisplay(location.frequency, location.days_of_week || []);

        // Build links HTML
        const linksHtml = [];
        if (location.registration_url) {
          linksHtml.push(`<a href="${location.registration_url}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; background: #0f9f9f; color: white; text-decoration: none; border-radius: 12px; font-size: 11px;">Inschrijven</a>`);
        }
        if (location.website_url) {
          linksHtml.push(`<a href="${location.website_url}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; background: #f3f4f6; color: #374151; text-decoration: none; border-radius: 12px; font-size: 11px;">Website</a>`);
        }
        if (location.facebook_url) {
          linksHtml.push(`<a href="${location.facebook_url}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; background: #dbeafe; color: #1d4ed8; text-decoration: none; border-radius: 12px; font-size: 11px;">Facebook</a>`);
        }
        if (location.instagram_url) {
          linksHtml.push(`<a href="${location.instagram_url}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; background: #fce7f3; color: #be185d; text-decoration: none; border-radius: 12px; font-size: 11px;">Instagram</a>`);
        }

        const popupContent = `
          <div style="min-width: 200px; font-family: system-ui, sans-serif;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #0f2d2d;">
              ${location.mosque_name}
            </h3>
            <p style="margin: 0 0 4px 0; font-size: 13px; color: #666;">
              ${location.address}, ${location.city}
            </p>
            <p style="margin: 0 0 4px 0; font-size: 14px; font-weight: 500; color: #0f2d2d;">
              Iftar: ${location.iftar_time}
            </p>
            <p style="margin: 0 0 8px 0; font-size: 12px; color: #0f9f9f; font-weight: 500;">
              ${frequencyText}
            </p>
            ${location.capacity ? `<p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">Capaciteit: ${location.capacity} personen</p>` : ""}
            <p style="margin: 0 0 4px 0; font-size: 12px; color: ${location.is_free ? "#10b981" : "#666"};">
              ${location.is_free ? "Gratis" : location.price_info || "Betaald"}
            </p>
            ${accessibilityTags ? `<p style="margin: 8px 0 0 0; font-size: 11px; color: #888; border-top: 1px solid #eee; padding-top: 8px;">${accessibilityTags}</p>` : ""}
            ${linksHtml.length > 0 ? `<div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee;">${linksHtml.join("")}</div>` : ""}
          </div>
        `;

        marker.bindPopup(popupContent, {
          closeButton: true,
          className: "iftar-popup",
        });

        marker.addTo(mapRef.current!);
        markersRef.current.push(marker);
      }
    });

    // Fit bounds to show all markers if there are any
    if (markersRef.current.length > 0) {
      const group = L.featureGroup(markersRef.current);
      mapRef.current.fitBounds(group.getBounds().pad(0.1));
    }
  }, [locations]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-full rounded-2xl"
      style={{ minHeight: "400px" }}
    />
  );
}
