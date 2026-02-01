# Claude Code-instructies voor Ramadan Lights

## Projectoverzicht
Ramadan Lights Gent — een Next.js-website voor het Ramadanverlichtingsinitiatief in Gent, België.

## Icon-systeemregels (MOETEN GEVOLGD WORDEN)

### Hiërarchie
1. **Tabler Icons** (`@tabler/icons-react`) — primaire bibliotheek
2. **Lucide** (`lucide-react`) — alleen als Tabler het icon niet heeft
3. **Custom Figma SVG's** (`src/icons/map-markers/`) — uitsluitend voor kaartmarkeringen

### Do's
- Gebruik `IconBuildingMosque` van Tabler voor moskee-iconen
- Gebruik iconen via exports uit `src/icons/index.ts`
- Voor map markers: gebruik SVG's uit `src/icons/map-markers/`
- Volg het 24×24 grid en 2px stroke voor nieuwe UI-iconen
- Gebruik `currentColor` voor theming-ondersteuning

### Don'ts
- Maak NOOIT inline SVG-iconen in components
- Mix NOOIT icon libraries binnen hetzelfde component
- Gebruik NOOIT emoji als icons (gebruik echte SVG-iconen)
- Genereer/teken NOOIT nieuwe SVG-iconen — vraag een Figma-export in de plaats

### Map marker groottes (Leaflet)
| Tier         | Breedte | Hoogte |
|--------------|---------|--------|
| Premium      | 48px    | 60px   |
| Partner Plus | 42px    | 52px   |
| Partner      | 36px    | 44px   |
| Free         | 30px    | 38px   |

### Kleurenpalet per tier
```
Premium:      #FFD700 → #FFA500 (gouden gradient)
Partner Plus: #14B8A6 → #0D9488 (teal gradient)
Partner:      #8B5CF6 → #7C3AED (paarse gradient)
Free:         #6B7280 → #4B5563 (grijze gradient)
```

## Codeconventies

### Imports
```tsx
// Voorkeur: importeer vanuit de centrale icon index
import { IconBuildingMosque, IconStar } from '@/icons';

// Voor map markers (na Figma-export)
import PremiumMarker from '@/icons/map-markers/premium-marker.svg';
```

### Componentpatronen
- Gebruik Tailwind CSS voor styling
- Gebruik Framer Motion voor animaties
- Gebruik Leaflet voor kaarten
- Gebruik Supabase voor de backend

## Bestandsstructuur
```
src/
├── icons/
│   ├── index.ts          # Centrale exports
│   ├── svg.d.ts          # TypeScript declaraties
│   └── map-markers/      # Custom Figma-geëxporteerde markers
├── components/           # React components
├── lib/                  # Utilities en types
└── app/                  # Next.js App Router pagina's
```

## Wanneer je nieuwe icons toevoegt
1. Check eerst Tabler: https://tabler.io/icons
2. Als niet in Tabler, check Lucide: https://lucide.dev
3. Indien custom nodig: design in Figma, exporteer SVG, plaats in `src/icons/map-markers/`
4. Voeg export toe in `src/icons/index.ts`
