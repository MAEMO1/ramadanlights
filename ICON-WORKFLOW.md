# Figma → Code Icon Workflow

## Setup (one-time)

### 1. Authenticate the Figma MCP Server

The Figma MCP server is already configured. To authenticate:

```bash
# Start authentication (opens a browser)
claude mcp auth figma
```

After authentication, Claude can pull icons directly from your Figma files.

### 2. Installed tools

- **@svgr/webpack** — Converts SVG to React components
- **svgo** — Automatically optimizes SVGs

---

## Workflow: Icon from Figma to Code

### Option A: Via Claude (recommended)

1. Open Figma and select your icon/frame
2. Copy the Figma URL (e.g. `https://figma.com/file/xxx?node-id=123`)
3. Ask Claude:

   ```
   Export this icon as a React component: [paste URL]
   Place it in src/icons/map-markers/
   ```

Claude fetches the design via the MCP server and generates an optimized component.

### Option B: Manual

1. **Export from Figma**
   - Select the icon frame
   - Export as SVG (1x)
   - Use “Include 'id' attribute” for complex icons

2. **Place in the project**

   ```
   src/icons/
   ├── map-markers/     → Map pin icons
   │   ├── premium-marker.svg
   │   ├── partner-marker.svg
   │   └── ...
   └── ui/              → Custom UI icons (only if Tabler/Lucide lack what you need)
   ```

3. **Import in code**

   ```tsx
   import PremiumMarker from '@/icons/map-markers/premium-marker.svg';

   // As a React component
   <PremiumMarker className="w-6 h-6 text-amber-500" />

   // For Leaflet markers
   import { createLeafletIcon } from '@/icons/map-markers/createLeafletIcon';
   const icon = createLeafletIcon(PremiumMarker, { width: 48, height: 60 });
   ```

---

## Design Guidelines

### UI Icons (24×24)

- Grid: 24×24px
- Stroke: 2px
- Padding: 2px from edges
- Colors: Use `currentColor` for theming

### Map Markers (48×60)

- ViewBox: 48×60px
- Pin anchor: center-bottom
- Tier sizes:

  | Tier         | Width | Height |
  |--------------|-------|--------|
  | Premium      | 48px  | 60px   |
  | Partner Plus | 42px  | 52px   |
  | Partner      | 36px  | 44px   |
  | Free         | 30px  | 38px   |

### Color palette

```
Premium:      #FFD700 (gold) → #FFA500 (orange)
Partner Plus: #14B8A6 (teal) → #0D9488 (dark teal)
Partner:      #8B5CF6 (purple) → #7C3AED (dark purple)
Free:         #6B7280 (gray) → #4B5563 (dark gray)
```

---

## File Structure

```
src/icons/
├── index.ts              → Central exports + Lucide re-exports
├── svg.d.ts              → TypeScript declarations
├── map-markers/
│   ├── createLeafletIcon.ts  → Helper for Leaflet conversion
│   ├── premium-marker.svg
│   ├── partner-plus-marker.svg
│   └── ...
└── ui/
    └── (custom UI icons if needed)
```

---

## Claude Instructions (for consistency)

Add this to your project `CLAUDE.md` or `.claude/settings.json`:

```text
ICON RULES:
- UI icons: use Tabler (@tabler/icons-react) first; use Lucide (lucide-react) only if Tabler does not have the icon
- Always import UI icons via src/icons/index.ts exports
- Map markers: only use icons from src/icons/map-markers/ (Figma-exported)
- NEVER generate inline SVGs inside components
- New icons must go through the Figma → SVGR workflow
- Design specs: 24×24 grid, 2px stroke, currentColor
```

---

## Troubleshooting

### SVG does not import as a component

Check that `next.config.js` includes the SVGR webpack config.

### Icon is too big / too small

Use the `width` and `height` props, or Tailwind classes (`w-6 h-6`).

### Colors do not apply

Make sure the SVG uses `currentColor` instead of hardcoded colors.

Replace in Figma: `fill="#000000"` → `fill="currentColor"`
