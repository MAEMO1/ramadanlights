"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { GameMapProvider, useGameMap } from "@/contexts/GameMapContext";
import type { FoodPartner } from "@/lib/food-partner-types";
import type { ShopPartner } from "@/lib/shop-partner-types";

// Dynamically import to avoid SSR issues with Leaflet
const GameMapOverlay = dynamic(
  () => import("@/components/GameMapOverlay").then((mod) => mod.GameMapOverlay),
  { ssr: false }
);

interface Mosque {
  id: string;
  name: string;
  address: string;
  city: string;
  fullAddress?: string;
  latitude: number | null;
  longitude: number | null;
}

// Dummy food partners for testing (along the Wondelgemstraat and Bevrijdingslaan)
const dummyFoodPartners: FoodPartner[] = [
  {
    id: "demo-restaurant-1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: "Restaurant Dar Essalam",
    slug: "dar-essalam",
    description: "Luxe Arabisch restaurant met authentieke gerechten uit het Midden-Oosten.",
    address: "Wondelgemstraat 150",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0635,
    longitude: 3.7095,
    category: "restaurant",
    cuisine_type: "lebanese",
    dish_types: ["grill", "rice", "shawarma"],
    is_halal_certified: true,
    halal_certification_info: "HMC Certified",
    partner_tier: "premium",
    tier_expires_at: null,
    iftar_special: "Koninklijke Iftar Buffet",
    iftar_special_price: "€35 per persoon",
    contact_name: "Demo",
    contact_email: "demo@example.com",
    contact_phone: null,
    website_url: null,
    menu_url: null,
    reservation_url: null,
    facebook_url: null,
    instagram_url: null,
    uber_eats_url: null,
    deliveroo_url: null,
    takeaway_url: null,
    logo_url: null,
    cover_image_url: null,
    opening_hours: null,
    status: "approved",
    approval_token: "demo",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
  {
    id: "demo-bakery-1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: "Bakkerij Al-Nour",
    slug: "bakkerij-al-nour",
    description: "Verse Turkse en Marokkaanse broden en gebak.",
    address: "Wondelgemstraat 89",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0620,
    longitude: 3.7102,
    category: "bakery",
    cuisine_type: "turkish",
    dish_types: ["bread"],
    is_halal_certified: true,
    halal_certification_info: null,
    partner_tier: "partner_plus",
    tier_expires_at: null,
    iftar_special: "Ramadan broodpakket",
    iftar_special_price: "€8",
    contact_name: "Demo",
    contact_email: "demo@example.com",
    contact_phone: null,
    website_url: null,
    menu_url: null,
    reservation_url: null,
    facebook_url: null,
    instagram_url: null,
    uber_eats_url: null,
    deliveroo_url: null,
    takeaway_url: null,
    logo_url: null,
    cover_image_url: null,
    opening_hours: null,
    status: "approved",
    approval_token: "demo",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
  {
    id: "demo-butcher-1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: "Slagerij El Baraka",
    slug: "slagerij-el-baraka",
    description: "100% halal vlees van lokale boerderijen.",
    address: "Bevrijdingslaan 42",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0595,
    longitude: 3.7035,
    category: "butcher",
    cuisine_type: "moroccan",
    dish_types: ["grill"],
    is_halal_certified: true,
    halal_certification_info: "Halal certified",
    partner_tier: "partner",
    tier_expires_at: null,
    iftar_special: null,
    iftar_special_price: null,
    contact_name: "Demo",
    contact_email: "demo@example.com",
    contact_phone: null,
    website_url: null,
    menu_url: null,
    reservation_url: null,
    facebook_url: null,
    instagram_url: null,
    uber_eats_url: null,
    deliveroo_url: null,
    takeaway_url: null,
    logo_url: null,
    cover_image_url: null,
    opening_hours: null,
    status: "approved",
    approval_token: "demo",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
  {
    id: "demo-supermarket-1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: "Supermarkt Istanbul",
    slug: "supermarkt-istanbul",
    description: "Turkse en internationale producten.",
    address: "Phoenixstraat 15",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0580,
    longitude: 3.7060,
    category: "supermarket",
    cuisine_type: "turkish",
    dish_types: null,
    is_halal_certified: true,
    halal_certification_info: null,
    partner_tier: "partner_plus",
    tier_expires_at: null,
    iftar_special: "10% korting op Ramadan producten",
    iftar_special_price: null,
    contact_name: "Demo",
    contact_email: "demo@example.com",
    contact_phone: null,
    website_url: null,
    menu_url: null,
    reservation_url: null,
    facebook_url: null,
    instagram_url: null,
    uber_eats_url: null,
    deliveroo_url: null,
    takeaway_url: null,
    logo_url: null,
    cover_image_url: null,
    opening_hours: null,
    status: "approved",
    approval_token: "demo",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
];

// Dummy shop partners for testing
const dummyShopPartners: ShopPartner[] = [
  {
    id: "demo-decor-1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: "Ramadan Decoratie Shop",
    slug: "ramadan-decor",
    description: "Prachtige Ramadan en Eid decoraties voor thuis.",
    address: "Wondelgemstraat 120",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0628,
    longitude: 3.7098,
    category: "decor",
    partner_tier: "premium",
    tier_expires_at: null,
    ramadan_special: "Gratis lantaarn bij aankoop boven €50",
    ramadan_special_discount: "15%",
    contact_name: "Demo",
    contact_email: "demo@example.com",
    contact_phone: null,
    website_url: null,
    facebook_url: null,
    instagram_url: null,
    logo_url: null,
    cover_image_url: null,
    opening_hours: null,
    status: "approved",
    approval_token: "demo",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
  {
    id: "demo-clothing-1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: "Modest Fashion Gent",
    slug: "modest-fashion",
    description: "Elegante modest fashion voor dames en heren.",
    address: "Bevrijdingslaan 88",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0612,
    longitude: 3.7010,
    category: "clothing",
    partner_tier: "partner_plus",
    tier_expires_at: null,
    ramadan_special: "Eid collectie 2026",
    ramadan_special_discount: "20%",
    contact_name: "Demo",
    contact_email: "demo@example.com",
    contact_phone: null,
    website_url: null,
    facebook_url: null,
    instagram_url: null,
    logo_url: null,
    cover_image_url: null,
    opening_hours: null,
    status: "approved",
    approval_token: "demo",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
  {
    id: "demo-gifts-1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: "Cadeau Souq",
    slug: "cadeau-souq",
    description: "Unieke cadeaus en souvenirs.",
    address: "Wondelgemstraat 55",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0605,
    longitude: 3.7105,
    category: "gifts",
    partner_tier: "partner",
    tier_expires_at: null,
    ramadan_special: null,
    ramadan_special_discount: null,
    contact_name: "Demo",
    contact_email: "demo@example.com",
    contact_phone: null,
    website_url: null,
    facebook_url: null,
    instagram_url: null,
    logo_url: null,
    cover_image_url: null,
    opening_hours: null,
    status: "approved",
    approval_token: "demo",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
];

function GameMapContent() {
  const { isOpen, closeMap } = useGameMap();
  const [foodPartners, setFoodPartners] = useState<FoodPartner[]>(dummyFoodPartners);
  const [shopPartners, setShopPartners] = useState<ShopPartner[]>(dummyShopPartners);
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Fetch data when map opens for the first time
  useEffect(() => {
    if (isOpen && !dataLoaded) {
      Promise.all([
        fetch("/api/food-partners/list").then((r) => r.json()),
        fetch("/api/shop-partners/list").then((r) => r.json()),
        fetch("/api/mosques").then((r) => r.json()),
      ])
        .then(([foodData, shopData, mosqueData]) => {
          // Merge API data with dummy data
          const apiFood = foodData.partners || [];
          const apiShop = shopData.partners || [];
          setFoodPartners([...dummyFoodPartners, ...apiFood]);
          setShopPartners([...dummyShopPartners, ...apiShop]);
          // API returns 'data' key for mosques
          setMosques(mosqueData.data || mosqueData.mosques || []);
          setDataLoaded(true);
        })
        .catch((error) => {
          console.error("Error fetching map data:", error);
          // Keep dummy data on error
          setDataLoaded(true);
        });
    }
  }, [isOpen, dataLoaded]);

  return (
    <GameMapOverlay
      isOpen={isOpen}
      onClose={closeMap}
      foodPartners={foodPartners}
      shopPartners={shopPartners}
      mosques={mosques}
    />
  );
}

export function GameMapWrapper({ children }: { children: React.ReactNode }) {
  return (
    <GameMapProvider>
      {children}
      <GameMapContent />
    </GameMapProvider>
  );
}
