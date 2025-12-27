"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, SkipForward, Filter, ChevronUp } from "lucide-react";
import { getCategoryIconSvg, foodCategories as foodCats, shopCategories as shopCats } from "@/lib/map-icons";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { FoodPartner } from "@/lib/food-partner-types";
import type { ShopPartner } from "@/lib/shop-partner-types";
import type { PartnerTier } from "@/lib/food-partner-types";
import { categoryLabels } from "@/lib/food-partner-types";
import { shopCategoryLabels } from "@/lib/shop-partner-types";
import { useIntroStateMachine } from "@/hooks/useIntroStateMachine";
import { MapIntroSequence } from "./MapIntroSequence";
import type { IntroPhase } from "@/lib/introConfig";

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
    [51.0615748, 3.7102994], [51.0612, 3.7104], [51.0608, 3.7105]
  ] as [number, number][],
  bevrijdingslaanPhoenix: [
    [51.0577376, 3.7071108], [51.0577646, 3.7069207], [51.0578048, 3.7067926],
    [51.0580774, 3.7060366], [51.0583278, 3.7053053], [51.0585255, 3.7048679],
    [51.0589024, 3.7043079], [51.05925, 3.7038], [51.05955, 3.7033782],
    [51.0605, 3.702], [51.0615, 3.7005], [51.0625, 3.699], [51.0634869, 3.6959922]
  ] as [number, number][],
};

// Check if a point is near a route and offset it to the side
const ROUTE_PROXIMITY_THRESHOLD = 0.002; // ~200m in degrees
const OFFSET_DISTANCE = 0.0025; // ~250m offset to the side - ensure markers don't cover routes

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

function offsetMarkerPosition(lat: number, lng: number, index: number): { position: [number, number]; original: [number, number]; wasOffset: boolean } {
  const original: [number, number] = [lat, lng];

  if (!isNearRoute(lat, lng)) {
    return { position: original, original, wasOffset: false };
  }

  // Offset ALL markers near routes to the EAST (right side) to keep routes visible
  // Add slight variation based on index to prevent complete stacking
  const baseOffset = OFFSET_DISTANCE;
  const variation = (index % 4) * 0.0004; // Small variation to spread markers
  const offsetLng = lng + baseOffset + variation;
  const offsetLat = lat + ((index % 3) * 0.0003 - 0.00045); // Slight lat variation

  return { position: [offsetLat, offsetLng], original, wasOffset: true };
}

// Icons are now provided by @/lib/map-icons using Tabler Icons
// See: https://tabler.io/icons for the full icon set

// REMOVED: Old categoryIcons SVG block - see git history if needed
// Now using getCategoryIconSvg from @/lib/map-icons

// Size configurations based on tier - slightly larger for new detailed icons
const tierSizes: Record<PartnerTier | "mosque", { size: number; zIndex: number; pulse: boolean }> = {
  premium: { size: 60, zIndex: 1000, pulse: true },
  partner_plus: { size: 48, zIndex: 500, pulse: false },
  partner: { size: 38, zIndex: 100, pulse: false },
  free: { size: 30, zIndex: 50, pulse: false },
  mosque: { size: 52, zIndex: 800, pulse: true },
};

// Color configurations - Night blue + warm gold palette with enhanced glows
const tierColors: Record<PartnerTier | "mosque", {
  bg: string;
  bgHover: string;
  border: string;
  borderHover: string;
  glow: string;
  glowHover: string;
  icon: string;
  shadow: string;
}> = {
  premium: {
    bg: "linear-gradient(145deg, #1a1a2e 0%, #0f0f1a 100%)",
    bgHover: "linear-gradient(145deg, #252540 0%, #1a1a2e 100%)",
    border: "#FFD700",
    borderHover: "#FFE55C",
    glow: "rgba(255, 215, 0, 0.6)",
    glowHover: "rgba(255, 215, 0, 0.9)",
    icon: "#FFD700",
    shadow: "0 6px 20px rgba(0,0,0,0.5), 0 0 30px rgba(255, 215, 0, 0.3)"
  },
  partner_plus: {
    bg: "linear-gradient(145deg, #0f2d2d 0%, #0a1f1f 100%)",
    bgHover: "linear-gradient(145deg, #1a4a4a 0%, #0f2d2d 100%)",
    border: "#14B8A6",
    borderHover: "#2DD4BF",
    glow: "rgba(20, 184, 166, 0.5)",
    glowHover: "rgba(20, 184, 166, 0.8)",
    icon: "#5EEAD4",
    shadow: "0 5px 16px rgba(0,0,0,0.4), 0 0 20px rgba(20, 184, 166, 0.25)"
  },
  partner: {
    bg: "linear-gradient(145deg, #1e1b4b 0%, #151234 100%)",
    bgHover: "linear-gradient(145deg, #312e81 0%, #1e1b4b 100%)",
    border: "#8B5CF6",
    borderHover: "#A78BFA",
    glow: "rgba(139, 92, 246, 0.4)",
    glowHover: "rgba(139, 92, 246, 0.7)",
    icon: "#A78BFA",
    shadow: "0 4px 14px rgba(0,0,0,0.35), 0 0 15px rgba(139, 92, 246, 0.2)"
  },
  free: {
    bg: "linear-gradient(145deg, #1f2937 0%, #111827 100%)",
    bgHover: "linear-gradient(145deg, #374151 0%, #1f2937 100%)",
    border: "#6B7280",
    borderHover: "#9CA3AF",
    glow: "rgba(107, 114, 128, 0.3)",
    glowHover: "rgba(107, 114, 128, 0.5)",
    icon: "#9CA3AF",
    shadow: "0 3px 10px rgba(0,0,0,0.3)"
  },
  mosque: {
    bg: "linear-gradient(145deg, #064e3b 0%, #022c22 100%)",
    bgHover: "linear-gradient(145deg, #065f46 0%, #064e3b 100%)",
    border: "#10B981",
    borderHover: "#34D399",
    glow: "rgba(16, 185, 129, 0.6)",
    glowHover: "rgba(16, 185, 129, 0.9)",
    icon: "#34D399",
    shadow: "0 5px 18px rgba(0,0,0,0.45), 0 0 25px rgba(16, 185, 129, 0.3)"
  },
};

// Food categories for filtering
const foodCategories = ['restaurant', 'bakery', 'butcher', 'supermarket', 'cafe', 'takeaway', 'catering', 'other'];
// Shop categories for filtering
const shopCategories = ['decor', 'clothing', 'gifts', 'jewelry', 'books', 'electronics', 'beauty', 'sports'];

// Create professional game-style marker with enhanced container and glow effects
const createGameMarker = (
  category: string,
  tier: PartnerTier | "mosque",
  markerIndex: number = 0
) => {
  const config = tierSizes[tier];
  const colors = tierColors[tier];
  const size = config.size;
  const iconSize = Math.round(size * 0.55); // Icon size for Tabler icons
  // Get SVG icon from Tabler-based icon system
  const iconSvg = getCategoryIconSvg(category, colors.icon, iconSize);
  const borderWidth = tier === "premium" || tier === "mosque" ? 4 : 3;

  // Determine category group for filtering
  const categoryGroup = tier === "mosque" ? "mosque" :
    foodCategories.includes(category) ? "food" :
    shopCategories.includes(category) ? "shop" : "other";

  // Calculate stagger delay based on index
  const staggerDelay = markerIndex * 0.08; // 80ms between each marker

  // Enhanced pulse animation with glow
  const pulseKeyframes = config.pulse ? `
    @keyframes marker-pulse-${tier}-${category.replace(/[^a-z]/gi, '')} {
      0%, 100% {
        box-shadow: ${colors.shadow}, 0 0 0 0 ${colors.glow};
      }
      50% {
        box-shadow: ${colors.shadow}, 0 0 0 8px transparent;
      }
    }
  ` : "";

  // Outer glow ring for premium/mosque tiers
  const glowRing = (tier === "premium" || tier === "mosque") ? `
    <div class="marker-glow-ring" style="
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      background: radial-gradient(circle, ${colors.glow} 0%, transparent 70%);
      opacity: 0.6;
      pointer-events: none;
      z-index: -1;
    "></div>
  ` : "";

  // Inner highlight for 3D effect
  const innerHighlight = `
    <div style="
      position: absolute;
      top: 2px;
      left: 15%;
      width: 40%;
      height: 30%;
      background: linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 100%);
      border-radius: 50% 50% 40% 40%;
      pointer-events: none;
    "></div>
  `;

  const html = `
    <style>${pulseKeyframes}</style>
    <div class="game-marker-icon tier-${tier} category-${categoryGroup}" data-category="${category}" data-index="${markerIndex}" style="
      width: ${size}px;
      height: ${size}px;
      position: relative;
      cursor: pointer;
      animation-delay: ${staggerDelay}s;
    ">
      ${glowRing}
      <div class="marker-inner" style="
        width: 100%;
        height: 100%;
        background: ${colors.bg};
        border: ${borderWidth}px solid ${colors.border};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
        ${config.pulse ? `animation: marker-pulse-${tier}-${category.replace(/[^a-z]/gi, '')} 2.5s ease-in-out infinite;` : `box-shadow: ${colors.shadow};`}
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      ">
        ${innerHighlight}
        <div class="marker-icon-wrapper" style="
          width: ${iconSize}px;
          height: ${iconSize}px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 1;
        ">
          ${iconSvg}
        </div>
      </div>
      ${tier === "premium" ? `
        <div class="marker-badge premium-badge" style="
          position: absolute;
          top: -8px;
          right: -8px;
          width: 24px;
          height: 24px;
          background: linear-gradient(145deg, #FFE55C 0%, #FFD700 50%, #FFA500 100%);
          border: 2px solid #1a1a2e;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 3px 10px rgba(255, 215, 0, 0.7), inset 0 1px 2px rgba(255,255,255,0.4);
          z-index: 10;
        ">
          <svg viewBox="0 0 24 24" fill="#1a1a2e" style="width: 14px; height: 14px;">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
      ` : ""}
      ${tier === "mosque" ? `
        <div class="marker-badge mosque-badge" style="
          position: absolute;
          top: -6px;
          right: -6px;
          width: 20px;
          height: 20px;
          background: linear-gradient(145deg, #34D399 0%, #10B981 50%, #059669 100%);
          border: 2px solid #064e3b;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.7), inset 0 1px 2px rgba(255,255,255,0.3);
          z-index: 10;
        ">
          <svg viewBox="0 0 24 24" fill="#fff" style="width: 12px; height: 12px;">
            <path d="M17 8c0-3-2-5-5-5S7 5 7 8c0 1.5.5 2.8 1.4 3.8L12 16l3.6-4.2C16.5 10.8 17 9.5 17 8z"/>
          </svg>
        </div>
      ` : ""}
      ${tier === "partner_plus" ? `
        <div class="marker-badge plus-badge" style="
          position: absolute;
          top: -5px;
          right: -5px;
          width: 18px;
          height: 18px;
          background: linear-gradient(145deg, #5EEAD4 0%, #14B8A6 100%);
          border: 2px solid #0f2d2d;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(20, 184, 166, 0.6);
          z-index: 10;
        ">
          <svg viewBox="0 0 24 24" fill="#0f2d2d" style="width: 10px; height: 10px;">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
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

// Popup content - Enhanced with game-style design
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

  // Use a smaller, simplified icon for the popup
  const getSimpleIcon = (cat: string) => {
    const iconMap: Record<string, string> = {
      restaurant: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>`,
      bakery: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.5 2 5 4 5 8c0 2.5 1.5 4 3 5v9h8v-9c1.5-1 3-2.5 3-5 0-4-3.5-6-7-6z"/></svg>`,
      butcher: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.06 3.64c-1.17-1.17-3.07-1.17-4.24 0l-2.12 2.12 4.24 4.24 2.12-2.12c1.17-1.17 1.17-3.07 0-4.24zM7.59 7.59L2 22l14.41-5.59L7.59 7.59z"/></svg>`,
      supermarket: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>`,
      mosque: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C9.5 2 7.5 4 7.5 6.5c0 .8.2 1.5.5 2.1V10H6v10h12V10h-2V8.6c.3-.6.5-1.3.5-2.1C16.5 4 14.5 2 12 2z"/><rect x="3" y="6" width="2" height="14" rx="1"/></svg>`,
    };
    return iconMap[cat] || `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z"/></svg>`;
  };

  return `
    <div style="
      background: linear-gradient(145deg, #1a1a2e 0%, #0f0f1a 100%);
      color: white;
      padding: 18px;
      border-radius: 16px;
      min-width: 240px;
      max-width: 300px;
      font-family: system-ui, -apple-system, sans-serif;
      margin: -14px;
      border: 2px solid ${colors.border};
      box-shadow: 0 12px 40px rgba(0,0,0,0.5), 0 0 20px ${colors.glow};
    ">
      ${tierLabel ? `
        <span style="
          display: inline-block;
          padding: 5px 14px;
          background: ${tier === "premium" ? "linear-gradient(145deg, #FFE55C 0%, #FFD700 50%, #FFA500 100%)" : tier === "mosque" ? "linear-gradient(145deg, #34D399 0%, #10B981 100%)" : tier === "partner_plus" ? "linear-gradient(145deg, #5EEAD4 0%, #14B8A6 100%)" : "linear-gradient(145deg, #A78BFA 0%, #8B5CF6 100%)"};
          color: ${tier === "premium" ? "#1a1a2e" : tier === "mosque" ? "#022c22" : tier === "partner_plus" ? "#0f2d2d" : "#1e1b4b"};
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
          margin-bottom: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 2px 8px ${colors.glow};
        ">${tierLabel}</span>
      ` : ""}

      <h3 style="margin: 0 0 10px 0; font-size: 18px; font-weight: 700; line-height: 1.3;">${name}</h3>

      <p style="margin: 0 0 14px 0; font-size: 13px; color: rgba(255,255,255,0.7); display: flex; align-items: center; gap: 8px;">
        <span style="
          width: 24px;
          height: 24px;
          color: ${colors.icon};
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.1);
          border-radius: 6px;
          padding: 3px;
        ">${getSimpleIcon(category)}</span>
        ${categoryLabel}
      </p>

      ${description ? `
        <p style="margin: 0 0 14px 0; font-size: 13px; color: rgba(255,255,255,0.8); line-height: 1.5; border-left: 2px solid ${colors.border}; padding-left: 10px;">
          ${description.slice(0, 120)}${description.length > 120 ? "..." : ""}
        </p>
      ` : ""}

      <p style="
        margin: 0;
        font-size: 12px;
        color: rgba(255,255,255,0.6);
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 10px;
        background: rgba(255,255,255,0.05);
        border-radius: 8px;
      ">
        <svg viewBox="0 0 24 24" fill="${colors.icon}" style="width: 16px; height: 16px; flex-shrink: 0;"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
        ${address}
      </p>
    </div>
  `;
};

// Helper to detect reduced motion preference
function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return prefersReducedMotion;
}

// Helper to detect mobile
function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile;
}

// Map IntroPhase to old animation phase numbers for backwards compatibility
function phaseToNumber(phase: IntroPhase): number {
  const mapping: Record<IntroPhase, number> = {
    IDLE: 0,
    PRELOAD: 0,
    BEAMS_SWIRL: 1,
    BEAMS_LAND: 2,
    STREETS_GLOW: 3,
    MOSQUES_RISE: 4,
    SPONSORS_WAVE: 5, // This covers phases 5, 6, 7 (we'll handle sponsor tiers separately)
    COMPLETE: 8,
  };
  return mapping[phase];
}

export function GameMapOverlay({ isOpen, onClose, foodPartners, shopPartners, mosques = [] }: GameMapOverlayProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const routeLayersRef = useRef<L.Polyline[]>([]);
  const connectorLinesRef = useRef<L.Polyline[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(14);

  // Detect user preferences
  const prefersReducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  // Use the new state machine for intro animation
  const {
    phase: introPhase,
    isPlaying: introIsPlaying,
    phaseProgress,
    start: startIntro,
    skip: skipIntro,
    reset: resetIntro,
  } = useIntroStateMachine({
    autoStart: false,
    prefersReducedMotion,
    onComplete: () => {
      // Intro complete, map is now fully interactive
    },
  });

  // Convert new phase to old animation phase number for backwards compatibility
  const animationPhase = phaseToNumber(introPhase);

  // Track sponsor wave sub-phases (within SPONSORS_WAVE phase)
  const [sponsorSubPhase, setSponsorSubPhase] = useState(0); // 0=partner, 1=partner_plus, 2=premium

  // Filter state for FAB
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    mosques: true,
    food: true,
    shops: true,
  });

  // Toggle filter and update marker visibility
  const toggleFilter = useCallback((filterType: 'mosques' | 'food' | 'shops') => {
    setActiveFilters(prev => {
      const newFilters = { ...prev, [filterType]: !prev[filterType] };

      // Update marker visibility based on filters
      requestAnimationFrame(() => {
        // Mosques - markers, dots, and connector lines
        document.querySelectorAll('.game-marker-icon.tier-mosque').forEach(el => {
          (el as HTMLElement).style.display = newFilters.mosques ? '' : 'none';
        });
        document.querySelectorAll('.connector-dot.tier-mosque').forEach(el => {
          (el as HTMLElement).style.display = newFilters.mosques ? '' : 'none';
        });
        document.querySelectorAll('.connector-line.category-mosque').forEach(el => {
          (el as SVGElement).style.display = newFilters.mosques ? '' : 'none';
        });

        // Food partners - markers, dots, and connector lines
        document.querySelectorAll('.game-marker-icon.category-food').forEach(el => {
          (el as HTMLElement).style.display = newFilters.food ? '' : 'none';
        });
        document.querySelectorAll('.connector-dot.category-food').forEach(el => {
          (el as HTMLElement).style.display = newFilters.food ? '' : 'none';
        });
        document.querySelectorAll('.connector-line.category-food').forEach(el => {
          (el as SVGElement).style.display = newFilters.food ? '' : 'none';
        });

        // Shop partners - markers, dots, and connector lines
        document.querySelectorAll('.game-marker-icon.category-shop').forEach(el => {
          (el as HTMLElement).style.display = newFilters.shops ? '' : 'none';
        });
        document.querySelectorAll('.connector-dot.category-shop').forEach(el => {
          (el as HTMLElement).style.display = newFilters.shops ? '' : 'none';
        });
        document.querySelectorAll('.connector-line.category-shop').forEach(el => {
          (el as SVGElement).style.display = newFilters.shops ? '' : 'none';
        });
      });

      return newFilters;
    });
  }, []);

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

      // Create custom pane for routes that renders ABOVE markers (default markerPane z-index is 600)
      mapRef.current.createPane("routesPane");
      const routesPane = mapRef.current.getPane("routesPane");
      if (routesPane) {
        routesPane.style.zIndex = "650"; // Above markers (600) but below popups (700)
        routesPane.style.pointerEvents = "none"; // Don't block clicks on markers below
      }

      L.control.zoom({ position: "bottomright" }).addTo(mapRef.current);

      // Track zoom level changes
      mapRef.current.on("zoomend", () => {
        if (mapRef.current) {
          setZoomLevel(mapRef.current.getZoom());
        }
      });

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
      resetIntro(); // Reset intro state machine
      setSponsorSubPhase(0);
    }
  }, [isOpen, resetIntro]);

  // Start intro when map is ready
  useEffect(() => {
    if (isOpen && mapReady && introPhase === "IDLE") {
      startIntro();
    }
  }, [isOpen, mapReady, introPhase, startIntro]);

  // Handle sponsor sub-phases within SPONSORS_WAVE
  // SPONSORS_WAVE is 3.0s total, matching MARKER_CONFIG delays (0, 1.0, 2.0)
  useEffect(() => {
    if (introPhase !== "SPONSORS_WAVE") return;

    // phaseProgress goes from 0 to 1 over 3 seconds
    // 0-0.33: partner tier (0-1s), 0.33-0.67: partner_plus (1-2s), 0.67-1.0: premium (2-3s)
    if (phaseProgress < 0.33) {
      setSponsorSubPhase(0);
    } else if (phaseProgress < 0.67) {
      setSponsorSubPhase(1);
    } else {
      setSponsorSubPhase(2);
    }
  }, [introPhase, phaseProgress]);

  // When COMPLETE, set all sub-phases to max
  useEffect(() => {
    if (introPhase === "COMPLETE") {
      setSponsorSubPhase(2);
    }
  }, [introPhase]);

  // Add routes - glow brighter when zooming out and based on animation phase
  useEffect(() => {
    if (!mapRef.current || !mapReady) return;

    routeLayersRef.current.forEach(layer => mapRef.current?.removeLayer(layer));
    routeLayersRef.current = [];

    // Don't show routes until STREETS_GLOW phase or later
    if (introPhase !== "STREETS_GLOW" && introPhase !== "MOSQUES_RISE" && introPhase !== "SPONSORS_WAVE" && introPhase !== "COMPLETE") return;

    // Calculate glow intensity based on zoom (brighter when zoomed out)
    // Zoom 14 = normal, zoom 10 = max glow
    const glowMultiplier = Math.max(1, 1 + (14 - zoomLevel) * 0.35); // Stronger glow when zoomed out
    const weightMultiplier = Math.max(1, 1 + (14 - zoomLevel) * 0.2); // Thicker lines when zoomed out

    // Animation intensity - starts bright and settles
    const animIntensity = introPhase === "STREETS_GLOW" ? 1.8 : 1;

    [routes.wondelgemstraat, routes.bevrijdingslaanPhoenix].forEach((route) => {
      // All route layers use the custom routesPane to render ABOVE markers
      const layers = [
        // Outer glow - gets much bigger and brighter when zoomed out
        L.polyline(route, {
          color: "#FFD700",
          weight: 16 * weightMultiplier * glowMultiplier * animIntensity,
          opacity: Math.min(0.5, 0.15 * glowMultiplier * animIntensity),
          lineCap: "round",
          lineJoin: "round",
          pane: "routesPane"
        }),
        // Middle glow
        L.polyline(route, {
          color: "#FFD700",
          weight: 10 * weightMultiplier * animIntensity,
          opacity: Math.min(0.7, 0.3 * glowMultiplier * animIntensity),
          lineCap: "round",
          lineJoin: "round",
          pane: "routesPane"
        }),
        // Inner glow
        L.polyline(route, {
          color: "#FFD700",
          weight: 5 * weightMultiplier,
          opacity: Math.min(0.95, 0.6 * glowMultiplier * animIntensity),
          lineCap: "round",
          lineJoin: "round",
          pane: "routesPane"
        }),
        // Core line (always bright)
        L.polyline(route, {
          color: "#FFFACD",
          weight: 2 * weightMultiplier,
          opacity: 1,
          lineCap: "round",
          lineJoin: "round",
          pane: "routesPane"
        }),
      ];

      layers.forEach(layer => {
        if (mapRef.current) {
          layer.addTo(mapRef.current);
          routeLayersRef.current.push(layer);
        }
      });
    });
  }, [mapReady, zoomLevel, introPhase]);

  // Track the count of markers added (to detect new data)
  const markersCountRef = useRef({ food: 0, shop: 0, mosques: 0 });

  // Add ALL markers when map is ready - visibility controlled by CSS
  // Re-adds if new data arrives (e.g., mosques loaded after initial render)
  useEffect(() => {
    if (!mapRef.current || !mapReady) return;

    // Calculate expected counts
    const foodCount = foodPartners.filter(p => p.latitude && p.longitude && p.partner_tier !== "free").length;
    const shopCount = shopPartners.filter(p => p.latitude && p.longitude && p.partner_tier !== "free").length;
    const mosqueCount = mosques.filter(m => m.latitude && m.longitude).length;

    // Check if we already have all the markers
    if (
      markersCountRef.current.food === foodCount &&
      markersCountRef.current.shop === shopCount &&
      markersCountRef.current.mosques === mosqueCount &&
      markersRef.current.length > 0
    ) {
      return; // No new data, skip
    }

    // Clear existing markers if re-adding
    if (markersRef.current.length > 0) {
      markersRef.current.forEach(marker => mapRef.current?.removeLayer(marker));
      markersRef.current = [];
      connectorLinesRef.current.forEach(line => mapRef.current?.removeLayer(line));
      connectorLinesRef.current = [];
    }

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

    // Add all markers with offset for those near illuminated streets
    allMarkers.forEach((item, index) => {
      const icon = createGameMarker(item.category, item.tier, index);
      const { position, original, wasOffset } = offsetMarkerPosition(item.lat, item.lng, index);
      const marker = L.marker(position, {
        icon,
        zIndexOffset: tierSizes[item.tier].zIndex,
      });

      // Determine category group for filtering
      const categoryGroup = item.tier === "mosque" ? "mosque" :
        foodCategories.includes(item.category) ? "food" :
        shopCategories.includes(item.category) ? "shop" : "other";

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
        // Draw connector line if marker was offset
        if (wasOffset) {
          const connectorLine = L.polyline([original, position], {
            color: tierColors[item.tier].border,
            weight: 2,
            opacity: 0,
            dashArray: "4, 6",
            lineCap: "round",
            className: `connector-line tier-${item.tier} category-${categoryGroup}`,
          });
          connectorLine.addTo(mapRef.current);
          connectorLinesRef.current.push(connectorLine);

          // Add small dot at original location to show real address
          const dotIcon = L.divIcon({
            className: `connector-dot tier-${item.tier} category-${categoryGroup}`,
            html: `<div style="
              width: 10px;
              height: 10px;
              background: ${tierColors[item.tier].border};
              border: 2px solid ${tierColors[item.tier].icon};
              border-radius: 50%;
              box-shadow: 0 0 6px ${tierColors[item.tier].glow};
              opacity: 0;
            "></div>`,
            iconSize: [10, 10],
            iconAnchor: [5, 5],
          });
          const dotMarker = L.marker(original, { icon: dotIcon, zIndexOffset: 10 });
          dotMarker.addTo(mapRef.current);
          markersRef.current.push(dotMarker);
        }

        marker.addTo(mapRef.current);
        markersRef.current.push(marker);
      }
    });

    // Update counts to track what we've added
    markersCountRef.current = { food: foodCount, shop: shopCount, mosques: mosqueCount };

    // Immediately activate markers that should already be visible (for when data loads after phase reached)
    // Use setTimeout to ensure DOM is ready
    setTimeout(() => {
      const activateMarkers = (tier: string) => {
        document.querySelectorAll(`.game-marker-icon.tier-${tier}`).forEach(el => {
          if (!el.classList.contains("marker-activated")) {
            el.classList.add("marker-activated");
          }
        });
        document.querySelectorAll(`.connector-dot.tier-${tier}`).forEach(el => {
          if (!el.classList.contains("dot-activated")) {
            el.classList.add("dot-activated");
          }
        });
      };

      // Check current phase and activate appropriate markers
      const phase = introPhase;
      const subPhase = sponsorSubPhase;
      const shouldShowMosques = phase === "MOSQUES_RISE" || phase === "SPONSORS_WAVE" || phase === "COMPLETE";
      const shouldShowPartner = (phase === "SPONSORS_WAVE" && subPhase >= 0) || phase === "COMPLETE";
      const shouldShowPartnerPlus = (phase === "SPONSORS_WAVE" && subPhase >= 1) || phase === "COMPLETE";
      const shouldShowPremium = (phase === "SPONSORS_WAVE" && subPhase >= 2) || phase === "COMPLETE";

      if (shouldShowMosques) activateMarkers("mosque");
      if (shouldShowPartner) {
        activateMarkers("partner");
        activateMarkers("free");
      }
      if (shouldShowPartnerPlus) activateMarkers("partner_plus");
      if (shouldShowPremium) activateMarkers("premium");
    }, 50);
  }, [mapReady, foodPartners, shopPartners, mosques, introPhase, sponsorSubPhase]);

  // Reset markers count when map is closed
  useEffect(() => {
    if (!isOpen) {
      markersCountRef.current = { food: 0, shop: 0, mosques: 0 };
    }
  }, [isOpen]);

  // Update connector line visibility based on phase
  useEffect(() => {
    if (!mapRef.current) return;

    const showMosques = introPhase === "MOSQUES_RISE" || introPhase === "SPONSORS_WAVE" || introPhase === "COMPLETE";
    const showPartner = (introPhase === "SPONSORS_WAVE" && sponsorSubPhase >= 0) || introPhase === "COMPLETE";
    const showPartnerPlus = (introPhase === "SPONSORS_WAVE" && sponsorSubPhase >= 1) || introPhase === "COMPLETE";
    const showPremium = (introPhase === "SPONSORS_WAVE" && sponsorSubPhase >= 2) || introPhase === "COMPLETE";

    connectorLinesRef.current.forEach(line => {
      const el = line.getElement();
      if (!el) return;

      const isMosque = el.classList.contains("tier-mosque");
      const isPartner = el.classList.contains("tier-partner");
      const isPartnerPlus = el.classList.contains("tier-partner_plus");
      const isPremium = el.classList.contains("tier-premium");

      let shouldShow = false;
      if (isMosque) shouldShow = showMosques;
      else if (isPartner) shouldShow = showPartner;
      else if (isPartnerPlus) shouldShow = showPartnerPlus;
      else if (isPremium) shouldShow = showPremium;

      line.setStyle({ opacity: shouldShow ? 0.6 : 0 });
    });
  }, [introPhase, sponsorSubPhase]);

  // Track which tiers have been activated (to prevent re-animating)
  const activatedTiersRef = useRef<Set<string>>(new Set());

  // Determine visibility states for CSS
  const showMosques = introPhase === "MOSQUES_RISE" || introPhase === "SPONSORS_WAVE" || introPhase === "COMPLETE";
  const showPartner = (introPhase === "SPONSORS_WAVE" && sponsorSubPhase >= 0) || introPhase === "COMPLETE";
  const showPartnerPlus = (introPhase === "SPONSORS_WAVE" && sponsorSubPhase >= 1) || introPhase === "COMPLETE";
  const showPremium = (introPhase === "SPONSORS_WAVE" && sponsorSubPhase >= 2) || introPhase === "COMPLETE";

  // Track activation state (once activated, stays activated)
  useEffect(() => {
    if (showMosques) activatedTiersRef.current.add("mosque");
    if (showPartner) {
      activatedTiersRef.current.add("partner");
      activatedTiersRef.current.add("free");
    }
    if (showPartnerPlus) activatedTiersRef.current.add("partner_plus");
    if (showPremium) activatedTiersRef.current.add("premium");
  }, [showMosques, showPartner, showPartnerPlus, showPremium]);

  // Reset activation tracking when map closes
  useEffect(() => {
    if (!isOpen) {
      activatedTiersRef.current.clear();
    }
  }, [isOpen]);

  // Add STATIC styles once (animations, hover effects, popup styles)
  useEffect(() => {
    if (!isOpen) return;

    // Check if static styles already exist
    if (document.getElementById("game-map-static-styles")) return;

    const staticStyle = document.createElement("style");
    staticStyle.id = "game-map-static-styles";
    staticStyle.textContent = `
      /* Mosque: Dramatic elastic mushroom pop from ground */
      @keyframes mosqueRise {
        0% { transform: scale(0) translateY(35px); opacity: 0; }
        30% { transform: scale(0.3) translateY(25px); opacity: 0.5; }
        50% { transform: scale(1.4) translateY(-15px); opacity: 1; }
        65% { transform: scale(0.85) translateY(5px); opacity: 1; }
        80% { transform: scale(1.15) translateY(-3px); opacity: 1; }
        90% { transform: scale(0.95) translateY(1px); opacity: 1; }
        100% { transform: scale(1) translateY(0); opacity: 1; }
      }

      /* Simple fade-scale for basic partners */
      @keyframes simplePop {
        0% { transform: scale(0.5); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }

      /* Medium bounce for partner_plus */
      @keyframes mediumPop {
        0% { transform: scale(0) translateY(20px); opacity: 0; }
        60% { transform: scale(1.25) translateY(-6px); opacity: 1; }
        80% { transform: scale(0.9) translateY(2px); opacity: 1; }
        100% { transform: scale(1) translateY(0); opacity: 1; }
      }

      /* Premium: Dramatic entrance with glow pulse */
      @keyframes premiumPop {
        0% { transform: scale(0) translateY(40px); opacity: 0; filter: brightness(1); }
        35% { transform: scale(1.5) translateY(-15px); opacity: 1; filter: brightness(1.5); }
        50% { transform: scale(1.0) translateY(8px); opacity: 1; filter: brightness(1.2); }
        65% { transform: scale(1.35) translateY(-5px); opacity: 1; filter: brightness(1.3); }
        80% { transform: scale(1.1) translateY(2px); opacity: 1; filter: brightness(1.1); }
        100% { transform: scale(1.2) translateY(0); opacity: 1; filter: brightness(1); }
      }

      /* Glow pulse animation for hover */
      @keyframes glowPulse {
        0%, 100% { opacity: 0.6; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.1); }
      }

      /* Badge bounce animation */
      @keyframes badgeBounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.15); }
      }

      .game-marker-container {
        background: transparent !important;
        border: none !important;
      }

      /* Base marker style - hidden by default */
      .game-marker-icon {
        transform-origin: center center !important;
        opacity: 0;
        visibility: hidden;
      }

      /* Activated markers - visible with animation */
      /* Using individual properties so inline animation-delay isn't overridden */
      .game-marker-icon.marker-activated {
        visibility: visible !important;
        animation-fill-mode: forwards;
      }

      /* Mosques: Dramatic elastic rise from ground, one by one */
      .game-marker-icon.tier-mosque.marker-activated {
        animation-name: mosqueRise;
        animation-duration: 0.9s;
        animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      /* Partners/Free: Simple quick appearance */
      .game-marker-icon.tier-partner.marker-activated,
      .game-marker-icon.tier-free.marker-activated {
        animation-name: simplePop;
        animation-duration: 0.3s;
        animation-timing-function: ease-out;
      }

      /* Partner Plus: Medium bounce animation */
      .game-marker-icon.tier-partner_plus.marker-activated {
        animation-name: mediumPop;
        animation-duration: 0.6s;
        animation-timing-function: cubic-bezier(0.34, 1.2, 0.64, 1);
      }

      /* Premium: Dramatic entrance with multiple bounces */
      .game-marker-icon.tier-premium.marker-activated {
        animation-name: premiumPop;
        animation-duration: 1.0s;
        animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      /* Hover effects */
      .game-marker-icon:hover .marker-inner {
        border-width: 4px !important;
      }

      /* Tier-specific hover glows */
      .game-marker-icon.tier-premium:hover .marker-inner {
        box-shadow: 0 8px 30px rgba(0,0,0,0.5), 0 0 40px rgba(255, 215, 0, 0.7), 0 0 60px rgba(255, 215, 0, 0.4) !important;
        border-color: #FFE55C !important;
      }
      .game-marker-icon.tier-premium:hover .marker-glow-ring {
        animation: glowPulse 1s ease-in-out infinite;
        opacity: 1 !important;
      }
      .game-marker-icon.tier-premium:hover .marker-badge {
        animation: badgeBounce 0.5s ease-in-out;
      }

      .game-marker-icon.tier-mosque:hover .marker-inner {
        box-shadow: 0 8px 28px rgba(0,0,0,0.5), 0 0 35px rgba(16, 185, 129, 0.7), 0 0 55px rgba(16, 185, 129, 0.4) !important;
        border-color: #34D399 !important;
      }
      .game-marker-icon.tier-mosque:hover .marker-glow-ring {
        animation: glowPulse 1s ease-in-out infinite;
        opacity: 1 !important;
      }
      .game-marker-icon.tier-mosque:hover .marker-badge {
        animation: badgeBounce 0.5s ease-in-out;
      }

      .game-marker-icon.tier-partner_plus:hover .marker-inner {
        box-shadow: 0 6px 24px rgba(0,0,0,0.45), 0 0 30px rgba(20, 184, 166, 0.6), 0 0 45px rgba(20, 184, 166, 0.3) !important;
        border-color: #2DD4BF !important;
      }
      .game-marker-icon.tier-partner_plus:hover .marker-badge {
        animation: badgeBounce 0.5s ease-in-out;
      }

      .game-marker-icon.tier-partner:hover .marker-inner {
        box-shadow: 0 5px 20px rgba(0,0,0,0.4), 0 0 25px rgba(139, 92, 246, 0.5), 0 0 35px rgba(139, 92, 246, 0.25) !important;
        border-color: #A78BFA !important;
      }

      .game-marker-icon.tier-free:hover .marker-inner {
        box-shadow: 0 4px 16px rgba(0,0,0,0.35), 0 0 15px rgba(107, 114, 128, 0.4) !important;
        border-color: #9CA3AF !important;
      }

      /* Popup styles */
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
        font-size: 22px !important;
        top: 12px !important;
        right: 12px !important;
        opacity: 0.7;
        width: 28px !important;
        height: 28px !important;
        display: flex !important;
        align-items: center;
        justify-content: center;
        background: rgba(0,0,0,0.3) !important;
        border-radius: 50% !important;
        transition: all 0.2s ease;
      }
      .leaflet-popup-close-button:hover {
        opacity: 1;
        background: rgba(0,0,0,0.5) !important;
        transform: scale(1.1);
      }

      /* Connector dots */
      .connector-dot {
        background: transparent !important;
        border: none !important;
      }
      .connector-dot > div {
        transition: opacity 0.3s ease !important;
      }
      .connector-dot.dot-activated > div {
        opacity: 1 !important;
      }

      /* Icon inner glow on hover */
      .game-marker-icon:hover .marker-icon-wrapper svg {
        filter: drop-shadow(0 0 4px currentColor);
      }
    `;

    document.head.appendChild(staticStyle);

    return () => {
      const styleToRemove = document.getElementById("game-map-static-styles");
      if (styleToRemove) styleToRemove.remove();
    };
  }, [isOpen]);

  // Add DYNAMIC styles (zoom-based scaling)
  useEffect(() => {
    if (!isOpen) return;

    // Calculate marker scale based on zoom (EXTREMELY small when zoomed out to keep streets visible)
    // Zoom 14 = 1.0, zoom 12 = 0.35, zoom 10 = 0.12, zoom 8 = 0.05
    const baseScale = Math.max(0.05, Math.min(1, Math.pow((zoomLevel - 7) / 7, 2)));

    const dynamicStyle = document.createElement("style");
    dynamicStyle.id = "game-map-dynamic-styles";
    dynamicStyle.textContent = `
      .game-marker-icon {
        transform: scale(${baseScale}) !important;
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), filter 0.3s ease !important;
      }

      .game-marker-icon:hover {
        transform: scale(${baseScale * 1.35}) !important;
        z-index: 9999 !important;
      }

      .leaflet-marker-icon:has(.game-popup-active) .game-marker-icon,
      .leaflet-popup-open .game-marker-icon {
        transform: scale(${baseScale * 1.4}) !important;
        filter: brightness(1.1);
      }

      .connector-dot {
        transform: scale(${baseScale}) !important;
        transition: transform 0.3s ease !important;
      }
    `;

    // Remove existing dynamic style first
    const existingStyle = document.getElementById("game-map-dynamic-styles");
    if (existingStyle) existingStyle.remove();

    document.head.appendChild(dynamicStyle);

    return () => {
      const styleToRemove = document.getElementById("game-map-dynamic-styles");
      if (styleToRemove) styleToRemove.remove();
    };
  }, [isOpen, zoomLevel]);

  // Activate markers by adding class when their phase is reached
  useEffect(() => {
    if (!mapRef.current) return;

    // Get all marker elements on the map
    const activateMarkers = (tier: string) => {
      document.querySelectorAll(`.game-marker-icon.tier-${tier}`).forEach(el => {
        if (!el.classList.contains("marker-activated")) {
          el.classList.add("marker-activated");
        }
      });
      document.querySelectorAll(`.connector-dot.tier-${tier}`).forEach(el => {
        if (!el.classList.contains("dot-activated")) {
          el.classList.add("dot-activated");
        }
      });
    };

    if (showMosques) activateMarkers("mosque");
    if (showPartner) {
      activateMarkers("partner");
      activateMarkers("free");
    }
    if (showPartnerPlus) activateMarkers("partner_plus");
    if (showPremium) activateMarkers("premium");
  }, [showMosques, showPartner, showPartnerPlus, showPremium]);

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

          {/* Canvas VFX Overlay - Outside map container for proper z-index */}
          <MapIntroSequence
            phase={introPhase}
            phaseProgress={phaseProgress}
            isPlaying={introIsPlaying}
            isMobile={isMobile}
          />

          {/* Map Container */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="fixed inset-0 bg-[#0a1a1a] z-[9997]"
          >
            <div ref={containerRef} className="w-full h-full" />

            {/* Skip Intro Button - visible during intro phases */}
            <AnimatePresence>
              {introIsPlaying && introPhase !== "COMPLETE" && introPhase !== "IDLE" && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  onClick={skipIntro}
                  className="absolute bottom-6 right-6 z-[10000] flex items-center gap-2 px-4 py-2 bg-[#0f2d2d]/90 backdrop-blur-sm border border-white/20 rounded-full text-white/80 text-sm font-medium hover:bg-[#1a4a4a] hover:border-white/40 hover:text-white transition-all shadow-2xl"
                >
                  <SkipForward className="w-4 h-4" />
                  <span>Skip intro</span>
                </motion.button>
              )}
            </AnimatePresence>

            {/* Close Button - appears after STREETS_GLOW */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: introPhase === "STREETS_GLOW" || introPhase === "MOSQUES_RISE" || introPhase === "SPONSORS_WAVE" || introPhase === "COMPLETE" ? 1 : 0,
                scale: introPhase === "STREETS_GLOW" || introPhase === "MOSQUES_RISE" || introPhase === "SPONSORS_WAVE" || introPhase === "COMPLETE" ? 1 : 0.8
              }}
              transition={{ duration: 0.3 }}
              onClick={onClose}
              className="absolute top-6 right-6 z-[9999] w-12 h-12 bg-[#0f2d2d] border-2 border-white/20 rounded-full flex items-center justify-center text-white hover:bg-[#1a4a4a] hover:border-white/40 transition-all shadow-2xl"
            >
              <X className="w-5 h-5" />
            </motion.button>

            {/* Title - appears after STREETS_GLOW */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{
                opacity: introPhase === "STREETS_GLOW" || introPhase === "MOSQUES_RISE" || introPhase === "SPONSORS_WAVE" || introPhase === "COMPLETE" ? 1 : 0,
                y: introPhase === "STREETS_GLOW" || introPhase === "MOSQUES_RISE" || introPhase === "SPONSORS_WAVE" || introPhase === "COMPLETE" ? 0 : -20
              }}
              transition={{ duration: 0.5 }}
              className="absolute top-6 left-6 z-[9999]"
            >
              <div className="bg-[#0f2d2d]/90 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-3 shadow-2xl">
                <h2 className="text-white font-display font-bold text-lg">Ramadan Lights Kaart</h2>
                <p className="text-white/60 text-sm">Moskeeen, restaurants & winkels in Gent</p>
              </div>
            </motion.div>

            {/* Legend - appears after STREETS_GLOW */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: introPhase === "STREETS_GLOW" || introPhase === "MOSQUES_RISE" || introPhase === "SPONSORS_WAVE" || introPhase === "COMPLETE" ? 1 : 0,
                y: introPhase === "STREETS_GLOW" || introPhase === "MOSQUES_RISE" || introPhase === "SPONSORS_WAVE" || introPhase === "COMPLETE" ? 0 : 20
              }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="absolute bottom-6 left-6 z-[9999]"
            >
              <div className="bg-[#0f2d2d]/90 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-8 h-1.5 rounded-full bg-gradient-to-r from-[#FFD700]/40 via-[#FFD700] to-[#FFD700]/40" style={{ boxShadow: '0 0 8px #FFD700, 0 0 16px #FFD700' }} />
                  <span className="text-white/80 font-medium">Verlichte straten</span>
                </div>
              </div>
            </motion.div>

            {/* Filter FAB - appears after intro completes */}
            <AnimatePresence>
              {introPhase === "COMPLETE" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 20 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="absolute bottom-6 right-6 z-[9999] flex flex-col items-end gap-2"
                >
                  {/* Filter panel - expands upward */}
                  <AnimatePresence>
                    {filterOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="bg-[#0f2d2d]/95 backdrop-blur-sm border border-white/10 rounded-xl p-3 shadow-2xl min-w-[180px]"
                      >
                        <p className="text-white/60 text-xs font-medium mb-2 uppercase tracking-wide">Filter</p>
                        <div className="space-y-1">
                          {/* Mosques filter */}
                          <button
                            onClick={() => toggleFilter('mosques')}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                              activeFilters.mosques
                                ? 'bg-emerald-500/20 border border-emerald-500/40'
                                : 'bg-white/5 border border-white/10 opacity-50'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded-full ${activeFilters.mosques ? 'bg-emerald-500' : 'bg-white/20'}`} />
                            <span className="text-white text-sm font-medium">Moskeeën</span>
                          </button>

                          {/* Food filter */}
                          <button
                            onClick={() => toggleFilter('food')}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                              activeFilters.food
                                ? 'bg-amber-500/20 border border-amber-500/40'
                                : 'bg-white/5 border border-white/10 opacity-50'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded-full ${activeFilters.food ? 'bg-amber-500' : 'bg-white/20'}`} />
                            <span className="text-white text-sm font-medium">Eten & Drinken</span>
                          </button>

                          {/* Shops filter */}
                          <button
                            onClick={() => toggleFilter('shops')}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                              activeFilters.shops
                                ? 'bg-purple-500/20 border border-purple-500/40'
                                : 'bg-white/5 border border-white/10 opacity-50'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded-full ${activeFilters.shops ? 'bg-purple-500' : 'bg-white/20'}`} />
                            <span className="text-white text-sm font-medium">Winkels</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* FAB button */}
                  <motion.button
                    onClick={() => setFilterOpen(!filterOpen)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all ${
                      filterOpen
                        ? 'bg-gold text-[#0f2d2d]'
                        : 'bg-[#0f2d2d] border-2 border-white/20 text-white hover:border-gold/50'
                    }`}
                  >
                    {filterOpen ? (
                      <ChevronUp className="w-6 h-6" />
                    ) : (
                      <Filter className="w-5 h-5" />
                    )}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

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
