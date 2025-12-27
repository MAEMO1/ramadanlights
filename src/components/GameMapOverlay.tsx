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

// Game-style 2D SVG icons - Night blue + warm gold palette with thick outlines
// Each icon has: thick strokes, highlight top-left, shadow bottom-right, readable at 24px
const categoryIcons: Record<string, string> = {
  // Food categories - Game-style restaurant/food icons
  restaurant: `<svg viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="rest-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFE4A0"/>
        <stop offset="100%" stop-color="#FFD700"/>
      </linearGradient>
    </defs>
    <path d="M22 10v20c0 3.5 2.5 6.5 6 7.5V54h8V37.5c3.5-1 6-4 6-7.5V10h-4v18c0 2-1 3-2 3h-8c-1 0-2-1-2-3V10h-4z" fill="url(#rest-grad)" stroke="#1a1a2e" stroke-width="3"/>
    <circle cx="47" cy="15" r="8" fill="url(#rest-grad)" stroke="#1a1a2e" stroke-width="3"/>
    <path d="M47 23v31" stroke="#1a1a2e" stroke-width="6" stroke-linecap="round"/>
    <path d="M47 23v31" stroke="url(#rest-grad)" stroke-width="3" stroke-linecap="round"/>
    <circle cx="22" cy="10" r="2" fill="#FFF5D4"/>
  </svg>`,

  bakery: `<svg viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="bake-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFE4A0"/>
        <stop offset="100%" stop-color="#D4A574"/>
      </linearGradient>
    </defs>
    <ellipse cx="32" cy="40" rx="20" ry="12" fill="url(#bake-grad)" stroke="#1a1a2e" stroke-width="3"/>
    <path d="M16 35c0-8 7-15 16-15s16 7 16 15" fill="url(#bake-grad)" stroke="#1a1a2e" stroke-width="3"/>
    <path d="M22 32c0-4 4-8 10-8s10 4 10 8" fill="#8B6914" opacity="0.3"/>
    <ellipse cx="32" cy="16" rx="4" ry="3" fill="#FFD700" stroke="#1a1a2e" stroke-width="2"/>
    <path d="M28 16c2-4 6-4 8 0" stroke="#1a1a2e" stroke-width="2" fill="none"/>
    <circle cx="18" cy="30" r="1.5" fill="#FFF5D4"/>
  </svg>`,

  butcher: `<svg viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="meat-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FF8A8A"/>
        <stop offset="100%" stop-color="#C44"/>
      </linearGradient>
    </defs>
    <ellipse cx="36" cy="34" rx="18" ry="14" fill="url(#meat-grad)" stroke="#1a1a2e" stroke-width="3"/>
    <ellipse cx="36" cy="34" rx="10" ry="7" fill="#FFB4B4" opacity="0.5"/>
    <path d="M12 12L22 28" stroke="#1a1a2e" stroke-width="6" stroke-linecap="round"/>
    <path d="M12 12L22 28" stroke="#8B7355" stroke-width="4" stroke-linecap="round"/>
    <circle cx="12" cy="12" r="4" fill="#1a1a2e"/>
    <circle cx="20" cy="30" r="1.5" fill="#FFF5D4"/>
  </svg>`,

  supermarket: `<svg viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="cart-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#5EEAD4"/>
        <stop offset="100%" stop-color="#14B8A6"/>
      </linearGradient>
    </defs>
    <path d="M10 12h6l8 28h24l6-20H20" fill="none" stroke="#1a1a2e" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M10 12h6l8 28h24l6-20H20" fill="none" stroke="url(#cart-grad)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="24" cy="50" r="5" fill="url(#cart-grad)" stroke="#1a1a2e" stroke-width="3"/>
    <circle cx="44" cy="50" r="5" fill="url(#cart-grad)" stroke="#1a1a2e" stroke-width="3"/>
    <rect x="26" y="24" width="14" height="10" rx="2" fill="#FFD700" stroke="#1a1a2e" stroke-width="2"/>
    <circle cx="16" cy="14" r="1.5" fill="#A7F3D0"/>
  </svg>`,

  catering: `<svg viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="cater-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFE4A0"/>
        <stop offset="100%" stop-color="#FFD700"/>
      </linearGradient>
    </defs>
    <ellipse cx="32" cy="44" rx="22" ry="8" fill="#1a1a2e"/>
    <ellipse cx="32" cy="42" rx="22" ry="8" fill="url(#cater-grad)" stroke="#1a1a2e" stroke-width="3"/>
    <path d="M12 42c0-12 9-24 20-24s20 12 20 24" fill="url(#cater-grad)" stroke="#1a1a2e" stroke-width="3"/>
    <ellipse cx="32" cy="14" rx="3" ry="4" fill="#FFD700" stroke="#1a1a2e" stroke-width="2"/>
    <path d="M32 10v-4" stroke="#FFD700" stroke-width="3" stroke-linecap="round"/>
    <circle cx="16" cy="32" r="1.5" fill="#FFF5D4"/>
  </svg>`,

  cafe: `<svg viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="cafe-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#A78BFA"/>
        <stop offset="100%" stop-color="#8B5CF6"/>
      </linearGradient>
      <linearGradient id="coffee-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#8B6914"/>
        <stop offset="100%" stop-color="#5C4A1A"/>
      </linearGradient>
    </defs>
    <rect x="12" y="22" width="30" height="28" rx="4" fill="url(#cafe-grad)" stroke="#1a1a2e" stroke-width="3"/>
    <path d="M42 28h8c4 0 6 4 6 8s-2 8-6 8h-8" stroke="#1a1a2e" stroke-width="3" fill="url(#cafe-grad)"/>
    <ellipse cx="27" cy="26" rx="12" ry="3" fill="url(#coffee-grad)" stroke="#1a1a2e" stroke-width="2"/>
    <path d="M20 14c2-4 4-4 6 0M28 12c2-4 4-4 6 0" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round"/>
    <rect x="8" y="50" width="38" height="4" rx="2" fill="#1a1a2e"/>
    <circle cx="16" cy="26" r="1.5" fill="#C4B5FD"/>
  </svg>`,

  // Shop categories - Game-style retail icons
  decor: `<svg viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="decor-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFE4A0"/>
        <stop offset="100%" stop-color="#FFD700"/>
      </linearGradient>
    </defs>
    <path d="M32 6l-16 20v28h32V26L32 6z" fill="url(#decor-grad)" stroke="#1a1a2e" stroke-width="3" stroke-linejoin="round"/>
    <rect x="26" y="38" width="12" height="16" fill="#1a1a2e"/>
    <circle cx="32" cy="20" r="6" fill="#1a1a2e"/>
    <path d="M28 20l4 4 4-4M32 28v-4" stroke="#FFD700" stroke-width="2" stroke-linecap="round"/>
    <rect x="20" y="28" width="6" height="8" rx="1" fill="#A78BFA" stroke="#1a1a2e" stroke-width="2"/>
    <rect x="38" y="28" width="6" height="8" rx="1" fill="#5EEAD4" stroke="#1a1a2e" stroke-width="2"/>
    <circle cx="20" cy="16" r="1.5" fill="#FFF5D4"/>
  </svg>`,

  clothing: `<svg viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="cloth-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#A78BFA"/>
        <stop offset="100%" stop-color="#8B5CF6"/>
      </linearGradient>
    </defs>
    <path d="M24 8l-14 12 6 6 4-4v32h24V22l4 4 6-6L40 8c-2 4-6 6-8 6s-6-2-8-6z" fill="url(#cloth-grad)" stroke="#1a1a2e" stroke-width="3" stroke-linejoin="round"/>
    <path d="M28 8c2 3 5 4 4 4s2-1 4-4" stroke="#1a1a2e" stroke-width="2"/>
    <ellipse cx="32" cy="8" rx="8" ry="3" fill="#E9D5FF" stroke="#1a1a2e" stroke-width="2"/>
    <rect x="28" y="30" width="8" height="18" rx="1" fill="#FFD700" opacity="0.5"/>
    <circle cx="14" cy="16" r="1.5" fill="#C4B5FD"/>
  </svg>`,

  spiritual: `<svg viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="spirit-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#5EEAD4"/>
        <stop offset="100%" stop-color="#14B8A6"/>
      </linearGradient>
    </defs>
    <path d="M32 6L10 18v22c0 10 10 16 22 16s22-6 22-16V18L32 6z" fill="url(#spirit-grad)" stroke="#1a1a2e" stroke-width="3" stroke-linejoin="round"/>
    <path d="M24 32l6 6 12-12" stroke="#FFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="32" cy="18" r="3" fill="#FFD700" stroke="#1a1a2e" stroke-width="2"/>
    <circle cx="16" cy="22" r="1.5" fill="#A7F3D0"/>
  </svg>`,

  gifts: `<svg viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="gift-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FF8A8A"/>
        <stop offset="100%" stop-color="#EF4444"/>
      </linearGradient>
    </defs>
    <rect x="10" y="26" width="44" height="30" rx="4" fill="url(#gift-grad)" stroke="#1a1a2e" stroke-width="3"/>
    <rect x="10" y="18" width="44" height="12" rx="3" fill="#FFD700" stroke="#1a1a2e" stroke-width="3"/>
    <rect x="28" y="18" width="8" height="38" fill="#FFD700" stroke="#1a1a2e" stroke-width="2"/>
    <path d="M22 18c0-8 5-12 10-8M42 18c0-8-5-12-10-8" stroke="#FFD700" stroke-width="4" stroke-linecap="round"/>
    <ellipse cx="32" cy="10" rx="4" ry="3" fill="#FFD700" stroke="#1a1a2e" stroke-width="2"/>
    <circle cx="14" cy="22" r="1.5" fill="#FEF3C7"/>
  </svg>`,

  beauty: `<svg viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="beauty-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#F9A8D4"/>
        <stop offset="100%" stop-color="#EC4899"/>
      </linearGradient>
    </defs>
    <ellipse cx="32" cy="40" rx="16" ry="18" fill="url(#beauty-grad)" stroke="#1a1a2e" stroke-width="3"/>
    <ellipse cx="32" cy="36" rx="10" ry="10" fill="#FDF2F8" opacity="0.4"/>
    <rect x="26" y="8" width="12" height="16" rx="6" fill="url(#beauty-grad)" stroke="#1a1a2e" stroke-width="3"/>
    <circle cx="32" cy="14" r="3" fill="#FFD700"/>
    <path d="M28 24h8" stroke="#1a1a2e" stroke-width="2"/>
    <circle cx="20" cy="32" r="1.5" fill="#FBCFE8"/>
  </svg>`,

  kids: `<svg viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="kids-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FCD34D"/>
        <stop offset="100%" stop-color="#F59E0B"/>
      </linearGradient>
    </defs>
    <circle cx="32" cy="18" r="12" fill="url(#kids-grad)" stroke="#1a1a2e" stroke-width="3"/>
    <circle cx="28" cy="16" r="2" fill="#1a1a2e"/>
    <circle cx="36" cy="16" r="2" fill="#1a1a2e"/>
    <path d="M28 22c2 2 6 2 8 0" stroke="#1a1a2e" stroke-width="2" stroke-linecap="round"/>
    <rect x="22" y="30" width="20" height="24" rx="4" fill="#A78BFA" stroke="#1a1a2e" stroke-width="3"/>
    <rect x="14" y="34" width="8" height="12" rx="2" fill="#5EEAD4" stroke="#1a1a2e" stroke-width="2"/>
    <rect x="42" y="34" width="8" height="12" rx="2" fill="#5EEAD4" stroke="#1a1a2e" stroke-width="2"/>
    <circle cx="24" cy="12" r="1.5" fill="#FEF3C7"/>
  </svg>`,

  tech: `<svg viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="tech-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#60A5FA"/>
        <stop offset="100%" stop-color="#3B82F6"/>
      </linearGradient>
    </defs>
    <rect x="16" y="8" width="32" height="48" rx="4" fill="#1a1a2e" stroke="#1a1a2e" stroke-width="3"/>
    <rect x="20" y="14" width="24" height="34" rx="2" fill="url(#tech-grad)"/>
    <circle cx="32" cy="54" r="3" fill="#374151"/>
    <rect x="24" y="18" width="16" height="8" rx="1" fill="#1a1a2e" opacity="0.3"/>
    <circle cx="36" cy="30" r="4" fill="#FFD700"/>
    <circle cx="22" cy="16" r="1.5" fill="#93C5FD"/>
  </svg>`,

  other: `<svg viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="other-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#9CA3AF"/>
        <stop offset="100%" stop-color="#6B7280"/>
      </linearGradient>
    </defs>
    <rect x="8" y="24" width="48" height="28" rx="4" fill="url(#other-grad)" stroke="#1a1a2e" stroke-width="3"/>
    <rect x="8" y="16" width="48" height="12" rx="3" fill="#374151" stroke="#1a1a2e" stroke-width="3"/>
    <rect x="16" y="32" width="12" height="12" rx="2" fill="#FFD700" stroke="#1a1a2e" stroke-width="2"/>
    <rect x="36" y="32" width="12" height="12" rx="2" fill="#5EEAD4" stroke="#1a1a2e" stroke-width="2"/>
    <circle cx="14" cy="20" r="1.5" fill="#D1D5DB"/>
  </svg>`,

  // Mosque icon - Iconic dome and minaret with gold crescent
  mosque: `<svg viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="mosque-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#34D399"/>
        <stop offset="100%" stop-color="#10B981"/>
      </linearGradient>
      <linearGradient id="mosque-dark" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#065F46"/>
        <stop offset="100%" stop-color="#064E3B"/>
      </linearGradient>
    </defs>
    <rect x="12" y="36" width="40" height="20" fill="url(#mosque-grad)" stroke="#1a1a2e" stroke-width="3"/>
    <path d="M12 36c0-14 10-22 20-22s20 8 20 22" fill="url(#mosque-grad)" stroke="#1a1a2e" stroke-width="3"/>
    <rect x="6" y="20" width="6" height="36" fill="url(#mosque-dark)" stroke="#1a1a2e" stroke-width="2"/>
    <rect x="52" y="20" width="6" height="36" fill="url(#mosque-dark)" stroke="#1a1a2e" stroke-width="2"/>
    <path d="M9 20l-3-8 6 0z" fill="#FFD700" stroke="#1a1a2e" stroke-width="2"/>
    <path d="M55 20l-3-8 6 0z" fill="#FFD700" stroke="#1a1a2e" stroke-width="2"/>
    <circle cx="32" cy="18" r="5" fill="#FFD700" stroke="#1a1a2e" stroke-width="2"/>
    <path d="M34 18a3 3 0 1 1-4-3" fill="none" stroke="#1a1a2e" stroke-width="1.5"/>
    <rect x="26" y="40" width="12" height="16" rx="6 6 0 0" fill="url(#mosque-dark)" stroke="#1a1a2e" stroke-width="2"/>
    <circle cx="16" cy="30" r="1.5" fill="#A7F3D0"/>
  </svg>`,
};

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

// Create professional game-style marker with enhanced container and glow effects
const createGameMarker = (
  category: string,
  tier: PartnerTier | "mosque"
) => {
  const config = tierSizes[tier];
  const colors = tierColors[tier];
  const iconSvg = categoryIcons[category] || categoryIcons.other;
  const size = config.size;
  const iconSize = Math.round(size * 0.6); // Larger icon ratio for new detailed icons
  const borderWidth = tier === "premium" || tier === "mosque" ? 4 : 3;

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
    <div class="game-marker-icon tier-${tier}" data-category="${category}" style="
      width: ${size}px;
      height: ${size}px;
      position: relative;
      cursor: pointer;
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
        ">${tier === "premium" ? "⭐ " : tier === "mosque" ? "🕌 " : ""}${tierLabel}</span>
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

export function GameMapOverlay({ isOpen, onClose, foodPartners, shopPartners, mosques = [] }: GameMapOverlayProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const routeLayersRef = useRef<L.Polyline[]>([]);
  const connectorLinesRef = useRef<L.Polyline[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(14);

  // Animation phases:
  // 0=curtains, 1=lights floating, 2=lights traveling, 3=streets glowing,
  // 4=mosques appearing, 5=small sponsors, 6=medium sponsors, 7=large sponsors, 8=complete
  const [animationPhase, setAnimationPhase] = useState(0);

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
      setAnimationPhase(0); // Reset animation
    }
  }, [isOpen]);

  // Animation sequence controller - Extended with floating lights and sequential icon appearance
  useEffect(() => {
    if (!isOpen) return;

    // Phase 0: Curtains opening (0-0.8s)
    // Phase 1: Lights appear and float around (0.8-3.5s) - 2.7s floating
    const phase1Timer = setTimeout(() => setAnimationPhase(1), 800);
    // Phase 2: Lights travel to streets (3.5-5.5s)
    const phase2Timer = setTimeout(() => setAnimationPhase(2), 3500);
    // Phase 3: Streets illuminate (5.5-7s)
    const phase3Timer = setTimeout(() => setAnimationPhase(3), 5500);
    // Phase 4: Mosques appear like mushrooms (7-8.5s)
    const phase4Timer = setTimeout(() => setAnimationPhase(4), 7000);
    // Phase 5: Small sponsors appear (8.5-9.5s) - partner tier
    const phase5Timer = setTimeout(() => setAnimationPhase(5), 8500);
    // Phase 6: Medium sponsors appear (9.5-10.5s) - partner_plus tier
    const phase6Timer = setTimeout(() => setAnimationPhase(6), 9500);
    // Phase 7: Large sponsors appear with overshoot (10.5-12s) - premium tier
    const phase7Timer = setTimeout(() => setAnimationPhase(7), 10500);
    // Phase 8: Animation complete
    const phase8Timer = setTimeout(() => setAnimationPhase(8), 12000);

    return () => {
      clearTimeout(phase1Timer);
      clearTimeout(phase2Timer);
      clearTimeout(phase3Timer);
      clearTimeout(phase4Timer);
      clearTimeout(phase5Timer);
      clearTimeout(phase6Timer);
      clearTimeout(phase7Timer);
      clearTimeout(phase8Timer);
    };
  }, [isOpen]);

  // Add routes - glow brighter when zooming out and based on animation phase
  useEffect(() => {
    if (!mapRef.current || !mapReady) return;

    routeLayersRef.current.forEach(layer => mapRef.current?.removeLayer(layer));
    routeLayersRef.current = [];

    // Don't show routes until animation phase 3 (streets illumination)
    if (animationPhase < 3) return;

    // Calculate glow intensity based on zoom (brighter when zoomed out)
    // Zoom 14 = normal, zoom 10 = max glow
    const glowMultiplier = Math.max(1, 1 + (14 - zoomLevel) * 0.35); // Stronger glow when zoomed out
    const weightMultiplier = Math.max(1, 1 + (14 - zoomLevel) * 0.2); // Thicker lines when zoomed out

    // Animation intensity - starts bright and settles
    const animIntensity = animationPhase === 3 ? 1.8 : 1;

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
  }, [mapReady, zoomLevel, animationPhase]);

  // Add markers - sequential appearance by tier (mosques → small → medium → large)
  useEffect(() => {
    if (!mapRef.current || !mapReady) return;

    // Clear existing markers and connector lines
    markersRef.current.forEach(marker => mapRef.current?.removeLayer(marker));
    markersRef.current = [];
    connectorLinesRef.current.forEach(line => mapRef.current?.removeLayer(line));
    connectorLinesRef.current = [];

    // Don't add markers until animation phase 4 (mosques start appearing)
    if (animationPhase < 4) return;

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

    // Filter markers based on animation phase (sequential appearance)
    // Phase 4: mosques, Phase 5: partner, Phase 6: partner_plus, Phase 7+: premium
    const visibleMarkers = allMarkers.filter(item => {
      if (item.tier === "mosque") return animationPhase >= 4;
      if (item.tier === "partner" || item.tier === "free") return animationPhase >= 5;
      if (item.tier === "partner_plus") return animationPhase >= 6;
      if (item.tier === "premium") return animationPhase >= 7;
      return false;
    });

    // Add markers with offset for those near illuminated streets
    visibleMarkers.forEach((item, index) => {
      const icon = createGameMarker(item.category, item.tier);
      const { position, original, wasOffset } = offsetMarkerPosition(item.lat, item.lng, index);
      const marker = L.marker(position, {
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
        // Draw connector line if marker was offset
        if (wasOffset) {
          const connectorLine = L.polyline([original, position], {
            color: tierColors[item.tier].border,
            weight: 2,
            opacity: 0.6,
            dashArray: "4, 6",
            lineCap: "round",
          });
          connectorLine.addTo(mapRef.current);
          connectorLinesRef.current.push(connectorLine);

          // Add small dot at original location to show real address
          const dotIcon = L.divIcon({
            className: "connector-dot",
            html: `<div style="
              width: 10px;
              height: 10px;
              background: ${tierColors[item.tier].border};
              border: 2px solid ${tierColors[item.tier].icon};
              border-radius: 50%;
              box-shadow: 0 0 6px ${tierColors[item.tier].glow};
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
  }, [mapReady, foodPartners, shopPartners, mosques, animationPhase]);

  // Add custom styles - scale markers based on zoom level (MUCH MORE AGGRESSIVE)
  useEffect(() => {
    if (!isOpen) return;

    // Calculate marker scale based on zoom (EXTREMELY small when zoomed out to keep streets visible)
    // Zoom 14 = 1.0, zoom 12 = 0.35, zoom 10 = 0.12, zoom 8 = 0.05
    const baseScale = Math.max(0.05, Math.min(1, Math.pow((zoomLevel - 7) / 7, 2)));

    // Premium markers should be 20% bigger after animation completes
    const premiumBonus = animationPhase >= 8 ? 1.2 : 1;

    const style = document.createElement("style");
    style.id = "game-map-styles";
    style.textContent = `
      /* Mushroom pop animations */
      @keyframes mushroomPop {
        0% { transform: scale(0) translateY(20px); opacity: 0; }
        50% { transform: scale(1.3) translateY(-5px); opacity: 1; }
        70% { transform: scale(0.9) translateY(2px); opacity: 1; }
        100% { transform: scale(1) translateY(0); opacity: 1; }
      }
      @keyframes mushroomPopMedium {
        0% { transform: scale(0) translateY(25px); opacity: 0; }
        50% { transform: scale(1.4) translateY(-8px); opacity: 1; }
        70% { transform: scale(0.85) translateY(3px); opacity: 1; }
        100% { transform: scale(1) translateY(0); opacity: 1; }
      }
      @keyframes mushroomPopLarge {
        0% { transform: scale(0) translateY(30px); opacity: 0; }
        40% { transform: scale(1.6) translateY(-12px); opacity: 1; }
        60% { transform: scale(1.1) translateY(5px); opacity: 1; }
        80% { transform: scale(1.25) translateY(-2px); opacity: 1; }
        100% { transform: scale(${premiumBonus}) translateY(0); opacity: 1; }
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

      .game-marker-icon {
        transform: scale(${baseScale}) !important;
        transform-origin: center center !important;
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), filter 0.3s ease !important;
        animation: mushroomPop 0.6s ease-out forwards;
      }

      .game-marker-icon.tier-partner,
      .game-marker-icon.tier-free {
        animation: mushroomPop 0.5s ease-out forwards;
      }
      .game-marker-icon.tier-partner_plus {
        animation: mushroomPopMedium 0.6s ease-out forwards;
      }
      .game-marker-icon.tier-premium {
        animation: mushroomPopLarge 0.8s ease-out forwards;
      }
      .game-marker-icon.tier-mosque {
        animation: mushroomPop 0.7s ease-out forwards;
      }

      /* Enhanced hover states with glow effects */
      .game-marker-icon:hover {
        transform: scale(${baseScale * 1.35}) !important;
        z-index: 9999 !important;
      }

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

      /* Active/selected state (when popup is open) */
      .leaflet-marker-icon:has(.game-popup-active) .game-marker-icon,
      .leaflet-popup-open .game-marker-icon {
        transform: scale(${baseScale * 1.4}) !important;
        filter: brightness(1.1);
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
        transform: scale(${baseScale}) !important;
        transition: transform 0.3s ease !important;
        animation: mushroomPop 0.4s ease-out forwards;
      }

      /* Icon inner glow on hover */
      .game-marker-icon:hover .marker-icon-wrapper svg {
        filter: drop-shadow(0 0 4px currentColor);
      }
    `;

    // Remove existing style first
    const existingStyle = document.getElementById("game-map-styles");
    if (existingStyle) existingStyle.remove();

    document.head.appendChild(style);

    return () => {
      const styleToRemove = document.getElementById("game-map-styles");
      if (styleToRemove) styleToRemove.remove();
    };
  }, [isOpen, zoomLevel, animationPhase]);

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

            {/* Light Beam Animation Overlay - Extended with floating phase */}
            {animationPhase >= 1 && animationPhase < 5 && (
              <div className="absolute inset-0 pointer-events-none z-[9998] overflow-hidden">
                {/* Phase 1: Central light source appears and pulses */}
                {animationPhase === 1 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 1, 1, 1],
                      scale: [0, 1.2, 0.9, 1.1],
                    }}
                    transition={{ duration: 2.5, times: [0, 0.2, 0.6, 1], repeat: Infinity, repeatType: "reverse" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  >
                    <div className="w-20 h-20 rounded-full bg-gold/90"
                      style={{ boxShadow: '0 0 80px 40px rgba(255, 215, 0, 0.7), 0 0 120px 60px rgba(255, 215, 0, 0.4)' }}
                    />
                  </motion.div>
                )}

                {/* Phase 1: Floating light particles orbiting around center */}
                {animationPhase === 1 && (
                  <>
                    {/* Floating light 1 - circular orbit */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: [0, 1, 1, 1],
                        x: ["50vw", "65vw", "50vw", "35vw", "50vw"],
                        y: ["40vh", "50vh", "60vh", "50vh", "40vh"],
                      }}
                      transition={{
                        duration: 2.7,
                        times: [0, 0.25, 0.5, 0.75, 1],
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute -translate-x-1/2 -translate-y-1/2"
                    >
                      <div className="w-6 h-6 rounded-full bg-gold"
                        style={{ boxShadow: '0 0 30px 12px rgba(255, 215, 0, 0.8), 0 0 60px 25px rgba(255, 215, 0, 0.4)' }}
                      />
                    </motion.div>

                    {/* Floating light 2 - opposite orbit */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: [0, 1, 1, 1],
                        x: ["50vw", "35vw", "50vw", "65vw", "50vw"],
                        y: ["60vh", "50vh", "40vh", "50vh", "60vh"],
                      }}
                      transition={{
                        duration: 2.7,
                        times: [0, 0.25, 0.5, 0.75, 1],
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute -translate-x-1/2 -translate-y-1/2"
                    >
                      <div className="w-6 h-6 rounded-full bg-gold"
                        style={{ boxShadow: '0 0 30px 12px rgba(255, 215, 0, 0.8), 0 0 60px 25px rgba(255, 215, 0, 0.4)' }}
                      />
                    </motion.div>

                    {/* Sparkle particles floating around - predefined positions */}
                    {[
                      { startX: 48, startY: 45, endX: 42, endY: 38 },
                      { startX: 52, startY: 48, endX: 58, endY: 42 },
                      { startX: 46, startY: 52, endX: 38, endY: 58 },
                      { startX: 54, startY: 55, endX: 62, endY: 52 },
                      { startX: 50, startY: 42, endX: 55, endY: 35 },
                      { startX: 47, startY: 58, endX: 40, endY: 62 },
                    ].map((pos, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                          opacity: [0, 1, 0],
                          scale: [0, 1, 0],
                          x: [`${pos.startX}vw`, `${pos.endX}vw`],
                          y: [`${pos.startY}vh`, `${pos.endY}vh`],
                        }}
                        transition={{
                          duration: 1.5,
                          delay: i * 0.4,
                          repeat: Infinity,
                          ease: "easeOut"
                        }}
                        className="absolute text-gold text-2xl"
                      >
                        ✦
                      </motion.div>
                    ))}
                  </>
                )}

                {/* Phase 2: Lights travel from center to streets */}
                {animationPhase === 2 && (
                  <>
                    {/* Central light fading out */}
                    <motion.div
                      initial={{ opacity: 1, scale: 1.1 }}
                      animate={{ opacity: [1, 0.5, 0], scale: [1.1, 1.5, 0] }}
                      transition={{ duration: 1.5 }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    >
                      <div className="w-20 h-20 rounded-full bg-gold/90"
                        style={{ boxShadow: '0 0 80px 40px rgba(255, 215, 0, 0.7), 0 0 120px 60px rgba(255, 215, 0, 0.4)' }}
                      />
                    </motion.div>

                    {/* Light beam 1 - traveling to Wondelgemstraat (top-right direction) */}
                    <motion.div
                      initial={{ opacity: 1, x: "50vw", y: "50vh" }}
                      animate={{
                        opacity: [1, 1, 1, 0.8, 0],
                        x: ["50vw", "55vw", "65vw", "75vw"],
                        y: ["50vh", "40vh", "25vh", "15vh"],
                      }}
                      transition={{ duration: 2, times: [0, 0.3, 0.7, 0.95, 1] }}
                      className="absolute -translate-x-1/2 -translate-y-1/2"
                    >
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gold"
                          style={{ boxShadow: '0 0 50px 20px rgba(255, 215, 0, 0.9), 0 0 100px 40px rgba(255, 215, 0, 0.5)' }}
                        />
                        <motion.div
                          animate={{ opacity: [0.9, 0.4, 0.9] }}
                          transition={{ duration: 0.2, repeat: Infinity }}
                          className="absolute -left-12 top-1/2 -translate-y-1/2 w-24 h-6 rounded-full"
                          style={{ background: 'linear-gradient(to left, rgba(255, 215, 0, 0.8), transparent)' }}
                        />
                      </div>
                    </motion.div>

                    {/* Light beam 2 - traveling to Bevrijdingslaan (bottom-left direction) */}
                    <motion.div
                      initial={{ opacity: 1, x: "50vw", y: "50vh" }}
                      animate={{
                        opacity: [1, 1, 1, 0.8, 0],
                        x: ["50vw", "42vw", "32vw", "22vw"],
                        y: ["50vh", "55vh", "58vh", "62vh"],
                      }}
                      transition={{ duration: 2, times: [0, 0.3, 0.7, 0.95, 1] }}
                      className="absolute -translate-x-1/2 -translate-y-1/2"
                    >
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gold"
                          style={{ boxShadow: '0 0 50px 20px rgba(255, 215, 0, 0.9), 0 0 100px 40px rgba(255, 215, 0, 0.5)' }}
                        />
                        <motion.div
                          animate={{ opacity: [0.9, 0.4, 0.9] }}
                          transition={{ duration: 0.2, repeat: Infinity }}
                          className="absolute -right-12 top-1/2 -translate-y-1/2 w-24 h-6 rounded-full"
                          style={{ background: 'linear-gradient(to right, rgba(255, 215, 0, 0.8), transparent)' }}
                        />
                      </div>
                    </motion.div>
                  </>
                )}

                {/* Phase 3: Street illumination flash effects */}
                {animationPhase >= 3 && (
                  <>
                    {/* Big flash for Wondelgemstraat */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0.5, 0.2, 0] }}
                      transition={{ duration: 1.5, times: [0, 0.1, 0.3, 0.6, 1] }}
                      className="absolute top-[10%] right-[15%] w-[40vw] h-[30vh]"
                      style={{
                        background: 'radial-gradient(ellipse at center, rgba(255, 215, 0, 0.6) 0%, rgba(255, 215, 0, 0.2) 40%, transparent 70%)',
                        filter: 'blur(30px)',
                      }}
                    />
                    {/* Big flash for Bevrijdingslaan */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0.5, 0.2, 0] }}
                      transition={{ duration: 1.5, times: [0, 0.1, 0.3, 0.6, 1] }}
                      className="absolute bottom-[25%] left-[10%] w-[40vw] h-[35vh]"
                      style={{
                        background: 'radial-gradient(ellipse at center, rgba(255, 215, 0, 0.6) 0%, rgba(255, 215, 0, 0.2) 40%, transparent 70%)',
                        filter: 'blur(30px)',
                      }}
                    />
                  </>
                )}
              </div>
            )}

            {/* Close Button - appears when mosques start appearing */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: animationPhase >= 4 ? 1 : 0, scale: animationPhase >= 4 ? 1 : 0.8 }}
              transition={{ duration: 0.3 }}
              onClick={onClose}
              className="absolute top-6 right-6 z-[9999] w-12 h-12 bg-[#0f2d2d] border-2 border-white/20 rounded-full flex items-center justify-center text-white hover:bg-[#1a4a4a] hover:border-white/40 transition-all shadow-2xl"
            >
              <X className="w-5 h-5" />
            </motion.button>

            {/* Title - appears when streets illuminate */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: animationPhase >= 3 ? 1 : 0, y: animationPhase >= 3 ? 0 : -20 }}
              transition={{ duration: 0.5 }}
              className="absolute top-6 left-6 z-[9999]"
            >
              <div className="bg-[#0f2d2d]/90 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-3 shadow-2xl">
                <h2 className="text-white font-display font-bold text-lg">Ramadan Lights Kaart</h2>
                <p className="text-white/60 text-sm">Moskeeën, restaurants & winkels in Gent</p>
              </div>
            </motion.div>

            {/* Legend - appears when streets illuminate */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: animationPhase >= 3 ? 1 : 0, y: animationPhase >= 3 ? 0 : 20 }}
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
