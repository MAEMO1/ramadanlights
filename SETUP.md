# Ramadan Lights Gent - Website Setup Documentatie

## Projectoverzicht

**Projectnaam:** Ramadan Lights Gent
**Concept:** "Licht in de Duisternis"
**Type:** Hybride website (B2B leadgeneratie + B2C informatief)

### Doelstellingen

1. **Leadgeneratie (B2B):** Ondernemers overtuigen om sponsor te worden via een digitaal formulier
2. **Informatief & Sfeerschepping (B2C):** Bezoekers informeren over de route en locatie van de verlichting
3. **Contractuele verplichting:** Tonen van sponsorlogo's ("Publiciteit") zoals vereist in de sponsoringovereenkomst

---

## Technische Stack

| Categorie | Technologie | Reden |
|-----------|-------------|-------|
| **Framework** | Next.js 14+ (App Router) | Uitstekende SEO, snelle laadtijden (SSG), schaalbaarheid |
| **Taal** | TypeScript | Type-safety, robuuste code voor formulierverwerking |
| **UI Library** | React | Binnen Next.js |
| **Animaties** | Framer Motion | Fade-ins, glow-effecten, parallax scrollen |
| **Styling** | Tailwind CSS | Utility-first, custom theming |
| **Componenten** | shadcn/ui (Radix UI) | Toegankelijke, aanpasbare componenten |
| **CMS** | Sanity.io | Headless CMS voor content beheer |
| **Hosting** | Vercel | Native Next.js support, CI/CD, gratis SSL |
| **Email** | Resend (of SendGrid) | Transactionele emails |
| **Maps** | Google Maps API / Mapbox | Gestileerde dark mode kaart |
| **Analytics** | Vercel Analytics / PostHog | GDPR vriendelijk |

---

## Design Specificaties

### Kleurenpalet

```css
/* Tailwind Config Kleuren */
--background:     #0a0a1a;     /* Diep nachtblauw/zwart */
--background-alt: #101028;     /* Iets lichter voor contrast */
--primary:        #d4a853;     /* Goud/Amber - accenten */
--primary-hover:  #e6be6a;     /* Goud hover state */
--text-primary:   #ffffff;     /* Wit - hoofdtekst */
--text-secondary: #a0a0b0;     /* Grijs - secundaire tekst */
--border:         #2a2a4a;     /* Subtiele borders */
```

### Typografie

| Type | Font | Gebruik |
|------|------|---------|
| **Koppen** | Playfair Display of Amiri | Klasse en traditie |
| **Leestekst** | Inter of Montserrat | Moderne leesbaarheid |

### Visuele Elementen

- **Textuur:** Subtiele Islamitische geometrische patronen
- **Achtergrond:** Vage "glow" effecten
- **Thema:** Dark Mode met gouden lichtaccenten

---

## Projectstructuur

```
/ramadan-lights-gent
├── /app
│   ├── /api
│   │   └── /sponsor-submit      # API route voor formulierverwerking
│   │       └── route.ts
│   ├── /(routes)
│   │   ├── page.tsx             # Homepage / Landingpage
│   │   └── bedankt/
│   │       └── page.tsx         # Bevestigingspagina na formulier
│   ├── /components
│   │   ├── /ui                  # shadcn componenten
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   └── ...
│   │   ├── Hero.tsx             # Sfeervolle hero sectie
│   │   ├── Story.tsx            # Het verhaal sectie
│   │   ├── SponsorGrid.tsx      # "Wall of Fame" lampionnen grid
│   │   ├── RouteMap.tsx         # Google Maps integratie
│   │   ├── SocialWall.tsx       # Instagram feed integratie
│   │   ├── SponsorForm.tsx      # Aanmeldformulier sponsors
│   │   ├── Footer.tsx           # Footer met disclaimer
│   │   └── Navbar.tsx           # Navigatie
│   ├── /lib
│   │   ├── mailer.ts            # Resend/Email configuratie
│   │   ├── sanity.ts            # CMS client config
│   │   ├── utils.ts             # Utility functies
│   │   └── validations.ts       # Formulier validatie schema's
│   ├── /styles
│   │   └── globals.css          # Tailwind imports + custom styles
│   ├── layout.tsx               # Root layout met fonts en metadata
│   └── page.tsx                 # Hoofdpagina
├── /public
│   ├── /assets
│   │   ├── /images              # Sfeerbeelden, achtergronden
│   │   ├── /logos               # Sponsor logo's (fallback)
│   │   └── /patterns            # Geometrische patronen
│   ├── contract.pdf             # Downloadbaar sponsorcontract
│   └── favicon.ico
├── /sanity
│   ├── schemas/
│   │   ├── sponsor.ts           # Sponsor schema
│   │   └── settings.ts          # Site instellingen
│   └── sanity.config.ts         # CMS configuratie
├── .env.local                   # Environment variables
├── tailwind.config.ts           # Tailwind configuratie
├── next.config.js               # Next.js configuratie
├── tsconfig.json                # TypeScript configuratie
└── package.json
```

---

## Homepage Secties

### 1. Hero Sectie ("De Wow-factor")

- **Visual:** Full-screen sfeervideo/foto van verlichte straten
- **Tekst:** "Ramadanverlichting Gent" - "Verbindend licht in het hart van de stad"
- **Animatie:** Subtiele gouden glow rond de titel
- **CTA:** "Word Partner" knop (rechtsboven, niet te dominant)

### 2. Het Verhaal (Voor de Bezoeker)

- **Content:** Waarom we dit doen (gezelligheid, samenhorigheid, feestmaand)
- **Doel:** Emotionele connectie maken met bezoekers

### 3. Routekaart

- **Type:** Google Maps API met custom dark styling
- **Functie:** Toont de verlichte route in Gent
- **Doel:** Bezoekers informeren waar ze kunnen wandelen

### 4. Sponsor Grid ("Constellation of Sponsors")

- **Naam:** "Mogelijk gemaakt door onze lichtbrengers"
- **Design:** Logo's als "lampionnen" in een raster
- **Tiers:**
  - **Goud:** Grote logo's met gouden rand/gloed
  - **Zilver:** Medium formaat
  - **Brons:** Kleiner formaat
- **Interactie:** Hover effect - logo licht op met glow

### 5. Social Wall

- **Integratie:** Instagram feed met hashtag (bijv. #RamadanGent)
- **Doel:** User-generated content, sociale bewijskracht

### 6. Sponsor Formulier ("Word Partner")

- **Velden:**
  - Bedrijfsnaam (verplicht)
  - BTW-nummer (verplicht)
  - Contactpersoon (verplicht)
  - Email (verplicht)
  - Telefoon (optioneel)
  - Gekozen pakket (Goud/Zilver/Brons)
- **Validatie:** Client-side + server-side
- **Actie:** Email naar admin + bevestigingsmail naar sponsor

### 7. Footer

- **Links:** Contact, VGM info, "Word Partner" CTA
- **Disclaimer:** BTW-vrijstelling vermelding
- **Downloadlink:** Sponsorcontract PDF

---

## Belangrijke Functionaliteiten

### Sponsor Formulier Flow

```
1. Bezoeker vult formulier in
   ↓
2. Client-side validatie (zod/react-hook-form)
   ↓
3. POST naar /api/sponsor-submit
   ↓
4. Server-side validatie
   ↓
5. Email naar admin (nieuwe aanvraag)
   ↓
6. Bevestigingsmail naar sponsor met:
   - Betaalinstructies
   - IBAN: BE93 0018 0728 1667
   - Instructie: vermeld factuurnummer + bedrijfsnaam
   ↓
7. Redirect naar /bedankt pagina
   ↓
8. Bedankt pagina toont nogmaals betaalinstructies
```

**Let op:** Geen checkout/winkelwagen - betaling via bankoverschrijving!

### Sponsor Grid Animaties

```typescript
// Framer Motion hover effect voorbeeld
const sponsorCardVariants = {
  initial: {
    boxShadow: "0 0 0 rgba(212, 168, 83, 0)"
  },
  hover: {
    boxShadow: "0 0 30px rgba(212, 168, 83, 0.6)",
    scale: 1.05,
    transition: { duration: 0.3 }
  }
};
```

---

## Environment Variables

Maak een `.env.local` bestand aan:

```env
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token

# Email (Resend)
RESEND_API_KEY=your_resend_api_key
ADMIN_EMAIL=info@vgm.be

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_api_key

# Site URL
NEXT_PUBLIC_SITE_URL=https://ramadanlichtengent.be
```

---

## Installatie & Development

### Vereisten

- Node.js 18+
- npm of pnpm
- Git

### Setup

```bash
# Clone repository
git clone <repository-url>
cd ramadan-lights-gent

# Installeer dependencies
npm install

# Kopieer environment variables
cp .env.example .env.local
# Vul de juiste waarden in

# Start development server
npm run dev
```

### Beschikbare Scripts

```bash
npm run dev        # Start development server (localhost:3000)
npm run build      # Bouw voor productie
npm run start      # Start productie server
npm run lint       # Lint code
npm run type-check # TypeScript check
```

---

## Deployment (Vercel)

### Stappen

1. Push code naar GitHub repository
2. Verbind repository met Vercel
3. Configureer environment variables in Vercel dashboard
4. Deploy automatisch bij elke push naar `main`

### Vercel Configuratie

- **Framework Preset:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Node.js Version:** 18.x

---

## CMS Beheer (Sanity)

### Sanity Studio Toegang

Na setup is de CMS beschikbaar op: `https://your-project.sanity.studio`

### Content Types

#### Sponsor
```typescript
{
  name: string;           // Bedrijfsnaam
  logo: image;            // Logo upload
  tier: 'gold' | 'silver' | 'bronze';
  website?: string;       // Optionele website link
  active: boolean;        // Tonen op website
}
```

#### Site Settings
```typescript
{
  heroTitle: string;
  heroSubtitle: string;
  heroImage: image;
  instagramHashtag: string;
  contactEmail: string;
}
```

---

## Juridische Vereisten

### Footer Disclaimer (Verplicht)

```
Kleine onderneming vrijgesteld van BTW (Art. 56bis W.BTW)
```

### Bedankt Pagina - Betaalinstructies

```
Bedankt voor uw sponsoring!

Gelieve het bedrag over te schrijven naar:

Rekeningnummer: BE93 0018 0728 1667
Begunstigde: VGM vzw

Vermeld bij de mededeling:
- Uw factuurnummer
- Bedrijfsnaam

U ontvangt een bevestiging zodra uw betaling is ontvangen.
```

---

## Responsive Design

**Mobile-first benadering is cruciaal!**

De site wordt veel mobiel bekeken (tijdens het wandelen door de stad).

### Breakpoints

```css
/* Tailwind standaard breakpoints */
sm: 640px   /* Kleine tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Grote schermen */
```

### Mobile Prioriteiten

1. Hero moet impactvol blijven op klein scherm
2. Sponsor grid: 1 kolom op mobile, 2-3 op tablet, 4+ op desktop
3. Kaart moet touch-friendly zijn
4. Formulier moet makkelijk invulbaar zijn met thumbs

---

## Performance Optimalisaties

- **Images:** Next.js Image component met lazy loading
- **Fonts:** Next.js Font optimization (subset laden)
- **Animaties:** `will-change` en GPU-accelerated transforms
- **Code splitting:** Automatisch door Next.js App Router
- **Static Generation:** Waar mogelijk voor snelste laadtijden

---

## Checklist voor Launch

- [ ] Alle environment variables geconfigureerd
- [ ] Sanity CMS opgezet met content
- [ ] Sponsor logo's geüpload
- [ ] Google Maps API key actief
- [ ] Email verzending getest
- [ ] Formulier flow getest
- [ ] Mobile responsiveness getest
- [ ] SEO meta tags ingevuld
- [ ] Favicon en social images toegevoegd
- [ ] Analytics geconfigureerd
- [ ] SSL certificaat actief (automatisch via Vercel)
- [ ] Domein gekoppeld
- [ ] Footer disclaimer aanwezig
- [ ] Betaalinstructies correct
- [ ] PDF contract downloadbaar

---

## Contact & Support

**Organisatie:** VGM vzw
**Project:** Ramadan Lights Gent

---

*Documentatie versie 1.0 - December 2024*
