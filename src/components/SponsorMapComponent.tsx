"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { FoodPartner } from "@/lib/food-partner-types";
import type { ShopPartner } from "@/lib/shop-partner-types";
import type { PartnerTier } from "@/lib/food-partner-types";

// Combined sponsor type for the map
export type MapSponsor = {
  id: string;
  name: string;
  type: "food" | "shop";
  tier: PartnerTier;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  description: string | null;
  logo_url: string | null;
  category: string;
  categoryLabel: string;
  special?: string | null;
  specialPrice?: string | null;
};

interface SponsorMapComponentProps {
  sponsors: MapSponsor[];
  center?: [number, number];
  zoom?: number;
  onSponsorClick?: (sponsor: MapSponsor) => void;
  showRoutes?: boolean;
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

// Custom marker SVGs per tier - cartoon style with different sizes
const createMarkerIcon = (tier: PartnerTier, type: "food" | "shop") => {
  const configs = {
    premium: {
      size: 56,
      color: "#FFD700", // Gold
      bgColor: "#FFF8DC",
      borderColor: "#B8860B",
      icon: "👑",
      shadowSize: 8,
    },
    partner_plus: {
      size: 44,
      color: "#14B8A6", // Teal
      bgColor: "#CCFBF1",
      borderColor: "#0D9488",
      icon: "⭐",
      shadowSize: 6,
    },
    partner: {
      size: 36,
      color: "#6366F1", // Indigo
      bgColor: "#E0E7FF",
      borderColor: "#4F46E5",
      icon: type === "food" ? "🍽️" : "🛍️",
      shadowSize: 4,
    },
    free: {
      size: 28,
      color: "#9CA3AF", // Gray
      bgColor: "#F3F4F6",
      borderColor: "#6B7280",
      icon: type === "food" ? "🍴" : "🏪",
      shadowSize: 3,
    },
  };

  const config = configs[tier];
  const { size, color, bgColor, borderColor, icon, shadowSize } = config;

  return L.divIcon({
    className: "custom-sponsor-marker",
    html: `
      <div class="sponsor-marker-wrapper" style="
        width: ${size}px;
        height: ${size + 12}px;
        position: relative;
        cursor: pointer;
        filter: drop-shadow(0 ${shadowSize}px ${shadowSize * 1.5}px rgba(0,0,0,0.3));
        transition: transform 0.2s ease, filter 0.2s ease;
      ">
        <svg width="${size}" height="${size + 12}" viewBox="0 0 ${size} ${size + 12}" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Pin shape -->
          <path d="
            M${size / 2} ${size + 10}
            C${size / 2} ${size + 10} ${size * 0.15} ${size * 0.7} ${size * 0.15} ${size * 0.45}
            C${size * 0.15} ${size * 0.2} ${size * 0.3} 2 ${size / 2} 2
            C${size * 0.7} 2 ${size * 0.85} ${size * 0.2} ${size * 0.85} ${size * 0.45}
            C${size * 0.85} ${size * 0.7} ${size / 2} ${size + 10} ${size / 2} ${size + 10}
            Z
          " fill="${bgColor}" stroke="${borderColor}" stroke-width="3"/>
          <!-- Inner circle -->
          <circle cx="${size / 2}" cy="${size * 0.42}" r="${size * 0.3}" fill="${color}" opacity="0.2"/>
          <!-- Decorative ring -->
          <circle cx="${size / 2}" cy="${size * 0.42}" r="${size * 0.25}" fill="none" stroke="${color}" stroke-width="2" stroke-dasharray="${tier === 'premium' ? '0' : tier === 'partner_plus' ? '4 2' : '0'}"/>
        </svg>
        <!-- Emoji icon -->
        <div style="
          position: absolute;
          top: ${size * 0.18}px;
          left: 50%;
          transform: translateX(-50%);
          font-size: ${size * 0.4}px;
          line-height: 1;
          text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        ">${icon}</div>
        ${tier === 'premium' ? `
          <!-- Sparkle effect for premium -->
          <div style="
            position: absolute;
            top: -4px;
            right: -4px;
            font-size: 14px;
            animation: sparkle 1.5s ease-in-out infinite;
          ">✨</div>
        ` : ''}
      </div>
    `,
    iconSize: [size, size + 12],
    iconAnchor: [size / 2, size + 12],
    popupAnchor: [0, -size],
  });
};

// Create popup content
const createPopupContent = (sponsor: MapSponsor) => {
  const tierLabels: Record<PartnerTier, { label: string; color: string; bg: string }> = {
    premium: { label: "Premium Sponsor", color: "#92400E", bg: "#FEF3C7" },
    partner_plus: { label: "Uitgelicht", color: "#0F766E", bg: "#CCFBF1" },
    partner: { label: "Partner", color: "#4338CA", bg: "#E0E7FF" },
    free: { label: "", color: "", bg: "" },
  };

  const tierInfo = tierLabels[sponsor.tier];

  return `
    <div class="sponsor-popup" style="
      min-width: 240px;
      max-width: 300px;
      font-family: system-ui, -apple-system, sans-serif;
    ">
      ${sponsor.logo_url ? `
        <div style="
          width: 100%;
          height: 100px;
          background-image: url('${sponsor.logo_url}');
          background-size: cover;
          background-position: center;
          border-radius: 8px 8px 0 0;
          margin: -14px -14px 12px -14px;
          width: calc(100% + 28px);
        "></div>
      ` : ''}

      <div style="padding: 0 2px;">
        ${tierInfo.label ? `
          <span style="
            display: inline-block;
            padding: 3px 10px;
            border-radius: 100px;
            font-size: 11px;
            font-weight: 600;
            background: ${tierInfo.bg};
            color: ${tierInfo.color};
            margin-bottom: 8px;
          ">${tierInfo.label}</span>
        ` : ''}

        <h3 style="
          margin: 0 0 4px 0;
          font-size: 16px;
          font-weight: 700;
          color: #1F2937;
        ">${sponsor.name}</h3>

        <p style="
          margin: 0 0 8px 0;
          font-size: 12px;
          color: #6B7280;
          display: flex;
          align-items: center;
          gap: 4px;
        ">
          <span style="font-size: 14px;">${sponsor.type === 'food' ? '🍽️' : '🛍️'}</span>
          ${sponsor.categoryLabel}
        </p>

        ${sponsor.description ? `
          <p style="
            margin: 0 0 10px 0;
            font-size: 13px;
            color: #4B5563;
            line-height: 1.4;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          ">${sponsor.description}</p>
        ` : ''}

        ${sponsor.special ? `
          <div style="
            background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
            border-radius: 6px;
            padding: 8px 10px;
            margin-bottom: 10px;
          ">
            <p style="
              margin: 0;
              font-size: 12px;
              color: #92400E;
              font-weight: 500;
            ">🌙 ${sponsor.special}</p>
            ${sponsor.specialPrice ? `
              <p style="
                margin: 4px 0 0 0;
                font-size: 11px;
                color: #A16207;
              ">${sponsor.specialPrice}</p>
            ` : ''}
          </div>
        ` : ''}

        <p style="
          margin: 0;
          font-size: 11px;
          color: #9CA3AF;
          display: flex;
          align-items: center;
          gap: 4px;
        ">
          📍 ${sponsor.address}, ${sponsor.city}
        </p>
      </div>
    </div>
  `;
};

export default function SponsorMapComponent({
  sponsors,
  center = [51.055, 3.715],
  zoom = 14,
  onSponsorClick,
  showRoutes = true,
}: SponsorMapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const routeLayersRef = useRef<L.Polyline[]>([]);
  const [activePopup, setActivePopup] = useState<string | null>(null);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = L.map(containerRef.current, {
      center: center,
      zoom: zoom,
      zoomControl: false,
      attributionControl: false,
    });

    // Gestileerde cartoon-achtige tiles (Stamen Watercolor style via Stadia)
    // Using CartoDB Voyager for a clean, illustrated look
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
    }).addTo(mapRef.current);

    // Add zoom control to bottom right
    L.control.zoom({ position: "bottomright" }).addTo(mapRef.current);

    // Add custom CSS for animations
    const style = document.createElement("style");
    style.textContent = `
      @keyframes sparkle {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.5; transform: scale(1.2); }
      }

      .sponsor-marker-wrapper:hover {
        transform: scale(1.15) translateY(-4px) !important;
        filter: drop-shadow(0 12px 20px rgba(0,0,0,0.4)) !important;
      }

      .leaflet-popup-content-wrapper {
        border-radius: 12px !important;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2) !important;
        padding: 0 !important;
      }

      .leaflet-popup-content {
        margin: 14px !important;
      }

      .leaflet-popup-tip {
        box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
      }

      .custom-sponsor-marker {
        background: transparent !important;
        border: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      style.remove();
    };
  }, []);

  // Add routes with glow effect
  useEffect(() => {
    if (!mapRef.current || !showRoutes) return;

    // Clear existing routes
    routeLayersRef.current.forEach(layer => {
      mapRef.current?.removeLayer(layer);
    });
    routeLayersRef.current = [];

    // Add both routes
    [routes.wondelgemstraat, routes.bevrijdingslaanPhoenix].forEach((route) => {
      // Outer glow
      const glowLayer = L.polyline(route, {
        color: "#FFD700",
        weight: 16,
        opacity: 0.25,
        lineCap: "round",
        lineJoin: "round",
      });

      // Middle glow
      const midGlowLayer = L.polyline(route, {
        color: "#FFD700",
        weight: 10,
        opacity: 0.4,
        lineCap: "round",
        lineJoin: "round",
      });

      // Core line
      const coreLayer = L.polyline(route, {
        color: "#FFD700",
        weight: 5,
        opacity: 0.9,
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
  }, [showRoutes]);

  // Add sponsor markers
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Sort sponsors by tier (free first so premium renders on top)
    const tierOrder: Record<PartnerTier, number> = {
      free: 0,
      partner: 1,
      partner_plus: 2,
      premium: 3,
    };

    const sortedSponsors = [...sponsors].sort(
      (a, b) => tierOrder[a.tier] - tierOrder[b.tier]
    );

    // Add markers for each sponsor
    sortedSponsors.forEach((sponsor) => {
      if (!sponsor.latitude || !sponsor.longitude) return;

      const icon = createMarkerIcon(sponsor.tier, sponsor.type);
      const marker = L.marker([sponsor.latitude, sponsor.longitude], {
        icon,
        zIndexOffset: tierOrder[sponsor.tier] * 100,
      });

      // Create popup
      const popup = L.popup({
        closeButton: true,
        className: "sponsor-popup-container",
        maxWidth: 320,
        offset: [0, -10],
      }).setContent(createPopupContent(sponsor));

      marker.bindPopup(popup);

      // Events
      marker.on("mouseover", () => {
        marker.openPopup();
      });

      marker.on("click", () => {
        setActivePopup(sponsor.id);
        if (onSponsorClick) {
          onSponsorClick(sponsor);
        }
      });

      if (mapRef.current) {
        marker.addTo(mapRef.current);
        markersRef.current.push(marker);
      }
    });
  }, [sponsors, onSponsorClick]);

  // Update center/zoom when props change
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.flyTo(center, zoom, { duration: 0.5 });
    }
  }, [center, zoom]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      <div
        ref={containerRef}
        className="w-full h-full"
        style={{ background: "#f8f4f0" }}
      />

      {/* Legend */}
      <div className="absolute bottom-20 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg z-[1000]">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Legenda</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-xl">👑</span>
            <span className="text-sm text-gray-700">Premium Sponsor</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xl">⭐</span>
            <span className="text-sm text-gray-700">Partner Plus</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xl">🍽️</span>
            <span className="text-sm text-gray-700">Food Partner</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xl">🛍️</span>
            <span className="text-sm text-gray-700">Shop Partner</span>
          </div>
          <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
            <div className="w-5 h-1 bg-yellow-400 rounded-full"></div>
            <span className="text-sm text-gray-700">Verlichtingsroute</span>
          </div>
        </div>
      </div>
    </div>
  );
}
