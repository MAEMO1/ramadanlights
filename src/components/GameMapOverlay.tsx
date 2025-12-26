"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Navigation } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { FoodPartner } from "@/lib/food-partner-types";
import type { ShopPartner } from "@/lib/shop-partner-types";
import type { PartnerTier } from "@/lib/food-partner-types";
import { categoryLabels } from "@/lib/food-partner-types";
import { shopCategoryLabels } from "@/lib/shop-partner-types";

interface GameMapOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  foodPartners: FoodPartner[];
  shopPartners: ShopPartner[];
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

// Category icons for game-style markers
const categoryIcons: Record<string, string> = {
  // Food categories
  restaurant: "🍽️",
  bakery: "🥖",
  butcher: "🥩",
  supermarket: "🛒",
  catering: "🍱",
  cafe: "☕",
  // Shop categories
  decor: "🏮",
  clothing: "👗",
  spiritual: "📿",
  gifts: "🎁",
  beauty: "✨",
  kids: "🧸",
  tech: "📱",
  other: "🏪",
};

// Size configurations based on tier
const tierSizes: Record<PartnerTier, { size: number; zIndex: number; pulse: boolean }> = {
  premium: { size: 64, zIndex: 1000, pulse: true },
  partner_plus: { size: 48, zIndex: 500, pulse: false },
  partner: { size: 36, zIndex: 100, pulse: false },
  free: { size: 28, zIndex: 50, pulse: false },
};

// Create game-style marker
const createGameMarker = (
  category: string,
  tier: PartnerTier,
  name: string
) => {
  const config = tierSizes[tier];
  const icon = categoryIcons[category] || "📍";
  const size = config.size;

  // Different background colors based on tier
  const bgColors: Record<PartnerTier, { bg: string; border: string; glow: string }> = {
    premium: { bg: "#1a1a2e", border: "#FFD700", glow: "rgba(255, 215, 0, 0.6)" },
    partner_plus: { bg: "#1a1a2e", border: "#14B8A6", glow: "rgba(20, 184, 166, 0.4)" },
    partner: { bg: "#1a1a2e", border: "#8B5CF6", glow: "rgba(139, 92, 246, 0.3)" },
    free: { bg: "#1a1a2e", border: "#4B5563", glow: "rgba(75, 85, 99, 0.2)" },
  };

  const colors = bgColors[tier];

  const pulseAnimation = config.pulse ? `
    @keyframes game-pulse {
      0%, 100% { box-shadow: 0 0 0 0 ${colors.glow}, 0 4px 20px ${colors.glow}; }
      50% { box-shadow: 0 0 0 8px transparent, 0 4px 30px ${colors.glow}; }
    }
    animation: game-pulse 2s ease-in-out infinite;
  ` : `box-shadow: 0 4px 15px ${colors.glow};`;

  const html = `
    <div class="game-marker" style="
      width: ${size}px;
      height: ${size}px;
      position: relative;
      cursor: pointer;
      transition: transform 0.2s ease;
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
        font-size: ${size * 0.45}px;
        ${pulseAnimation}
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      ">
        ${icon}
      </div>
      ${tier === "premium" ? `
        <div style="
          position: absolute;
          top: -8px;
          right: -8px;
          font-size: 16px;
          filter: drop-shadow(0 0 4px rgba(255, 215, 0, 0.8));
        ">👑</div>
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
  tier: PartnerTier
) => {
  const tierLabel = tier === "premium" ? "Premium Sponsor" : tier === "partner_plus" ? "Uitgelicht" : "";

  return `
    <div style="
      background: #0f2d2d;
      color: white;
      padding: 16px;
      border-radius: 12px;
      min-width: 220px;
      max-width: 280px;
      font-family: system-ui, -apple-system, sans-serif;
      margin: -14px;
    ">
      ${tierLabel ? `
        <span style="
          display: inline-block;
          padding: 4px 10px;
          background: ${tier === "premium" ? "#FEF3C7" : "#CCFBF1"};
          color: ${tier === "premium" ? "#92400E" : "#0F766E"};
          border-radius: 100px;
          font-size: 11px;
          font-weight: 600;
          margin-bottom: 10px;
        ">${tierLabel}</span>
      ` : ""}

      <h3 style="margin: 0 0 6px 0; font-size: 16px; font-weight: 700;">${name}</h3>

      <p style="margin: 0 0 10px 0; font-size: 13px; color: rgba(255,255,255,0.6);">
        ${categoryIcons[category] || "📍"} ${categoryLabel}
      </p>

      ${description ? `
        <p style="margin: 0 0 12px 0; font-size: 13px; color: rgba(255,255,255,0.8); line-height: 1.4;">
          ${description.slice(0, 100)}${description.length > 100 ? "..." : ""}
        </p>
      ` : ""}

      <p style="margin: 0; font-size: 12px; color: rgba(255,255,255,0.5);">
        📍 ${address}
      </p>
    </div>
  `;
};

export function GameMapOverlay({ isOpen, onClose, foodPartners, shopPartners }: GameMapOverlayProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const routeLayersRef = useRef<L.Polyline[]>([]);
  const [mapReady, setMapReady] = useState(false);

  // Initialize map when overlay opens
  useEffect(() => {
    if (!isOpen || !containerRef.current || mapRef.current) return;

    // Small delay to let the curtain animation complete
    const timer = setTimeout(() => {
      if (!containerRef.current) return;

      mapRef.current = L.map(containerRef.current, {
        center: [51.055, 3.715],
        zoom: 14,
        zoomControl: false,
        attributionControl: false,
      });

      // Dark game-style tiles
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
      }).addTo(mapRef.current);

      // Add zoom control
      L.control.zoom({ position: "bottomright" }).addTo(mapRef.current);

      setMapReady(true);
    }, 800);

    return () => {
      clearTimeout(timer);
    };
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

    // Combine and filter partners (only show paid tiers)
    const allPartners: Array<{
      id: string;
      name: string;
      category: string;
      categoryLabel: string;
      tier: PartnerTier;
      lat: number;
      lng: number;
      address: string;
      description: string | null;
    }> = [];

    foodPartners.forEach(p => {
      if (p.latitude && p.longitude && p.partner_tier !== "free") {
        allPartners.push({
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

    shopPartners.forEach(p => {
      if (p.latitude && p.longitude && p.partner_tier !== "free") {
        allPartners.push({
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

    // Sort by tier (smallest first so biggest renders on top)
    const tierOrder: Record<PartnerTier, number> = { free: 0, partner: 1, partner_plus: 2, premium: 3 };
    allPartners.sort((a, b) => tierOrder[a.tier] - tierOrder[b.tier]);

    // Add markers
    allPartners.forEach(partner => {
      const icon = createGameMarker(partner.category, partner.tier, partner.name);
      const marker = L.marker([partner.lat, partner.lng], {
        icon,
        zIndexOffset: tierSizes[partner.tier].zIndex,
      });

      const popup = L.popup({
        closeButton: true,
        className: "game-popup",
        maxWidth: 300,
      }).setContent(createPopupContent(
        partner.name,
        partner.category,
        partner.categoryLabel,
        partner.address,
        partner.description,
        partner.tier
      ));

      marker.bindPopup(popup);

      if (mapRef.current) {
        marker.addTo(mapRef.current);
        markersRef.current.push(marker);
      }
    });
  }, [mapReady, foodPartners, shopPartners]);

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
      .game-marker:hover > div {
        transform: scale(1.15) !important;
      }
      .leaflet-popup-content-wrapper {
        background: transparent !important;
        box-shadow: none !important;
        padding: 0 !important;
        border-radius: 12px !important;
      }
      .leaflet-popup-content {
        margin: 0 !important;
      }
      .leaflet-popup-tip-container {
        display: none !important;
      }
      .leaflet-popup-close-button {
        color: white !important;
        font-size: 18px !important;
        top: 8px !important;
        right: 8px !important;
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
            {/* Map */}
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
                <h2 className="text-white font-display font-bold text-lg">Sponsor Kaart</h2>
                <p className="text-white/60 text-sm">Ontdek partners in Gent</p>
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
