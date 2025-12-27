"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { PartnerTier } from "@/lib/food-partner-types";
import { getCategoryIconSvg } from "@/lib/map-icons";

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
  selectedSponsorId?: string | null;
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

// Beautiful cartoon-style marker SVGs
const createMarkerSVG = (tier: PartnerTier, type: "food" | "shop", isSelected: boolean) => {
  const scale = isSelected ? 1.3 : 1;

  const configs = {
    premium: {
      width: Math.round(48 * scale),
      height: Math.round(60 * scale),
      mainColor: "#FFD700",
      glowColor: "#FFA500",
    },
    partner_plus: {
      width: Math.round(42 * scale),
      height: Math.round(52 * scale),
      mainColor: "#14B8A6",
      glowColor: "#0D9488",
    },
    partner: {
      width: Math.round(36 * scale),
      height: Math.round(44 * scale),
      mainColor: "#8B5CF6",
      glowColor: "#7C3AED",
    },
    free: {
      width: Math.round(30 * scale),
      height: Math.round(38 * scale),
      mainColor: "#6B7280",
      glowColor: "#4B5563",
    },
  };

  const config = configs[tier];
  const { mainColor, glowColor } = config;

  // Icon based on tier and type - using Tabler icons
  // Determine which icon to use based on tier priority, then type
  let iconCategory = type === "food" ? "restaurant" : "decor";
  if (tier === "premium") {
    iconCategory = "mosque"; // Crown/star for premium - using mosque as it's prominent
  } else if (tier === "partner_plus") {
    iconCategory = type === "food" ? "catering" : "gifts";
  }

  // Get Tabler icon SVG (just the inner content, not full SVG wrapper)
  const tablerIcon = getCategoryIconSvg(iconCategory, "white", 16);

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="60" viewBox="0 0 48 60">
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="${isSelected ? 4 : 2}" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="pinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:${mainColor}"/>
          <stop offset="100%" style="stop-color:${glowColor}"/>
        </linearGradient>
      </defs>

      <!-- Shadow -->
      <ellipse cx="24" cy="56" rx="${isSelected ? 10 : 7}" ry="${isSelected ? 3 : 2}" fill="rgba(0,0,0,0.4)"/>

      <!-- Pin body -->
      <path d="M24 54c0 0-18-20-18-34C6 10 14 2 24 2s18 8 18 18c0 14-18 34-18 34z"
            fill="url(#pinGrad)"
            stroke="white"
            stroke-width="2.5"
            filter="url(#glow)"/>

      <!-- Inner glow circle -->
      <circle cx="24" cy="20" r="11" fill="rgba(255,255,255,0.15)"/>

      <!-- Icon - Tabler icon centered in pin -->
      <g transform="translate(16, 12)">
        ${tablerIcon}
      </g>

      ${tier === "premium" && isSelected ? `
        <!-- Animated sparkles for premium -->
        <circle cx="6" cy="10" r="2" fill="#FFF">
          <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite"/>
        </circle>
        <circle cx="42" cy="14" r="1.5" fill="#FFF">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="10" cy="35" r="1" fill="#FFF">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="0.8s" repeatCount="indefinite"/>
        </circle>
      ` : ""}
    </svg>
  `.trim();

  return svg;
};

// Create Leaflet icon
const createMarkerIcon = (tier: PartnerTier, type: "food" | "shop", isSelected: boolean) => {
  const scale = isSelected ? 1.3 : 1;
  const sizes = {
    premium: { width: 48, height: 60 },
    partner_plus: { width: 42, height: 52 },
    partner: { width: 36, height: 44 },
    free: { width: 30, height: 38 },
  };

  const size = sizes[tier];
  const width = Math.round(size.width * scale);
  const height = Math.round(size.height * scale);

  const svg = createMarkerSVG(tier, type, isSelected);
  const svgUrl = `data:image/svg+xml,${encodeURIComponent(svg)}`;

  return L.icon({
    iconUrl: svgUrl,
    iconSize: [width, height],
    iconAnchor: [width / 2, height],
    popupAnchor: [0, -height + 10],
  });
};

// Create popup content
const createPopupContent = (sponsor: MapSponsor) => {
  const tierLabels: Record<PartnerTier, { label: string; color: string; bg: string }> = {
    premium: { label: "Premium Sponsor", color: "#92400E", bg: "#FEF3C7" },
    partner_plus: { label: "Uitgelicht", color: "#0F766E", bg: "#CCFBF1" },
    partner: { label: "Partner", color: "#5B21B6", bg: "#EDE9FE" },
    free: { label: "", color: "", bg: "" },
  };

  const tierInfo = tierLabels[sponsor.tier];
  const typeEmoji = sponsor.type === "food" ? "🍽️" : "🛍️";

  return `
    <div style="
      min-width: 260px;
      max-width: 300px;
      font-family: system-ui, -apple-system, sans-serif;
      background: #0f2d2d;
      color: white;
      margin: -14px;
      padding: 16px;
      border-radius: 12px;
    ">
      ${sponsor.logo_url ? `
        <div style="
          width: calc(100% + 32px);
          height: 100px;
          margin: -16px -16px 16px -16px;
          background-image: url('${sponsor.logo_url}');
          background-size: cover;
          background-position: center;
          border-radius: 12px 12px 0 0;
        "></div>
      ` : ''}

      ${tierInfo.label ? `
        <span style="
          display: inline-block;
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 600;
          background: ${tierInfo.bg};
          color: ${tierInfo.color};
          margin-bottom: 10px;
        ">${tierInfo.label}</span>
      ` : ''}

      <h3 style="
        margin: 0 0 6px 0;
        font-size: 17px;
        font-weight: 700;
        color: white;
      ">${sponsor.name}</h3>

      <p style="
        margin: 0 0 12px 0;
        font-size: 13px;
        color: rgba(255,255,255,0.6);
        display: flex;
        align-items: center;
        gap: 6px;
      ">
        <span>${typeEmoji}</span>
        ${sponsor.categoryLabel}
      </p>

      ${sponsor.description ? `
        <p style="
          margin: 0 0 14px 0;
          font-size: 13px;
          color: rgba(255,255,255,0.8);
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        ">${sponsor.description}</p>
      ` : ''}

      ${sponsor.special ? `
        <div style="
          background: linear-gradient(135deg, rgba(255,215,0,0.2) 0%, rgba(255,165,0,0.2) 100%);
          border: 1px solid rgba(255,215,0,0.3);
          border-radius: 8px;
          padding: 10px 12px;
          margin-bottom: 14px;
        ">
          <p style="
            margin: 0;
            font-size: 12px;
            color: #FFD700;
            font-weight: 500;
          ">🌙 ${sponsor.special}</p>
          ${sponsor.specialPrice ? `
            <p style="
              margin: 4px 0 0 0;
              font-size: 11px;
              color: rgba(255,215,0,0.7);
            ">${sponsor.specialPrice}</p>
          ` : ''}
        </div>
      ` : ''}

      <p style="
        margin: 0;
        font-size: 12px;
        color: rgba(255,255,255,0.5);
        display: flex;
        align-items: center;
        gap: 6px;
      ">
        📍 ${sponsor.address}, ${sponsor.city}
      </p>
    </div>
  `;
};

export default function SponsorMapComponent({
  sponsors,
  center = [51.055, 3.715],
  zoom = 14,
  onSponsorClick,
  showRoutes = true,
  selectedSponsorId,
}: SponsorMapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const routeLayersRef = useRef<L.Polyline[]>([]);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = L.map(containerRef.current, {
      center: center,
      zoom: zoom,
      zoomControl: false,
      attributionControl: false,
    });

    // Dark theme tiles (CartoDB Dark Matter) - like the mosque map
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
    }).addTo(mapRef.current);

    // Add zoom control to bottom right
    L.control.zoom({ position: "bottomright" }).addTo(mapRef.current);

    // Add custom CSS for popups
    const style = document.createElement("style");
    style.textContent = `
      .leaflet-popup-content-wrapper {
        background: transparent !important;
        box-shadow: none !important;
        padding: 0 !important;
        border-radius: 12px !important;
        overflow: hidden;
      }
      .leaflet-popup-content {
        margin: 0 !important;
        width: auto !important;
      }
      .leaflet-popup-tip-container {
        display: none !important;
      }
      .leaflet-popup-close-button {
        color: white !important;
        font-size: 20px !important;
        top: 8px !important;
        right: 8px !important;
        z-index: 10 !important;
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

  // Add routes with beautiful glow effect
  useEffect(() => {
    if (!mapRef.current || !showRoutes) return;

    // Clear existing routes
    routeLayersRef.current.forEach(layer => {
      mapRef.current?.removeLayer(layer);
    });
    routeLayersRef.current = [];

    // Add both routes with animated glow
    [routes.wondelgemstraat, routes.bevrijdingslaanPhoenix].forEach((route) => {
      // Outer glow
      const outerGlow = L.polyline(route, {
        color: "#FFD700",
        weight: 20,
        opacity: 0.15,
        lineCap: "round",
        lineJoin: "round",
      });

      // Middle glow
      const middleGlow = L.polyline(route, {
        color: "#FFD700",
        weight: 12,
        opacity: 0.3,
        lineCap: "round",
        lineJoin: "round",
      });

      // Inner glow
      const innerGlow = L.polyline(route, {
        color: "#FFD700",
        weight: 6,
        opacity: 0.6,
        lineCap: "round",
        lineJoin: "round",
      });

      // Core line
      const core = L.polyline(route, {
        color: "#FFFACD",
        weight: 3,
        opacity: 1,
        lineCap: "round",
        lineJoin: "round",
      });

      if (mapRef.current) {
        outerGlow.addTo(mapRef.current);
        middleGlow.addTo(mapRef.current);
        innerGlow.addTo(mapRef.current);
        core.addTo(mapRef.current);
        routeLayersRef.current.push(outerGlow, middleGlow, innerGlow, core);
      }
    });
  }, [showRoutes]);

  // Add/update sponsor markers
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapRef.current?.removeLayer(marker);
    });
    markersRef.current.clear();

    // Sort sponsors by tier
    const tierOrder: Record<PartnerTier, number> = {
      free: 0,
      partner: 1,
      partner_plus: 2,
      premium: 3,
    };

    const sortedSponsors = [...sponsors].sort(
      (a, b) => tierOrder[a.tier] - tierOrder[b.tier]
    );

    // Add markers
    sortedSponsors.forEach((sponsor) => {
      if (!sponsor.latitude || !sponsor.longitude) return;

      const isSelected = sponsor.id === selectedSponsorId;
      const icon = createMarkerIcon(sponsor.tier, sponsor.type, isSelected);

      const marker = L.marker([sponsor.latitude, sponsor.longitude], {
        icon,
        zIndexOffset: tierOrder[sponsor.tier] * 100 + (isSelected ? 1000 : 0),
      });

      // Create popup
      const popup = L.popup({
        closeButton: true,
        className: "sponsor-popup",
        maxWidth: 320,
        offset: [0, -10],
      }).setContent(createPopupContent(sponsor));

      marker.bindPopup(popup);

      marker.on("click", () => {
        if (onSponsorClick) {
          onSponsorClick(sponsor);
        }
      });

      if (mapRef.current) {
        marker.addTo(mapRef.current);
        markersRef.current.set(sponsor.id, marker);
      }
    });
  }, [sponsors, selectedSponsorId, onSponsorClick]);

  // Pan to selected sponsor
  useEffect(() => {
    if (!mapRef.current || !selectedSponsorId) return;

    const marker = markersRef.current.get(selectedSponsorId);
    if (marker) {
      const latlng = marker.getLatLng();
      mapRef.current.flyTo([latlng.lat + 0.002, latlng.lng], 16, {
        duration: 0.5,
      });
      marker.openPopup();
    }
  }, [selectedSponsorId]);

  return (
    <div className="relative w-full h-full">
      <div
        ref={containerRef}
        className="w-full h-full"
        style={{ background: "#0f2d2d" }}
      />

      {/* Legend */}
      <div className="absolute bottom-24 left-4 bg-[#0f2d2d]/95 backdrop-blur-sm rounded-xl p-4 shadow-2xl border border-white/10 z-[1000]">
        <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Legenda</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-gradient-to-b from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/30">
              <span className="text-white text-xs">👑</span>
            </div>
            <span className="text-sm text-white/80">Premium Sponsor</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-gradient-to-b from-teal-400 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/30">
              <span className="text-white text-[10px]">⭐</span>
            </div>
            <span className="text-sm text-white/80">Partner Plus</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-gradient-to-b from-violet-400 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <span className="text-white text-[8px]">●</span>
            </div>
            <span className="text-sm text-white/80">Partner</span>
          </div>
          <div className="flex items-center gap-3 pt-2 border-t border-white/10">
            <div className="w-6 h-1 rounded-full bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 shadow-lg shadow-yellow-400/50"></div>
            <span className="text-sm text-white/80">Verlichtingsroute</span>
          </div>
        </div>
      </div>
    </div>
  );
}
