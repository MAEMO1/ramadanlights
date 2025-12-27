# Claude Code Instructions for Ramadan Lights

## Project Overview
Ramadan Lights Gent - A Next.js website for the Ramadan lighting initiative in Ghent, Belgium.

## Icon System Rules (MUST FOLLOW)

### Hierarchy
1. **Tabler Icons** (`@tabler/icons-react`) - Primary library
2. **Lucide** (`lucide-react`) - Only if Tabler lacks the icon
3. **Custom Figma SVGs** (`src/icons/map-markers/`) - Only for map markers

### DO's
- Use `IconBuildingMosque` from Tabler for mosque icons
- Use icons from `src/icons/index.ts` exports
- For map markers: use SVGs from `src/icons/map-markers/`
- Follow 24x24 grid, 2px stroke for any new icons
- Use `currentColor` for theming support

### DON'Ts
- NEVER create inline SVG icons in components
- NEVER mix icon libraries in the same component
- NEVER use emoji as icons (use proper SVG icons)
- NEVER generate/draw new SVG icons - request Figma export instead

### Map Marker Sizes (Leaflet)
| Tier         | Width | Height |
|--------------|-------|--------|
| Premium      | 48px  | 60px   |
| Partner Plus | 42px  | 52px   |
| Partner      | 36px  | 44px   |
| Free         | 30px  | 38px   |

### Color Palette for Tiers
```
Premium:      #FFD700 → #FFA500 (gold gradient)
Partner Plus: #14B8A6 → #0D9488 (teal gradient)
Partner:      #8B5CF6 → #7C3AED (purple gradient)
Free:         #6B7280 → #4B5563 (gray gradient)
```

## Code Conventions

### Imports
```tsx
// Preferred: Import from central icon index
import { IconBuildingMosque, IconStar } from '@/icons';

// For map markers (after Figma export)
import PremiumMarker from '@/icons/map-markers/premium-marker.svg';
```

### Component Patterns
- Use Tailwind CSS for styling
- Use Framer Motion for animations
- Use Leaflet for maps
- Use Supabase for backend

## File Structure
```
src/
├── icons/
│   ├── index.ts          # Central exports
│   ├── svg.d.ts          # TypeScript declarations
│   └── map-markers/      # Custom Figma-exported markers
├── components/           # React components
├── lib/                  # Utilities and types
└── app/                  # Next.js App Router pages
```

## When Adding New Icons
1. Check Tabler first: https://tabler.io/icons
2. If not in Tabler, check Lucide: https://lucide.dev
3. If custom needed: design in Figma, export SVG, place in `src/icons/map-markers/`
4. Add export to `src/icons/index.ts`
