import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import type { FC, SVGProps } from 'react';

type SVGComponent = FC<SVGProps<SVGSVGElement>>;

interface CreateLeafletIconOptions {
  width: number;
  height: number;
  anchorX?: number; // defaults to width/2
  anchorY?: number; // defaults to height
  popupAnchorX?: number; // defaults to 0
  popupAnchorY?: number; // defaults to -height + 10
  className?: string;
  color?: string; // passed to the SVG component
}

/**
 * Converts a React SVG component (from Figma) into a Leaflet icon
 *
 * Usage:
 * import PremiumMarker from '@/icons/map-markers/premium-marker.svg';
 * const icon = createLeafletIcon(PremiumMarker, { width: 48, height: 60 });
 */
export function createLeafletIcon(
  SvgComponent: SVGComponent,
  options: CreateLeafletIconOptions
): L.Icon {
  const {
    width,
    height,
    anchorX = width / 2,
    anchorY = height,
    popupAnchorX = 0,
    popupAnchorY = -height + 10,
    className,
    color,
  } = options;

  // Render React component to static markup
  const svgMarkup = renderToStaticMarkup(
    SvgComponent({
      width,
      height,
      style: color ? { color } : undefined,
      className,
    })
  );

  // Convert to data URL
  const svgUrl = `data:image/svg+xml,${encodeURIComponent(svgMarkup)}`;

  return L.icon({
    iconUrl: svgUrl,
    iconSize: [width, height],
    iconAnchor: [anchorX, anchorY],
    popupAnchor: [popupAnchorX, popupAnchorY],
  });
}

/**
 * Preset sizes for different marker tiers
 */
export const markerSizes = {
  premium: { width: 48, height: 60 },
  partner_plus: { width: 42, height: 52 },
  partner: { width: 36, height: 44 },
  free: { width: 30, height: 38 },
} as const;
