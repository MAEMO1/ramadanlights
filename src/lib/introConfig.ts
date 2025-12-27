/**
 * Cinematic intro configuration for Ramadan Lights map
 * Controls timing, easing, and phase definitions for the GSAP + PixiJS intro sequence
 */

export type IntroPhase =
  | "IDLE"
  | "PRELOAD"
  | "BEAMS_SWIRL"
  | "BEAMS_LAND"
  | "STREETS_GLOW"
  | "MOSQUES_RISE"
  | "SPONSORS_WAVE"
  | "COMPLETE";

export interface PhaseConfig {
  duration: number; // in seconds
  label: string;
}

export const INTRO_PHASES: Record<IntroPhase, PhaseConfig> = {
  IDLE: { duration: 0, label: "Idle" },
  PRELOAD: { duration: 0.5, label: "Loading" },
  BEAMS_SWIRL: { duration: 2.5, label: "Light beams swirling" },
  BEAMS_LAND: { duration: 1.5, label: "Beams landing" },
  STREETS_GLOW: { duration: 1.8, label: "Streets illuminating" }, // Extended for proper glow effect
  MOSQUES_RISE: { duration: 2.5, label: "Mosques appearing" }, // Extended for staggered animations
  SPONSORS_WAVE: { duration: 3.0, label: "Sponsors appearing" }, // Extended for tiered animations
  COMPLETE: { duration: 0, label: "Complete" },
};

// Calculate cumulative timing for timeline
export const PHASE_TIMELINE = {
  PRELOAD_START: 0,
  BEAMS_SWIRL_START: 0.5,
  BEAMS_LAND_START: 3.0,
  STREETS_GLOW_START: 4.5,
  MOSQUES_RISE_START: 6.3, // After streets have glowed (4.5 + 1.8)
  SPONSORS_WAVE_START: 8.8, // After mosques have appeared (6.3 + 2.5)
  COMPLETE_START: 11.8, // After sponsors (8.8 + 3.0)
};

// Easing functions for GSAP
export const EASING = {
  curtainReveal: "power3.inOut",
  beamFloat: "sine.inOut",
  beamTravel: "power2.out",
  streetFlash: "power4.out",
  mushroomPop: "elastic.out(1, 0.5)",
  markerBounce: "back.out(1.7)",
};

// Light beam configuration
export const BEAM_CONFIG = {
  count: 8, // Number of light particles
  centralGlow: {
    size: 120,
    color: 0xffd700, // Gold
    alpha: 0.9,
  },
  particle: {
    minSize: 20,
    maxSize: 40,
    color: 0xffd700,
    trailLength: 12,
  },
  swirl: {
    radius: 150, // Orbit radius in pixels
    speed: 1.5, // Rotations per phase duration
  },
  landing: {
    // Target positions (viewport percentages)
    targets: [
      { x: 0.7, y: 0.25 }, // Wondelgemstraat area
      { x: 0.3, y: 0.6 },  // Bevrijdingslaan area
    ],
  },
};

// Street glow flash configuration
export const STREET_FLASH_CONFIG = {
  duration: 0.3,
  intensity: 1.5,
  color: 0xffd700,
  blur: 40,
};

// Marker animation configuration
export const MARKER_CONFIG = {
  mosque: {
    delay: 0.2, // Small delay after phase starts
    stagger: 0.15, // More time between each mosque for dramatic effect
    scale: { from: 0, overshoot: 1.4, to: 1 },
    yOffset: 35, // Pixels to rise from
  },
  partner: {
    delay: 0, // Start of sponsors phase - simple appearance
    stagger: 0.03, // Quick, simple stagger
    scale: { from: 0, overshoot: 1.1, to: 1 }, // Minimal overshoot
    yOffset: 15,
  },
  partner_plus: {
    delay: 1.0, // 1s after sponsors phase starts
    stagger: 0.08, // More noticeable stagger
    scale: { from: 0, overshoot: 1.3, to: 1 },
    yOffset: 25,
  },
  premium: {
    delay: 2.0, // 2s after sponsors phase starts (last to appear)
    stagger: 0.15, // Dramatic stagger for premium sponsors
    scale: { from: 0, overshoot: 1.5, to: 1.15 }, // Premium stays 15% bigger
    yOffset: 40,
  },
};

// Reduced motion: skip to complete with instant reveals
export const REDUCED_MOTION_CONFIG = {
  skipToPhase: "STREETS_GLOW" as IntroPhase,
  fadeDuration: 0.3,
  markerFadeDuration: 0.5,
};

// Mobile optimizations
export const MOBILE_CONFIG = {
  beamCount: 4, // Fewer particles on mobile
  disableTrails: true,
  reducedGlowLayers: true,
};

// Colors palette
export const COLORS = {
  gold: 0xffd700,
  goldLight: 0xffe55c,
  goldDark: 0xffa500,
  teal: 0x14b8a6,
  green: 0x10b981,
  purple: 0x8b5cf6,
  nightBlue: 0x1a1a2e,
  darkBg: 0x0a1a1a,
};
