/**
 * Icon System for Ramadan Lights
 *
 * This folder contains custom icons exported from Figma.
 *
 * WORKFLOW:
 * 1. Design icons in Figma (24x24 grid, 2px stroke for consistency)
 * 2. Export as SVG from Figma
 * 3. Place SVG files in appropriate subfolder:
 *    - /map-markers  → Custom map pin icons
 *    - /ui           → UI icons (if Lucide doesn't have what you need)
 * 4. Import in code: import IconName from '@/icons/map-markers/icon-name.svg'
 *
 * DESIGN GUIDELINES:
 * - Grid: 24x24 for UI icons, 48x60 for map markers
 * - Stroke: 2px consistent
 * - Colors: Use currentColor for fill/stroke to support theming
 * - Padding: 2px internal padding from edges
 */

// Re-export Lucide icons that we use frequently (for convenience)
export {
  MapPin,
  Mail,
  Instagram,
  Facebook,
  X,
  ChevronDown,
  ChevronRight,
  Check,
  AlertCircle,
  Info,
  Star,
  Heart,
  Phone,
  Clock,
  Calendar,
  Users,
  ExternalLink,
  Menu,
  Search,
} from 'lucide-react';

// Map marker icons will be exported here after Figma export
// Example: export { default as PremiumMarker } from './map-markers/premium-marker.svg';
