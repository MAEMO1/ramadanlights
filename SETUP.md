# Ramadan Lights Gent — Website Setup Documentation

## Project Overview

**Project name:** Ramadan Lights Gent  
**Concept:** “Light in the Darkness”  
**Type:** Hybrid website (B2B lead generation + B2C informational)

### Goals

1. **Lead generation (B2B):** Convince business owners to become sponsors via a digital form
2. **Informational & atmosphere (B2C):** Inform visitors about the route and lighting locations
3. **Contractual requirement:** Display sponsor logos (“Publicity”) as required by the sponsorship agreement

---

## Technical Stack

| Category | Technology | Why |
|----------|------------|-----|
| **Framework** | Next.js 14+ (App Router) | Excellent SEO, fast load times (SSG), scalability |
| **Language** | TypeScript | Type-safety, robust form handling |
| **UI Library** | React | Included with Next.js |
| **Animations** | Framer Motion | Fade-ins, glow effects, parallax scrolling |
| **Styling** | Tailwind CSS | Utility-first, easy custom theming |
| **Components** | shadcn/ui (Radix UI) | Accessible, customizable components |
| **CMS** | Sanity.io | Headless CMS for content management |
| **Hosting** | Vercel | Native Next.js support, CI/CD, free SSL |
| **Email** | Resend (or SendGrid) | Transactional email delivery |
| **Maps** | Google Maps API / Mapbox | Stylable dark-mode map |
| **Analytics** | Vercel Analytics / PostHog | GDPR-friendly analytics options |

---

## Design Specs

### Color Palette

```css
/* Tailwind config colors */
--background:     #0a0a1a;     /* Deep night blue/black */
--background-alt: #101028;     /* Slightly lighter for contrast */
--primary:        #d4a853;     /* Gold/amber accents */
--primary-hover:  #e6be6a;     /* Gold hover state */
--text-primary:   #ffffff;     /* White - primary text */
--text-secondary: #a0a0b0;     /* Gray - secondary text */
--border:         #2a2a4a;     /* Subtle borders */
```

### Typography

| Type | Font | Use |
|------|------|-----|
| **Headings** | Playfair Display or Amiri | Classy and traditional feel |
| **Body** | Inter or Montserrat | Modern readability |

### Visual Elements

- **Texture:** Subtle Islamic geometric patterns
- **Background:** Soft “glow” effects
- **Theme:** Dark mode with golden light accents

---

## Project Structure

```
/ramadan-lights-gent
├── /app
│   ├── /api
│   │   └── /sponsor-submit      # API route for form handling
│   │       └── route.ts
│   ├── /(routes)
│   │   ├── page.tsx             # Homepage / Landing page
│   │   └── bedankt/
│   │       └── page.tsx         # Confirmation page after form submit
│   ├── /components
│   │   ├── /ui                  # shadcn components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   └── ...
│   │   ├── Hero.tsx             # Atmospheric hero section
│   │   ├── Story.tsx            # Story section
│   │   ├── SponsorGrid.tsx      # “Wall of Fame” lantern grid
│   │   ├── RouteMap.tsx         # Google Maps integration
│   │   ├── SocialWall.tsx       # Instagram feed integration
│   │   ├── SponsorForm.tsx      # Sponsor sign-up form
│   │   ├── Footer.tsx           # Footer with disclaimer
│   │   └── Navbar.tsx           # Navigation
│   ├── /lib
│   │   ├── mailer.ts            # Resend/Email configuration
│   │   ├── sanity.ts            # CMS client config
│   │   ├── utils.ts             # Utility functions
│   │   └── validations.ts       # Form validation schemas
│   ├── /styles
│   │   └── globals.css          # Tailwind imports + custom styles
│   ├── layout.tsx               # Root layout with fonts and metadata
│   └── page.tsx                 # Main page
├── /public
│   ├── /assets
│   │   ├── /images              # Atmosphere images, backgrounds
│   │   ├── /logos               # Sponsor logos (fallback)
│   │   └── /patterns            # Geometric patterns
│   ├── contract.pdf             # Downloadable sponsor contract
│   └── favicon.ico
├── /sanity
│   ├── schemas/
│   │   ├── sponsor.ts           # Sponsor schema
│   │   └── settings.ts          # Site settings
│   └── sanity.config.ts         # CMS configuration
├── .env.local                   # Environment variables
├── tailwind.config.ts           # Tailwind configuration
├── next.config.js               # Next.js configuration
├── tsconfig.json                # TypeScript configuration
└── package.json
```

---

## Homepage Sections

### 1. Hero (“The wow factor”)

- **Visual:** Full-screen atmospheric video/photo of lit streets
- **Text (example):** “Ramadanverlichting Gent” — “Verbindend licht in het hart van de stad”
- **Animation:** Subtle golden glow around the title
- **CTA:** “Word Partner” button (top-right, not too dominant)

### 2. The Story (for visitors)

- **Content:** Why we do this (cosiness, togetherness, festive month)
- **Goal:** Create an emotional connection with visitors

### 3. Route Map

- **Type:** Google Maps API with custom dark styling
- **Function:** Shows the lit route in Ghent
- **Goal:** Inform visitors where they can walk

### 4. Sponsor Grid (“Constellation of Sponsors”)

- **Title:** “Made possible by our light bringers”
- **Design:** Logos as “lanterns” in a grid
- **Tiers:**
  - **Gold:** Large logos with golden border/glow
  - **Silver:** Medium size
  - **Bronze:** Smaller
- **Interaction:** Hover effect — logo lights up with glow

### 5. Social Wall

- **Integration:** Instagram feed with hashtag (e.g. #RamadanGent)
- **Goal:** User-generated content, social proof

### 6. Sponsor Form (“Become a Partner”)

- **Fields:**
  - Company name (required)
  - VAT number (required)
  - Contact person (required)
  - Email (required)
  - Phone (optional)
  - Selected package (Gold/Silver/Bronze)
- **Validation:** Client-side + server-side
- **Action:** Email to admin + confirmation email to sponsor

### 7. Footer

- **Links:** Contact, VGM info, “Become a Partner” CTA
- **Disclaimer:** VAT exemption statement
- **Download link:** Sponsor contract PDF

---

## Key Functionality

### Sponsor Form Flow

```
1. Visitor completes the form
   ↓
2. Client-side validation (zod/react-hook-form)
   ↓
3. POST to /api/sponsor-submit
   ↓
4. Server-side validation
   ↓
5. Email to admin (new request)
   ↓
6. Confirmation email to sponsor with:
   - Payment instructions
   - IBAN: BE93 0018 0728 1667
   - Instruction: mention invoice number + company name
   ↓
7. Redirect to /bedankt page
   ↓
8. Thank-you page shows the payment instructions again
```

**Note:** No checkout/cart — payment via bank transfer!

### Sponsor Grid Animations

```typescript
// Example Framer Motion hover effect
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

Create a `.env.local` file:

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

## Installation & Development

### Requirements

- Node.js 18+
- npm or pnpm
- Git

### Setup

```bash
# Clone repository
git clone <repository-url>
cd ramadan-lights-gent

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Fill in the correct values

# Start development server
npm run dev
```

### Available Scripts

```bash
npm run dev        # Start development server (localhost:3000)
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Lint code
npm run type-check # TypeScript check
```

---

## Deployment (Vercel)

### Steps

1. Push code to a GitHub repository
2. Connect the repository to Vercel
3. Configure environment variables in the Vercel dashboard
4. Auto-deploy on every push to `main`

### Vercel Configuration

- **Framework Preset:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Node.js Version:** 18.x

---

## CMS Management (Sanity)

### Sanity Studio Access

After setup, the CMS is available at: `https://your-project.sanity.studio`

### Content Types

#### Sponsor

```typescript
{
  name: string;           // Company name
  logo: image;            // Logo upload
  tier: 'gold' | 'silver' | 'bronze';
  website?: string;       // Optional website link
  active: boolean;        // Display on website
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

## Legal Requirements

### Footer Disclaimer (Required)

Keep this exact statement on the site (Dutch):

```
Kleine onderneming vrijgesteld van BTW (Art. 56bis W.BTW)
```

### Thank-you Page — Payment Instructions

Example copy (Dutch):

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

**A mobile-first approach is critical.**

The site will be viewed a lot on mobile (while walking through the city).

### Breakpoints

```css
/* Tailwind default breakpoints */
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large screens */
```

### Mobile Priorities

1. The hero must remain impactful on small screens
2. Sponsor grid: 1 column on mobile, 2–3 on tablet, 4+ on desktop
3. Map must be touch-friendly
4. Form must be easy to fill in with thumbs

---

## Performance Optimizations

- **Images:** Next.js Image component with lazy loading
- **Fonts:** Next.js Font optimization (load subsets)
- **Animations:** `will-change` and GPU-accelerated transforms
- **Code splitting:** Automatic via Next.js App Router
- **Static generation:** Where possible for the fastest load times

---

## Launch Checklist

- [ ] All environment variables configured
- [ ] Sanity CMS set up with content
- [ ] Sponsor logos uploaded
- [ ] Google Maps API key active
- [ ] Email delivery tested
- [ ] Form flow tested
- [ ] Mobile responsiveness tested
- [ ] SEO meta tags filled in
- [ ] Favicon and social images added
- [ ] Analytics configured
- [ ] SSL certificate active (automatic via Vercel)
- [ ] Domain connected
- [ ] Footer disclaimer present
- [ ] Payment instructions correct
- [ ] PDF contract downloadable

---

## Contact & Support

**Organization:** VGM vzw  
**Project:** Ramadan Lights Gent

---

*Documentation version 1.0 — December 2024*
