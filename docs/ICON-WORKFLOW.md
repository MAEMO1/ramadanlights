# Figma → Code Icon Workflow

## Setup (eenmalig)

### 1. Figma MCP Server authenticeren

De Figma MCP server is al geconfigureerd. Om te authenticeren:

```bash
# Start authenticatie (opent browser)
claude mcp auth figma
```

Na authenticatie kan Claude direct icons uit je Figma files halen.

### 2. Geïnstalleerde tools

- **@svgr/webpack** - Converteert SVG naar React components
- **svgo** - Optimaliseert SVG's automatisch

---

## Workflow: Icon van Figma naar Code

### Optie A: Via Claude (aanbevolen)

1. Open Figma en selecteer je icon/frame
2. Kopieer de Figma URL (bijv. `https://figma.com/file/xxx?node-id=123`)
3. Vraag Claude:
   ```
   Exporteer dit icon als React component: [plak URL]
   Plaats het in src/icons/map-markers/
   ```

Claude haalt het design op via de MCP server en maakt een geoptimaliseerde component.

### Optie B: Handmatig

1. **Export uit Figma**
   - Selecteer het icon frame
   - Export als SVG (1x)
   - Gebruik "Include 'id' attribute" voor complexe icons

2. **Plaats in project**
   ```
   src/icons/
   ├── map-markers/     → Kaart pin icons
   │   ├── premium-marker.svg
   │   ├── partner-marker.svg
   │   └── ...
   └── ui/              → UI icons (als Lucide niet heeft wat je nodig hebt)
   ```

3. **Import in code**
   ```tsx
   import PremiumMarker from '@/icons/map-markers/premium-marker.svg';

   // Als React component
   <PremiumMarker className="w-6 h-6 text-amber-500" />

   // Voor Leaflet markers
   import { createLeafletIcon } from '@/icons/map-markers/createLeafletIcon';
   const icon = createLeafletIcon(PremiumMarker, { width: 48, height: 60 });
   ```

---

## Design Guidelines

### UI Icons (24x24)
- Grid: 24×24px
- Stroke: 2px
- Padding: 2px van randen
- Kleuren: Gebruik `currentColor` voor theming

### Map Markers (48x60)
- Viewbox: 48×60px
- Pin anchor: centrum-onderkant
- Tier groottes:
  | Tier         | Width | Height |
  |--------------|-------|--------|
  | Premium      | 48px  | 60px   |
  | Partner Plus | 42px  | 52px   |
  | Partner      | 36px  | 44px   |
  | Free         | 30px  | 38px   |

### Kleurenpalet
```
Premium:      #FFD700 (goud) → #FFA500 (oranje)
Partner Plus: #14B8A6 (teal) → #0D9488 (donker teal)
Partner:      #8B5CF6 (paars) → #7C3AED (donker paars)
Free:         #6B7280 (grijs) → #4B5563 (donker grijs)
```

---

## Bestandsstructuur

```
src/icons/
├── index.ts              → Centrale exports + Lucide re-exports
├── svg.d.ts              → TypeScript declarations
├── map-markers/
│   ├── createLeafletIcon.ts  → Helper voor Leaflet conversie
│   ├── premium-marker.svg
│   ├── partner-plus-marker.svg
│   └── ...
└── ui/
    └── (custom UI icons indien nodig)
```

---

## Claude Instructies (voor consistentie)

Voeg dit toe aan je project CLAUDE.md of .claude/settings.json:

```text
ICON RULES:
- UI icons: gebruik uitsluitend Lucide (@lucide-react)
- Map markers: gebruik alleen icons uit src/icons/map-markers/
- NOOIT inline SVG's genereren in components
- Nieuwe icons altijd via Figma → SVGR workflow
- Design specs: 24x24 grid, 2px stroke, currentColor
```

---

## Troubleshooting

### SVG importeert niet als component
Check of `next.config.js` de SVGR webpack config bevat.

### Icon te groot/klein
Gebruik de `width` en `height` props of Tailwind classes (`w-6 h-6`).

### Kleuren werken niet
Zorg dat de SVG `currentColor` gebruikt in plaats van hardcoded kleuren.
Vervang in Figma: `fill="#000000"` → `fill="currentColor"`
