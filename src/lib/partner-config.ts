import type { PartnerTier } from "./food-partner-types";

// Partner tier configuration - easily adjustable prices and features
export interface TierConfig {
  name: string;
  price: string;
  priceNumeric: number; // For sorting/comparison
  features: string[];
  highlighted: boolean;
  badge: string | null;
  badgeColor: string;
  cardStyle: string;
}

export const partnerTiers: Record<PartnerTier, TierConfig> = {
  free: {
    name: "Gratis Vermelding",
    price: "Gratis",
    priceNumeric: 0,
    features: [
      "Vermelding in de halal gids",
      "Basisinformatie (naam, adres, contact)",
      "Categorie en keuken type",
      "Link naar website",
    ],
    highlighted: false,
    badge: null,
    badgeColor: "",
    cardStyle: "bg-white border border-gray-200",
  },
  partner: {
    name: "Food Partner",
    price: "€300",
    priceNumeric: 300,
    features: [
      "Alles van Gratis Vermelding",
      "Prominente positie in de lijst",
      "Iftar special zichtbaar",
      "Menu & reservatie links",
      "Logo weergave",
      "Social media links",
    ],
    highlighted: true,
    badge: null,
    badgeColor: "",
    cardStyle: "bg-gradient-to-br from-gray-50 to-slate-50 border-2 border-gray-300",
  },
  partner_plus: {
    name: "Food Partner Plus",
    price: "€500",
    priceNumeric: 500,
    features: [
      "Alles van Food Partner",
      "\"Uitgelicht\" badge (teal)",
      "Top positie in de lijst",
      "Grote hero-kaart weergave",
      "Cover afbeelding",
      "Delivery app links (Uber Eats, Deliveroo)",
      "Foto galerij (tot 5 foto's)",
    ],
    highlighted: true,
    badge: "Uitgelicht",
    badgeColor: "bg-teal text-white",
    cardStyle: "bg-gradient-to-br from-teal-50 to-emerald-50 border-2 border-teal",
  },
  premium: {
    name: "Premium Partner",
    price: "€1000",
    priceNumeric: 1000,
    features: [
      "Alles van Food Partner Plus",
      "\"Sponsor\" badge (goud)",
      "Vermelding op homepage",
      "Zichtbaarheid in promovideo begin Ramadan",
      "Prioriteit bij zoekresultaten",
      "Vermelding in nieuwsbrief",
      "Extra grote kaart weergave",
    ],
    highlighted: true,
    badge: "Sponsor",
    badgeColor: "bg-gold text-gray-900",
    cardStyle: "bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-gold",
  },
};

// Helper function to get tier config
export function getTierConfig(tier: PartnerTier): TierConfig {
  return partnerTiers[tier];
}

// Helper function to get all tiers sorted by price (highest first)
export function getSortedTiers(): Array<{ tier: PartnerTier; config: TierConfig }> {
  return Object.entries(partnerTiers)
    .map(([tier, config]) => ({ tier: tier as PartnerTier, config }))
    .sort((a, b) => b.config.priceNumeric - a.config.priceNumeric);
}

// Helper function to get paid tiers only
export function getPaidTiers(): Array<{ tier: PartnerTier; config: TierConfig }> {
  return getSortedTiers().filter(({ config }) => config.priceNumeric > 0);
}

// Sales page configuration
export const salesPageConfig = {
  hero: {
    title: "Word Food Partner",
    subtitle: "Ramadan Lights Gent 2026",
    description:
      "Bereik duizenden bezoekers tijdens Ramadan. Word onderdeel van het Ramadan Lights project en laat jouw halal eten & drinken ontdekken door de Gentse gemeenschap.",
  },
  benefits: [
    {
      title: "Bereik de Ramadan community",
      description:
        "Duizenden bezoekers zoeken dagelijks naar iftar locaties en halal eten in Gent.",
      icon: "users",
    },
    {
      title: "Onderdeel van een groter project",
      description:
        "Ramadan Lights verbindt de Gentse gemeenschap met licht, cultuur en gastvrijheid.",
      icon: "sparkles",
    },
    {
      title: "Iftar specials uitlichten",
      description:
        "Promoot je speciale Ramadan menu's en iftar deals rechtstreeks aan geïnteresseerde bezoekers.",
      icon: "utensils",
    },
    {
      title: "Zichtbaarheid op de kaart",
      description:
        "Word weergegeven op de interactieve kaart samen met moskeeën en iftar locaties.",
      icon: "map-pin",
    },
  ],
  faq: [
    {
      question: "Hoe lang is mijn partnerschap geldig?",
      answer:
        "Je partnerschap is geldig voor de hele Ramadan periode (ongeveer 30 dagen). Na afloop kan je verlengen voor volgend jaar.",
    },
    {
      question: "Kan ik mijn gegevens later nog aanpassen?",
      answer:
        "Ja, na goedkeuring ontvang je een link waarmee je je profiel kunt bijwerken.",
    },
    {
      question: "Wat als mijn aanvraag wordt afgekeurd?",
      answer:
        "We keuren alleen halal-vriendelijke etablissementen goed. Bij afkeuring ontvang je een e-mail met de reden.",
    },
    {
      question: "Hoe betaal ik?",
      answer:
        "Na goedkeuring van je aanvraag ontvang je een factuur. Betaling kan via overschrijving.",
    },
    {
      question: "Kan ik upgraden naar een hoger pakket?",
      answer:
        "Ja, je kunt op elk moment upgraden. Neem contact met ons op via vzwvgm@gmail.com.",
    },
  ],
  contact: {
    email: "vzwvgm@gmail.com",
    whatsapp: "+32 XXX XX XX XX", // TODO: Add actual number
  },
};
