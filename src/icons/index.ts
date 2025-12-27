/**
 * Icon System for Ramadan Lights
 *
 * HIERARCHY:
 * 1. Tabler Icons (@tabler/icons-react) - Primary library, includes mosque icon
 * 2. Lucide (lucide-react) - Secondary, for icons Tabler doesn't have
 * 3. Custom SVGs from Figma (src/icons/map-markers/) - Only for map markers
 *
 * WORKFLOW FOR CUSTOM ICONS:
 * 1. Design icons in Figma (24x24 grid, 2px stroke for consistency)
 * 2. Export as SVG from Figma
 * 3. Place SVG files in /map-markers subfolder
 * 4. Import: import IconName from '@/icons/map-markers/icon-name.svg'
 *
 * DESIGN GUIDELINES:
 * - Grid: 24x24 for UI icons, 48x60 for map markers
 * - Stroke: 2px consistent (matches Tabler)
 * - Colors: Use currentColor for fill/stroke to support theming
 * - Padding: 2px internal padding from edges
 */

// =============================================================================
// TABLER ICONS (Primary - 5000+ icons, includes mosque)
// Full list: https://tabler.io/icons
// =============================================================================
export {
  // Buildings & Places
  IconBuildingMosque,
  IconBuilding,
  IconHome,
  IconMapPin,
  IconMap,

  // Actions
  IconCheck,
  IconX,
  IconPlus,
  IconMinus,
  IconSearch,
  IconMenu2,
  IconExternalLink,

  // Communication
  IconMail,
  IconPhone,
  IconBrandInstagram,
  IconBrandFacebook,

  // UI Elements
  IconChevronDown,
  IconChevronRight,
  IconChevronLeft,
  IconChevronUp,
  IconAlertCircle,
  IconInfoCircle,

  // Objects
  IconStar,
  IconStarFilled,
  IconHeart,
  IconHeartFilled,
  IconCrown,
  IconAward,
  IconTrophy,

  // Time & Calendar
  IconClock,
  IconCalendar,
  IconUsers,

  // Food & Shopping (for sponsor categories)
  IconToolsKitchen2,
  IconShoppingBag,
  IconCoffee,
  IconMeat,
  IconSoup,
} from '@tabler/icons-react';

// =============================================================================
// LUCIDE ICONS (Secondary - only if Tabler doesn't have it)
// =============================================================================
export {
  // Keep minimal - only icons we actually use that Tabler lacks
  Loader2 as IconLoader, // Spinning loader
} from 'lucide-react';

// =============================================================================
// CUSTOM MAP MARKERS (from Figma)
// =============================================================================
// Export after Figma design is complete:
// export { default as PremiumMarker } from './map-markers/premium-marker.svg';
// export { default as PartnerPlusMarker } from './map-markers/partner-plus-marker.svg';
// export { default as PartnerMarker } from './map-markers/partner-marker.svg';
// export { default as MosqueMarker } from './map-markers/mosque-marker.svg';
