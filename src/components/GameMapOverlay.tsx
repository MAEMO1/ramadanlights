"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { FoodPartner } from "@/lib/food-partner-types";
import type { ShopPartner } from "@/lib/shop-partner-types";
import type { PartnerTier } from "@/lib/food-partner-types";
import { categoryLabels } from "@/lib/food-partner-types";
import { shopCategoryLabels } from "@/lib/shop-partner-types";

interface Mosque {
  id: string;
  name: string;
  address: string;
  city: string;
  fullAddress?: string;
  latitude: number | null;
  longitude: number | null;
}

interface GameMapOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  foodPartners: FoodPartner[];
  shopPartners: ShopPartner[];
  mosques?: Mosque[];
}

// Verlichtingsroutes
const routes = {
  wondelgemstraat: [
    [51.065315, 3.7091596], [51.0652518, 3.7091844], [51.0651888, 3.7092075],
    [51.0646444, 3.7093865], [51.0645619, 3.7094108], [51.0641119, 3.7095433],
    [51.0640764, 3.7095529], [51.0640287, 3.7095657], [51.0639635, 3.7095847],
    [51.0637095, 3.709659], [51.0631598, 3.7098197], [51.0630933, 3.7098391],
    [51.0629157, 3.7098973], [51.0628625, 3.7099147], [51.0628113, 3.7099319],
    [51.0626315, 3.7099923], [51.0625436, 3.7100195], [51.0616656, 3.71028],
    [51.0615748, 3.7102994], [51.0612, 3.7104], [51.0608, 3.7105],
    [51.0604, 3.7106], [51.0600, 3.7107], [51.0596, 3.7108]
  ] as [number, number][],
  bevrijdingslaanPhoenix: [
    [51.0577376, 3.7071108], [51.0577646, 3.7069207], [51.0578048, 3.7067926],
    [51.0580774, 3.7060366], [51.0583278, 3.7053053], [51.0585255, 3.7048679],
    [51.0589024, 3.7043079], [51.05925, 3.7038], [51.05955, 3.7033782],
    [51.0605, 3.702], [51.0615, 3.7005], [51.0625, 3.699], [51.0634869, 3.6959922]
  ] as [number, number][],
};

// Check if a point is near a route and offset it to the side
const ROUTE_PROXIMITY_THRESHOLD = 0.0015; // ~150m in degrees
const OFFSET_DISTANCE = 0.0008; // ~80m offset to the side

function isNearRoute(lat: number, lng: number): boolean {
  const allRoutePoints = [...routes.wondelgemstraat, ...routes.bevrijdingslaanPhoenix];
  for (const [routeLat, routeLng] of allRoutePoints) {
    const distance = Math.sqrt(Math.pow(lat - routeLat, 2) + Math.pow(lng - routeLng, 2));
    if (distance < ROUTE_PROXIMITY_THRESHOLD) {
      return true;
    }
  }
  return false;
}

function offsetMarkerPosition(lat: number, lng: number, index: number): [number, number] {
  if (!isNearRoute(lat, lng)) {
    return [lat, lng];
  }

  // Offset markers to the side of the route
  // Alternate left/right based on index to spread them out
  const direction = index % 2 === 0 ? 1 : -1;
  const offsetLng = lng + (OFFSET_DISTANCE * direction);
  // Add slight lat variation based on index to prevent stacking
  const offsetLat = lat + ((index % 5) * 0.0002 - 0.0004);

  return [offsetLat, offsetLng];
}

// Professional 2D SVG icons for each category
const categoryIcons: Record<string, string> = {
  // Food categories - Professional restaurant/food icons
  restaurant: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>`,
  bakery: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.5 2 5 4 5 8c0 2.5 1.5 4 3 5v9h8v-9c1.5-1 3-2.5 3-5 0-4-3.5-6-7-6zm-1 16h2v-2h-2v2zm0-4h2v-2h-2v2z"/><path d="M12 4c2.5 0 4.5 1.5 4.5 4 0 1.5-1 2.5-2 3.5-.5.5-1 1-1 1.5h-3c0-.5-.5-1-1-1.5-1-1-2-2-2-3.5 0-2.5 2-4 4.5-4z" opacity="0.3"/></svg>`,
  butcher: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.06 3.64c-1.17-1.17-3.07-1.17-4.24 0l-2.12 2.12 4.24 4.24 2.12-2.12c1.17-1.17 1.17-3.07 0-4.24zM7.59 7.59L2 22l14.41-5.59L7.59 7.59zm5.65 5.65l-2.83 2.83 4.24 4.24 2.83-2.83-4.24-4.24z"/></svg>`,
  supermarket: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>`,
  catering: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/></svg>`,
  cafe: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z"/></svg>`,

  // Shop categories - Professional retail icons
  decor: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>`,
  clothing: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.6 18.2L13 11.75v-.91c1.65-.49 2.8-2.17 2.43-4.05-.26-1.31-1.3-2.4-2.61-2.7C10.54 3.57 8.5 5.3 8.5 7.5h2c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5c0 .84-.69 1.52-1.53 1.5-.54-.01-.97.45-.97.99v1.76L2.4 18.2c-.77.58-.36 1.8.6 1.8h18c.96 0 1.37-1.22.6-1.8zM6 18l6-4.5 6 4.5H6z"/></svg>`,
  spiritual: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm-1.06 13.54L7.4 12l1.41-1.41 2.12 2.12 4.24-4.24 1.41 1.41-5.64 5.66z"/></svg>`,
  gifts: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/></svg>`,
  beauty: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c-5.33 4-8 8-8 12 0 4.42 3.58 8 8 8s8-3.58 8-8c0-4-2.67-8-8-12zm0 18c-3.31 0-6-2.69-6-6 0-2.97 1.8-5.94 4.5-9.33.4-.5 1.2-.5 1.6 0C14.2 8.06 16 11.03 16 14c0 3.31-2.69 6-6 6z"/></svg>`,
  kids: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/></svg>`,
  tech: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/></svg>`,
  other: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z"/></svg>`,

  // Mosque icon
  mosque: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C9.24 2 7 3.51 7 6v1H5v2h1v10H3v2h18v-2h-3V9h1V7h-2V6c0-2.49-2.24-4-5-4zm-3 7h2v4H9V9zm4 0h2v4h-2V9zm-3 6v4H8v-4h2zm4 0v4h-2v-4h2zm4 0v4h-2v-4h2z"/><path d="M12 3c1.66 0 3 .9 3 2v1H9V5c0-1.1 1.34-2 3-2z" opacity="0.6"/></svg>`,
};

// Size configurations based on tier
const tierSizes: Record<PartnerTier | "mosque", { size: number; zIndex: number; pulse: boolean }> = {
  premium: { size: 56, zIndex: 1000, pulse: true },
  partner_plus: { size: 44, zIndex: 500, pulse: false },
  partner: { size: 34, zIndex: 100, pulse: false },
  free: { size: 26, zIndex: 50, pulse: false },
  mosque: { size: 48, zIndex: 800, pulse: true },
};

// Color configurations
const tierColors: Record<PartnerTier | "mosque", { bg: string; border: string; glow: string; icon: string }> = {
  premium: { bg: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)", border: "#FFD700", glow: "rgba(255, 215, 0, 0.5)", icon: "#FFD700" },
  partner_plus: { bg: "linear-gradient(135deg, #0f2d2d 0%, #1a4a4a 100%)", border: "#14B8A6", glow: "rgba(20, 184, 166, 0.4)", icon: "#5EEAD4" },
  partner: { bg: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)", border: "#8B5CF6", glow: "rgba(139, 92, 246, 0.3)", icon: "#A78BFA" },
  free: { bg: "linear-gradient(135deg, #1f2937 0%, #374151 100%)", border: "#6B7280", glow: "rgba(107, 114, 128, 0.2)", icon: "#9CA3AF" },
  mosque: { bg: "linear-gradient(135deg, #064e3b 0%, #065f46 100%)", border: "#10B981", glow: "rgba(16, 185, 129, 0.5)", icon: "#34D399" },
};

// Create professional game-style marker
const createGameMarker = (
  category: string,
  tier: PartnerTier | "mosque"
) => {
  const config = tierSizes[tier];
  const colors = tierColors[tier];
  const iconSvg = categoryIcons[category] || categoryIcons.other;
  const size = config.size;
  const iconSize = Math.round(size * 0.5);

  const pulseKeyframes = config.pulse ? `
    @keyframes marker-pulse-${tier} {
      0%, 100% {
        box-shadow: 0 0 0 0 ${colors.glow}, 0 4px 12px ${colors.glow};
        transform: scale(1);
      }
      50% {
        box-shadow: 0 0 0 6px transparent, 0 6px 20px ${colors.glow};
        transform: scale(1.05);
      }
    }
  ` : "";

  const html = `
    <style>${pulseKeyframes}</style>
    <div class="game-marker-icon" style="
      width: ${size}px;
      height: ${size}px;
      position: relative;
      cursor: pointer;
    ">
      <div style="
        width: 100%;
        height: 100%;
        background: ${colors.bg};
        border: 3px solid ${colors.border};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        ${config.pulse ? `animation: marker-pulse-${tier} 2s ease-in-out infinite;` : `box-shadow: 0 4px 12px ${colors.glow};`}
        transition: transform 0.2s ease;
      ">
        <div style="width: ${iconSize}px; height: ${iconSize}px; color: ${colors.icon};">
          ${iconSvg}
        </div>
      </div>
      ${tier === "premium" ? `
        <div style="
          position: absolute;
          top: -6px;
          right: -6px;
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(255, 215, 0, 0.6);
        ">
          <svg viewBox="0 0 24 24" fill="#1a1a2e" style="width: 12px; height: 12px;">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
      ` : ""}
      ${tier === "mosque" ? `
        <div style="
          position: absolute;
          top: -4px;
          right: -4px;
          width: 16px;
          height: 16px;
          background: linear-gradient(135deg, #10B981 0%, #059669 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(16, 185, 129, 0.6);
        ">
          <svg viewBox="0 0 24 24" fill="white" style="width: 10px; height: 10px;">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
        </div>
      ` : ""}
    </div>
  `;

  return L.divIcon({
    className: "game-marker-container",
    html,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

// Popup content
const createPopupContent = (
  name: string,
  category: string,
  categoryLabel: string,
  address: string,
  description: string | null,
  tier: PartnerTier | "mosque"
) => {
  const colors = tierColors[tier];
  const tierLabels: Record<PartnerTier | "mosque", string> = {
    premium: "Premium Sponsor",
    partner_plus: "Uitgelicht",
    partner: "Partner",
    free: "",
    mosque: "Moskee",
  };
  const tierLabel = tierLabels[tier];

  return `
    <div style="
      background: linear-gradient(135deg, #0f2d2d 0%, #1a3a3a 100%);
      color: white;
      padding: 16px;
      border-radius: 16px;
      min-width: 220px;
      max-width: 280px;
      font-family: system-ui, -apple-system, sans-serif;
      margin: -14px;
      border: 1px solid rgba(255,255,255,0.1);
      box-shadow: 0 10px 40px rgba(0,0,0,0.4);
    ">
      ${tierLabel ? `
        <span style="
          display: inline-block;
          padding: 4px 12px;
          background: ${tier === "premium" ? "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)" : tier === "mosque" ? "linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)" : "linear-gradient(135deg, #CCFBF1 0%, #99F6E4 100%)"};
          color: ${tier === "premium" ? "#92400E" : tier === "mosque" ? "#065F46" : "#0F766E"};
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        ">${tierLabel}</span>
      ` : ""}

      <h3 style="margin: 0 0 8px 0; font-size: 17px; font-weight: 700;">${name}</h3>

      <p style="margin: 0 0 12px 0; font-size: 13px; color: rgba(255,255,255,0.6); display: flex; align-items: center; gap: 6px;">
        <span style="width: 16px; height: 16px; color: ${colors.icon}; display: inline-flex;">${categoryIcons[category] || categoryIcons.other}</span>
        ${categoryLabel}
      </p>

      ${description ? `
        <p style="margin: 0 0 12px 0; font-size: 13px; color: rgba(255,255,255,0.8); line-height: 1.5;">
          ${description.slice(0, 100)}${description.length > 100 ? "..." : ""}
        </p>
      ` : ""}

      <p style="margin: 0; font-size: 12px; color: rgba(255,255,255,0.5); display: flex; align-items: center; gap: 6px;">
        <svg viewBox="0 0 24 24" fill="currentColor" style="width: 14px; height: 14px;"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
        ${address}
      </p>
    </div>
  `;
};

export function GameMapOverlay({ isOpen, onClose, foodPartners, shopPartners, mosques = [] }: GameMapOverlayProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const routeLayersRef = useRef<L.Polyline[]>([]);
  const [mapReady, setMapReady] = useState(false);

  // Initialize map when overlay opens
  useEffect(() => {
    if (!isOpen || !containerRef.current || mapRef.current) return;

    const timer = setTimeout(() => {
      if (!containerRef.current) return;

      mapRef.current = L.map(containerRef.current, {
        center: [51.055, 3.715],
        zoom: 14,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
      }).addTo(mapRef.current);

      L.control.zoom({ position: "bottomright" }).addTo(mapRef.current);

      setMapReady(true);
    }, 800);

    return () => clearTimeout(timer);
  }, [isOpen]);

  // Cleanup map when closing
  useEffect(() => {
    if (!isOpen && mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
      setMapReady(false);
    }
  }, [isOpen]);

  // Add routes
  useEffect(() => {
    if (!mapRef.current || !mapReady) return;

    routeLayersRef.current.forEach(layer => mapRef.current?.removeLayer(layer));
    routeLayersRef.current = [];

    [routes.wondelgemstraat, routes.bevrijdingslaanPhoenix].forEach((route) => {
      const layers = [
        L.polyline(route, { color: "#FFD700", weight: 16, opacity: 0.15, lineCap: "round", lineJoin: "round" }),
        L.polyline(route, { color: "#FFD700", weight: 10, opacity: 0.3, lineCap: "round", lineJoin: "round" }),
        L.polyline(route, { color: "#FFD700", weight: 5, opacity: 0.6, lineCap: "round", lineJoin: "round" }),
        L.polyline(route, { color: "#FFFACD", weight: 2, opacity: 1, lineCap: "round", lineJoin: "round" }),
      ];

      layers.forEach(layer => {
        if (mapRef.current) {
          layer.addTo(mapRef.current);
          routeLayersRef.current.push(layer);
        }
      });
    });
  }, [mapReady]);

  // Add markers
  useEffect(() => {
    if (!mapRef.current || !mapReady) return;

    markersRef.current.forEach(marker => mapRef.current?.removeLayer(marker));
    markersRef.current = [];

    // Combine all markers
    const allMarkers: Array<{
      id: string;
      name: string;
      category: string;
      categoryLabel: string;
      tier: PartnerTier | "mosque";
      lat: number;
      lng: number;
      address: string;
      description: string | null;
    }> = [];

    // Add food partners
    foodPartners.forEach(p => {
      if (p.latitude && p.longitude && p.partner_tier !== "free") {
        allMarkers.push({
          id: p.id,
          name: p.name,
          category: p.category,
          categoryLabel: categoryLabels[p.category],
          tier: p.partner_tier,
          lat: p.latitude,
          lng: p.longitude,
          address: `${p.address}, ${p.city}`,
          description: p.description,
        });
      }
    });

    // Add shop partners
    shopPartners.forEach(p => {
      if (p.latitude && p.longitude && p.partner_tier !== "free") {
        allMarkers.push({
          id: p.id,
          name: p.name,
          category: p.category,
          categoryLabel: shopCategoryLabels[p.category],
          tier: p.partner_tier,
          lat: p.latitude,
          lng: p.longitude,
          address: `${p.address}, ${p.city}`,
          description: p.description,
        });
      }
    });

    // Add mosques
    mosques.forEach(m => {
      if (m.latitude && m.longitude) {
        allMarkers.push({
          id: m.id,
          name: m.name,
          category: "mosque",
          categoryLabel: "Moskee",
          tier: "mosque",
          lat: m.latitude,
          lng: m.longitude,
          address: m.fullAddress || `${m.address}, ${m.city}`,
          description: null,
        });
      }
    });

    // Sort by tier (smallest first so biggest renders on top)
    const tierOrder: Record<PartnerTier | "mosque", number> = { free: 0, partner: 1, partner_plus: 2, mosque: 3, premium: 4 };
    allMarkers.sort((a, b) => tierOrder[a.tier] - tierOrder[b.tier]);

    // Add markers with offset for those near illuminated streets
    allMarkers.forEach((item, index) => {
      const icon = createGameMarker(item.category, item.tier);
      const [offsetLat, offsetLng] = offsetMarkerPosition(item.lat, item.lng, index);
      const marker = L.marker([offsetLat, offsetLng], {
        icon,
        zIndexOffset: tierSizes[item.tier].zIndex,
      });

      const popup = L.popup({
        closeButton: true,
        className: "game-popup",
        maxWidth: 300,
      }).setContent(createPopupContent(
        item.name,
        item.category,
        item.categoryLabel,
        item.address,
        item.description,
        item.tier
      ));

      marker.bindPopup(popup);

      if (mapRef.current) {
        marker.addTo(mapRef.current);
        markersRef.current.push(marker);
      }
    });
  }, [mapReady, foodPartners, shopPartners, mosques]);

  // Add custom styles
  useEffect(() => {
    if (!isOpen) return;

    const style = document.createElement("style");
    style.id = "game-map-styles";
    style.textContent = `
      .game-marker-container {
        background: transparent !important;
        border: none !important;
      }
      .game-marker-icon:hover > div:first-child {
        transform: scale(1.15) !important;
      }
      .leaflet-popup-content-wrapper {
        background: transparent !important;
        box-shadow: none !important;
        padding: 0 !important;
        border-radius: 16px !important;
      }
      .leaflet-popup-content {
        margin: 0 !important;
      }
      .leaflet-popup-tip-container {
        display: none !important;
      }
      .leaflet-popup-close-button {
        color: white !important;
        font-size: 20px !important;
        top: 10px !important;
        right: 10px !important;
        opacity: 0.7;
      }
      .leaflet-popup-close-button:hover {
        opacity: 1;
      }
    `;
    document.head.appendChild(style);

    return () => {
      const existingStyle = document.getElementById("game-map-styles");
      if (existingStyle) existingStyle.remove();
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Curtain Reveal Animation - Left Panel */}
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: "-100%" }}
            exit={{ x: 0 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-y-0 left-0 w-1/2 bg-[#0f2d2d] z-[9998]"
          >
            <div className="absolute inset-0 flex items-center justify-end pr-8">
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="text-white text-4xl font-display font-bold"
              >
                Ramadan
              </motion.div>
            </div>
          </motion.div>

          {/* Curtain Reveal Animation - Right Panel */}
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: "100%" }}
            exit={{ x: 0 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-y-0 right-0 w-1/2 bg-[#0f2d2d] z-[9998]"
          >
            <div className="absolute inset-0 flex items-center justify-start pl-8">
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="text-gold text-4xl font-display font-bold"
              >
                Lights
              </motion.div>
            </div>
          </motion.div>

          {/* Map Container */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="fixed inset-0 bg-[#0a1a1a] z-[9997]"
          >
            <div ref={containerRef} className="w-full h-full" />

            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.3 }}
              onClick={onClose}
              className="absolute top-6 right-6 z-[9999] w-12 h-12 bg-[#0f2d2d] border-2 border-white/20 rounded-full flex items-center justify-center text-white hover:bg-[#1a4a4a] hover:border-white/40 transition-all shadow-2xl"
            >
              <X className="w-5 h-5" />
            </motion.button>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="absolute top-6 left-6 z-[9999]"
            >
              <div className="bg-[#0f2d2d]/90 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-3 shadow-2xl">
                <h2 className="text-white font-display font-bold text-lg">Ramadan Lights Kaart</h2>
                <p className="text-white/60 text-sm">Moskeeën, restaurants & winkels in Gent</p>
              </div>
            </motion.div>

            {/* Legend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              className="absolute bottom-6 left-6 z-[9999]"
            >
              <div className="bg-[#0f2d2d]/90 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-8 h-1.5 rounded-full bg-gradient-to-r from-[#FFD700]/40 via-[#FFD700] to-[#FFD700]/40" style={{ boxShadow: '0 0 8px #FFD700, 0 0 16px #FFD700' }} />
                  <span className="text-white/80 font-medium">Verlichte straten</span>
                </div>
              </div>
            </motion.div>

            {/* Loading indicator */}
            {!mapReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#0a1a1a]">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-white/60">Kaart laden...</p>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
