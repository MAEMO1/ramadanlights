"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FoodPartnerCard } from "@/components/FoodPartnerCard";
import { ShopPartnerCard } from "@/components/ShopPartnerCard";
import { ActivityCard } from "@/components/ActivityCard";
import {
  ArrowRight,
  Plus,
  Utensils,
  GraduationCap,
  Wrench,
  Heart,
  Users,
  Sparkles,
  Dumbbell,
  Calendar,
  Check,
  X,
  Filter,
  Truck,
  ShoppingBag,
  Store,
  MapPin,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  List,
  Map,
  type LucideIcon,
} from "lucide-react";
import { SponsorMap } from "@/components/SponsorMap";
import Link from "next/link";
import type { Activity, ActivityType } from "@/lib/activity-types";
import type { FoodPartner, CuisineType, FoodPartnerCategory, DishType } from "@/lib/food-partner-types";
import { cuisineTypeLabels, categoryLabels, dishTypeLabels } from "@/lib/food-partner-types";
import type { ShopPartner, ShopCategory } from "@/lib/shop-partner-types";
import { shopCategoryLabels, shopCategoryIcons } from "@/lib/shop-partner-types";

// Category configuration with icons and colors
type CategoryId = "food" | ActivityType;

interface CategoryConfig {
  id: CategoryId;
  label: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

const categories: CategoryConfig[] = [
  { id: "food", label: "Eten & Drinken", icon: Utensils, color: "text-rose-600", bgColor: "bg-rose-100" },
  { id: "shopping", label: "Shopping", icon: Store, color: "text-pink-600", bgColor: "bg-pink-100" },
  { id: "lecture", label: "Lezing", icon: GraduationCap, color: "text-blue-600", bgColor: "bg-blue-100" },
  { id: "workshop", label: "Workshop", icon: Wrench, color: "text-purple-600", bgColor: "bg-purple-100" },
  { id: "charity", label: "Liefdadigheid", icon: Heart, color: "text-red-600", bgColor: "bg-red-100" },
  { id: "community", label: "Community", icon: Users, color: "text-teal-600", bgColor: "bg-teal-100" },
  { id: "youth", label: "Jeugd", icon: Sparkles, color: "text-orange-600", bgColor: "bg-orange-100" },
  { id: "sports", label: "Sport", icon: Dumbbell, color: "text-green-600", bgColor: "bg-green-100" },
  { id: "other", label: "Overig", icon: Calendar, color: "text-gray-600", bgColor: "bg-gray-100" },
];

// Cuisine type icon mapping (Takeaway.com style)
const cuisineIcons: Partial<Record<CuisineType, string>> = {
  turkish: "🇹🇷",
  moroccan: "🇲🇦",
  middle_eastern: "🥙",
  indian_pakistani: "🍛",
  indonesian: "🇮🇩",
  african: "🌍",
  mediterranean: "🫒",
  lebanese: "🇱🇧",
  persian: "🇮🇷",
  asian: "🍜",
  international: "🌐",
  other: "🍽️",
};

// Dummy food partners for demonstration - one of each tier
const dummyFoodPartners: FoodPartner[] = [
  // PREMIUM TIER (€1000) - Sponsor badge, all features
  {
    id: "dummy-premium",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: "Restaurant Dar Essalam",
    slug: "dar-essalam",
    description: "Luxe Arabisch restaurant met authentieke gerechten uit het Midden-Oosten. Bekroond als beste halal restaurant van Gent 2025. Sfeervolle inrichting met traditionele mozaïeken en live muziek.",
    address: "Kouter 29",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0500,
    longitude: 3.7250,
    category: "restaurant",
    cuisine_type: "lebanese",
    dish_types: ["grill", "rice", "shawarma", "salads", "desserts"],
    is_halal_certified: true,
    halal_certification_info: "HMC Certified - Premium Quality",
    partner_tier: "premium",
    tier_expires_at: null,
    iftar_special: "Koninklijke Iftar Buffet met 40+ gerechten, live kookstation en traditionele Arabische desserts",
    iftar_special_price: "€35 per persoon (groepen 10+ €30)",
    contact_name: "Youssef Al-Rashid",
    contact_email: "info@daressalam.be",
    contact_phone: "+32 9 111 22 33",
    website_url: "https://example.com/daressalam",
    menu_url: "https://example.com/daressalam/menu",
    reservation_url: "https://example.com/daressalam/reserveer",
    facebook_url: "https://facebook.com/daressalam",
    instagram_url: "https://instagram.com/daressalam",
    uber_eats_url: "https://ubereats.com/daressalam",
    deliveroo_url: "https://deliveroo.be/daressalam",
    takeaway_url: "https://takeaway.com/daressalam",
    logo_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&h=200&fit=crop",
    cover_image_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop",
    opening_hours: null,
    status: "approved",
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
  // PARTNER PLUS TIER (€500) - Uitgelicht badge, delivery links
  {
    id: "dummy-plus",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: "Restaurant El Bahia",
    slug: "el-bahia",
    description: "Authentiek Marokkaans restaurant met verse tagines en couscous gerechten. Familierecept sinds 1985.",
    address: "Sleepstraat 123",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0543,
    longitude: 3.7174,
    category: "restaurant",
    cuisine_type: "moroccan",
    dish_types: ["grill", "rice", "soup", "bread", "desserts"],
    is_halal_certified: true,
    halal_certification_info: "HMC Certified",
    partner_tier: "partner_plus",
    tier_expires_at: null,
    iftar_special: "Iftar menu met harira, briwat, tagine en Marokkaanse thee",
    iftar_special_price: "€18 per persoon",
    contact_name: "Mohammed",
    contact_email: "info@elbahia.be",
    contact_phone: "+32 9 123 45 67",
    website_url: "https://example.com",
    menu_url: "https://example.com/menu",
    reservation_url: "https://example.com/reserveer",
    facebook_url: "https://facebook.com/elbahia",
    instagram_url: "https://instagram.com/elbahia",
    uber_eats_url: null,
    deliveroo_url: "https://deliveroo.be/elbahia",
    takeaway_url: "https://takeaway.com/elbahia",
    logo_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop",
    cover_image_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=400&fit=crop",
    opening_hours: null,
    status: "approved",
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
  // PARTNER TIER (€300) - Basic paid features
  {
    id: "dummy-partner",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: "Bakkerij Sultan",
    slug: "bakkerij-sultan",
    description: "Turkse bakkerij met verse pide, lahmacun en baklava. Elke dag vers gebakken.",
    address: "Wondelgemstraat 45",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0643,
    longitude: 3.7274,
    category: "bakery",
    cuisine_type: "turkish",
    dish_types: ["bread", "pizza", "snacks", "desserts"],
    is_halal_certified: true,
    halal_certification_info: null,
    partner_tier: "partner",
    tier_expires_at: null,
    iftar_special: "Ramadan pide special - 3 voor €10",
    iftar_special_price: "€10",
    contact_name: "Ahmet",
    contact_email: "info@sultan.be",
    contact_phone: "+32 9 234 56 78",
    website_url: "https://example.com/sultan",
    menu_url: "https://example.com/sultan/menu",
    reservation_url: null,
    facebook_url: "https://facebook.com/sultan",
    instagram_url: "https://instagram.com/bakkerijsultan",
    uber_eats_url: null,
    deliveroo_url: null,
    takeaway_url: "https://takeaway.com/sultan",
    logo_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop",
    cover_image_url: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=800&h=400&fit=crop",
    opening_hours: null,
    status: "approved",
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
  // ANOTHER PARTNER TIER (€300) - Indiaas/Pakistaans
  {
    id: "dummy-partner-2",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: "Tandoori Palace",
    slug: "tandoori-palace",
    description: "Authentieke Pakistaanse en Indiase gerechten bereid in onze traditionele tandoor oven.",
    address: "Vlaanderenstraat 15",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0520,
    longitude: 3.7200,
    category: "restaurant",
    cuisine_type: "indian_pakistani",
    dish_types: ["chicken", "rice", "grill", "vegetarian", "bread"],
    is_halal_certified: true,
    halal_certification_info: "Halal Certified",
    partner_tier: "partner",
    tier_expires_at: null,
    iftar_special: "Iftar Thali met naan, curry, rijst en dessert",
    iftar_special_price: "€16 per persoon",
    contact_name: "Rashid",
    contact_email: "info@tandooripalace.be",
    contact_phone: "+32 9 555 66 77",
    website_url: "https://example.com/tandoori",
    menu_url: null,
    reservation_url: null,
    facebook_url: "https://facebook.com/tandooripalace",
    instagram_url: null,
    uber_eats_url: "https://ubereats.com/tandoori",
    deliveroo_url: null,
    takeaway_url: null,
    logo_url: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&h=200&fit=crop",
    cover_image_url: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=400&fit=crop",
    opening_hours: null,
    status: "approved",
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
  // MORE PARTNER TIER (€300) - Café
  {
    id: "dummy-partner-3",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: "Café Noor",
    slug: "cafe-noor",
    description: "Gezellig halal café met Turkse koffie, verse sappen, smoothies en lichte maaltijden. De ideale plek voor een ontspannen iftar.",
    address: "Overpoortstraat 88",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0380,
    longitude: 3.7230,
    category: "cafe",
    cuisine_type: "turkish",
    dish_types: ["soup", "bread", "snacks", "desserts"],
    is_halal_certified: false,
    halal_certification_info: null,
    partner_tier: "partner",
    tier_expires_at: null,
    iftar_special: "Iftar platter met dadels, soep, broodjes en Turkse thee",
    iftar_special_price: "€12 per persoon",
    contact_name: "Fatma",
    contact_email: "info@cafenoor.be",
    contact_phone: "+32 9 444 55 66",
    website_url: "https://example.com/cafenoor",
    menu_url: null,
    reservation_url: null,
    facebook_url: "https://facebook.com/cafenoor",
    instagram_url: "https://instagram.com/cafenoor",
    uber_eats_url: null,
    deliveroo_url: null,
    takeaway_url: null,
    logo_url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&h=200&fit=crop",
    cover_image_url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=400&fit=crop",
    opening_hours: null,
    status: "approved",
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
  // MORE PARTNER TIER (€300) - Grillroom
  {
    id: "dummy-partner-4",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: "Grillroom Istanbul",
    slug: "grillroom-istanbul",
    description: "De lekkerste Turkse grillgerechten van Gent. Verse kebab, adana, köfte en meer. Alles bereid op houtskoolgrill.",
    address: "Brabantdam 45",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0510,
    longitude: 3.7280,
    category: "restaurant",
    cuisine_type: "turkish",
    dish_types: ["kebab", "grill", "chicken", "rice", "salads"],
    is_halal_certified: true,
    halal_certification_info: "Halal Certified",
    partner_tier: "partner",
    tier_expires_at: null,
    iftar_special: "Mixed Grill Iftar met soep, salades en dessert",
    iftar_special_price: "€22 per persoon",
    contact_name: "Mehmet",
    contact_email: "info@grillroomistanbul.be",
    contact_phone: "+32 9 333 44 55",
    website_url: "https://example.com/istanbul",
    menu_url: "https://example.com/istanbul/menu",
    reservation_url: null,
    facebook_url: "https://facebook.com/grillroomistanbul",
    instagram_url: null,
    uber_eats_url: null,
    deliveroo_url: "https://deliveroo.be/istanbul",
    takeaway_url: "https://takeaway.com/istanbul",
    logo_url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=200&h=200&fit=crop",
    cover_image_url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=400&fit=crop",
    opening_hours: null,
    status: "approved",
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
  // MORE PARTNER TIER (€300) - Shawarma
  {
    id: "dummy-partner-5",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: "Shawarma King",
    slug: "shawarma-king",
    description: "Authentieke Midden-Oosterse shawarma, falafel en mezze. Vers bereid met huisgemaakte sauzen.",
    address: "Sint-Pietersnieuwstraat 124",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0420,
    longitude: 3.7180,
    category: "restaurant",
    cuisine_type: "middle_eastern",
    dish_types: ["shawarma", "wraps", "chicken", "salads", "snacks"],
    is_halal_certified: true,
    halal_certification_info: "100% Halal",
    partner_tier: "partner",
    tier_expires_at: null,
    iftar_special: "Shawarma Family Deal - 4 wraps + mezze + frisdrank",
    iftar_special_price: "€35 voor 4 personen",
    contact_name: "Ahmad",
    contact_email: "info@shawarmaking.be",
    contact_phone: "+32 9 222 33 44",
    website_url: "https://example.com/shawarmaking",
    menu_url: null,
    reservation_url: null,
    facebook_url: null,
    instagram_url: "https://instagram.com/shawarmaking",
    uber_eats_url: "https://ubereats.com/shawarmaking",
    deliveroo_url: "https://deliveroo.be/shawarmaking",
    takeaway_url: "https://takeaway.com/shawarmaking",
    logo_url: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=200&h=200&fit=crop",
    cover_image_url: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800&h=400&fit=crop",
    opening_hours: null,
    status: "approved",
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
  // FREE TIER - Basic listing only
  {
    id: "dummy-free",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: "Slagerij Al-Medina",
    slug: "slagerij-al-medina",
    description: "Halal slagerij met vers vlees en huisbereide producten.",
    address: "Brugsepoortstraat 78",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0443,
    longitude: 3.7074,
    category: "butcher",
    cuisine_type: "middle_eastern",
    dish_types: ["grill", "chicken"],
    is_halal_certified: true,
    halal_certification_info: "Halal certified",
    partner_tier: "free",
    tier_expires_at: null,
    iftar_special: null,
    iftar_special_price: null,
    contact_name: "Ibrahim",
    contact_email: "info@almedina.be",
    contact_phone: "+32 9 345 67 89",
    website_url: "https://example.com",
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
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
  // ANOTHER FREE TIER
  {
    id: "dummy-free-2",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: "Supermarkt Al-Nour",
    slug: "supermarkt-al-nour",
    description: "Halal supermarkt met groot assortiment aan Midden-Oosterse producten.",
    address: "Nieuwland 52",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0480,
    longitude: 3.7100,
    category: "supermarket",
    cuisine_type: null,
    dish_types: null,
    is_halal_certified: false,
    halal_certification_info: null,
    partner_tier: "free",
    tier_expires_at: null,
    iftar_special: null,
    iftar_special_price: null,
    contact_name: "Hassan",
    contact_email: "info@alnour.be",
    contact_phone: "+32 9 888 99 00",
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
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
  // PARTNER PLUS TIER - Pizza & Burgers
  {
    id: "dummy-plus-2",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: "Halal Burger House",
    slug: "halal-burger-house",
    description: "De beste halal burgers van Gent! Smash burgers, loaded fries en milkshakes. 100% halal rundvlees van lokale slagers.",
    address: "Veldstraat 85",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0530,
    longitude: 3.7210,
    category: "restaurant",
    cuisine_type: "international",
    dish_types: ["burgers", "chicken", "snacks", "desserts"],
    is_halal_certified: true,
    halal_certification_info: "100% Halal Gecertificeerd",
    partner_tier: "partner_plus",
    tier_expires_at: null,
    iftar_special: "Iftar Burger Deal - Double smash burger + fries + drank voor €12",
    iftar_special_price: "€12",
    contact_name: "Yusuf",
    contact_email: "info@halalburgerhouse.be",
    contact_phone: "+32 9 666 77 88",
    website_url: "https://example.com/halalburgerhouse",
    menu_url: "https://example.com/halalburgerhouse/menu",
    reservation_url: null,
    facebook_url: "https://facebook.com/halalburgerhouse",
    instagram_url: "https://instagram.com/halalburgerhouse",
    uber_eats_url: "https://ubereats.com/halalburgerhouse",
    deliveroo_url: "https://deliveroo.be/halalburgerhouse",
    takeaway_url: "https://takeaway.com/halalburgerhouse",
    logo_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop",
    cover_image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=400&fit=crop",
    opening_hours: null,
    status: "approved",
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
  // PARTNER TIER - Italian/Mediterranean
  {
    id: "dummy-partner-6",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: "Pasta Halal",
    slug: "pasta-halal",
    description: "Verse Italiaanse pasta met halal vlees. Huisgemaakte sauzen en dagverse pasta.",
    address: "Kortrijksesteenweg 22",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0400,
    longitude: 3.7150,
    category: "restaurant",
    cuisine_type: "mediterranean",
    dish_types: ["pasta", "salads", "chicken", "fish"],
    is_halal_certified: true,
    halal_certification_info: "Halal vlees",
    partner_tier: "partner",
    tier_expires_at: null,
    iftar_special: "Pasta naar keuze + salade + tiramisu",
    iftar_special_price: "€15",
    contact_name: "Ali",
    contact_email: "info@pastahalal.be",
    contact_phone: "+32 9 111 22 44",
    website_url: "https://example.com/pastahalal",
    menu_url: null,
    reservation_url: null,
    facebook_url: "https://facebook.com/pastahalal",
    instagram_url: "https://instagram.com/pastahalal",
    uber_eats_url: null,
    deliveroo_url: "https://deliveroo.be/pastahalal",
    takeaway_url: null,
    logo_url: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=200&h=200&fit=crop",
    cover_image_url: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&h=400&fit=crop",
    opening_hours: null,
    status: "approved",
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
  // PARTNER TIER - Asian
  {
    id: "dummy-partner-7",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: "Wok & Roll Halal",
    slug: "wok-roll-halal",
    description: "Aziatische wok gerechten, sushi en noodles. Alles halal bereid zonder alcohol.",
    address: "Dendermondsesteenweg 150",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0580,
    longitude: 3.7350,
    category: "restaurant",
    cuisine_type: "asian",
    dish_types: ["rice", "chicken", "fish", "vegetarian", "soup"],
    is_halal_certified: false,
    halal_certification_info: null,
    partner_tier: "partner",
    tier_expires_at: null,
    iftar_special: "Wok deal - Wok naar keuze + spring rolls + soep",
    iftar_special_price: "€14",
    contact_name: "Wei",
    contact_email: "info@wokroll.be",
    contact_phone: "+32 9 333 22 11",
    website_url: "https://example.com/wokroll",
    menu_url: null,
    reservation_url: null,
    facebook_url: null,
    instagram_url: "https://instagram.com/wokrollhalal",
    uber_eats_url: "https://ubereats.com/wokroll",
    deliveroo_url: null,
    takeaway_url: "https://takeaway.com/wokroll",
    logo_url: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=200&h=200&fit=crop",
    cover_image_url: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&h=400&fit=crop",
    opening_hours: null,
    status: "approved",
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
  // PARTNER TIER - Catering
  {
    id: "dummy-partner-8",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: "Iftar Catering Gent",
    slug: "iftar-catering-gent",
    description: "Professionele halal catering voor iftar, feesten en events. Van 10 tot 500 personen.",
    address: "Industrieweg 25",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0620,
    longitude: 3.7400,
    category: "catering",
    cuisine_type: "moroccan",
    dish_types: ["grill", "rice", "salads", "soup", "desserts"],
    is_halal_certified: true,
    halal_certification_info: "HMC Certified",
    partner_tier: "partner",
    tier_expires_at: null,
    iftar_special: "Compleet iftar buffet - €20 p.p. (min. 20 personen)",
    iftar_special_price: "€20 p.p.",
    contact_name: "Karima",
    contact_email: "info@iftarcatering.be",
    contact_phone: "+32 9 444 66 88",
    website_url: "https://example.com/iftarcatering",
    menu_url: "https://example.com/iftarcatering/menu",
    reservation_url: "https://example.com/iftarcatering/offerte",
    facebook_url: "https://facebook.com/iftarcateringgent",
    instagram_url: "https://instagram.com/iftarcateringgent",
    uber_eats_url: null,
    deliveroo_url: null,
    takeaway_url: null,
    logo_url: "https://images.unsplash.com/photo-1555244162-803834f70033?w=200&h=200&fit=crop",
    cover_image_url: "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&h=400&fit=crop",
    opening_hours: null,
    status: "approved",
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
  // FREE TIER - Another Bakery
  {
    id: "dummy-free-3",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: "Pide House",
    slug: "pide-house",
    description: "Verse Turkse pide en lahmacun. Elke dag vers uit de steenoven.",
    address: "Bevrijdingslaan 88",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0350,
    longitude: 3.7300,
    category: "bakery",
    cuisine_type: "turkish",
    dish_types: ["bread", "pizza"],
    is_halal_certified: true,
    halal_certification_info: null,
    partner_tier: "free",
    tier_expires_at: null,
    iftar_special: null,
    iftar_special_price: null,
    contact_name: "Mustafa",
    contact_email: "info@pidehouse.be",
    contact_phone: "+32 9 222 44 66",
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
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
  // FREE TIER - Fish Restaurant
  {
    id: "dummy-free-4",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: "Fish Corner",
    slug: "fish-corner",
    description: "Verse vis en zeevruchten. Fish & chips, gebakken vis en vissoepen.",
    address: "Graslei 10",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0540,
    longitude: 3.7200,
    category: "restaurant",
    cuisine_type: "international",
    dish_types: ["fish", "snacks", "soup"],
    is_halal_certified: false,
    halal_certification_info: null,
    partner_tier: "free",
    tier_expires_at: null,
    iftar_special: null,
    iftar_special_price: null,
    contact_name: "Peter",
    contact_email: "info@fishcorner.be",
    contact_phone: "+32 9 777 88 99",
    website_url: "https://example.com/fishcorner",
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
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
];

// Dummy shop partners for demonstration
const dummyShopPartners: ShopPartner[] = [
  // PREMIUM - Decoratie
  {
    id: "shop-premium-1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: "Arabesque Home",
    slug: "arabesque-home",
    description: "Exclusieve Arabische interieur decoratie, handgemaakte lantaarns, kussens en wanddecoratie. Creëer de perfecte Ramadan sfeer in uw huis.",
    address: "Veldstraat 45",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0530,
    longitude: 3.7210,
    category: "decor",
    partner_tier: "premium",
    tier_expires_at: null,
    ramadan_special: "Ramadan Collectie 2026 - Complete sfeer pakketten met lantaarns, lichtsnoeren en tafelversiering",
    ramadan_special_discount: "15% korting op complete sets",
    contact_name: "Fatima El-Amrani",
    contact_email: "info@arabesquehome.be",
    contact_phone: "+32 9 111 22 33",
    website_url: "https://example.com/arabesquehome",
    facebook_url: "https://facebook.com/arabesquehome",
    instagram_url: "https://instagram.com/arabesquehome",
    logo_url: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=200&h=200&fit=crop",
    cover_image_url: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=800&h=400&fit=crop",
    opening_hours: null,
    status: "approved",
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
  // PARTNER PLUS - Kleding
  {
    id: "shop-plus-1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: "Modest Fashion Gent",
    slug: "modest-fashion-gent",
    description: "Trendy modest fashion voor dames. Abayas, hijabs, jumpsuits en meer. Van casual tot feestelijk.",
    address: "Langemunt 12",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0560,
    longitude: 3.7200,
    category: "clothing",
    partner_tier: "partner_plus",
    tier_expires_at: null,
    ramadan_special: "Eid Collectie Preview - Nieuwe festive wear voor Eid ul-Fitr",
    ramadan_special_discount: "20% early bird korting",
    contact_name: "Amina Bakker",
    contact_email: "info@modestfashion.be",
    contact_phone: "+32 9 222 33 44",
    website_url: "https://example.com/modestfashion",
    facebook_url: "https://facebook.com/modestfashiongent",
    instagram_url: "https://instagram.com/modestfashiongent",
    logo_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop",
    cover_image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop",
    opening_hours: null,
    status: "approved",
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
  // PARTNER - Spiritueel
  {
    id: "shop-partner-1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: "Barakah Books",
    slug: "barakah-books",
    description: "Islamitische boekhandel met Korans, religieuze boeken, gebedskleding en spirituele artikelen.",
    address: "Brabantdam 78",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0510,
    longitude: 3.7280,
    category: "spiritual",
    partner_tier: "partner",
    tier_expires_at: null,
    ramadan_special: "Ramadan Reading Pack - Koran + Tafsir + Dua boekje",
    ramadan_special_discount: "€35 (normaal €45)",
    contact_name: "Ahmed Mansour",
    contact_email: "info@barakahbooks.be",
    contact_phone: "+32 9 333 44 55",
    website_url: "https://example.com/barakahbooks",
    facebook_url: "https://facebook.com/barakahbooks",
    instagram_url: null,
    logo_url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=200&fit=crop",
    cover_image_url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop",
    opening_hours: null,
    status: "approved",
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
  // PARTNER - Geschenken
  {
    id: "shop-partner-2",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: "Eid Gifts & More",
    slug: "eid-gifts",
    description: "Unieke cadeaus voor Eid en speciale gelegenheden. Gepersonaliseerde items, gift boxes en meer.",
    address: "Sint-Pietersnieuwstraat 88",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0420,
    longitude: 3.7180,
    category: "gifts",
    partner_tier: "partner",
    tier_expires_at: null,
    ramadan_special: "Ramadan Gift Boxes - Gevuld met dadels, chocolade en attar",
    ramadan_special_discount: "Vanaf €25",
    contact_name: "Sara Yilmaz",
    contact_email: "info@eidgifts.be",
    contact_phone: "+32 9 444 55 66",
    website_url: "https://example.com/eidgifts",
    facebook_url: null,
    instagram_url: "https://instagram.com/eidgifts",
    logo_url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=200&h=200&fit=crop",
    cover_image_url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&h=400&fit=crop",
    opening_hours: null,
    status: "approved",
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
  // PARTNER - Beauty
  {
    id: "shop-partner-3",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: "Noor Beauty",
    slug: "noor-beauty",
    description: "Halal cosmetica en huidverzorging. Natuurlijke producten, attar parfums en beauty accessoires.",
    address: "Kouter 15",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0500,
    longitude: 3.7250,
    category: "beauty",
    partner_tier: "partner",
    tier_expires_at: null,
    ramadan_special: "Ramadan Glow Set - Complete huidverzorging routine",
    ramadan_special_discount: "25% korting",
    contact_name: "Layla Hassan",
    contact_email: "info@noorbeauty.be",
    contact_phone: "+32 9 555 66 77",
    website_url: "https://example.com/noorbeauty",
    facebook_url: "https://facebook.com/noorbeauty",
    instagram_url: "https://instagram.com/noorbeauty",
    logo_url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop",
    cover_image_url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=400&fit=crop",
    opening_hours: null,
    status: "approved",
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
  // FREE - Kids
  {
    id: "shop-free-1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: "Kidz Corner",
    slug: "kidz-corner",
    description: "Speelgoed, boeken en kleding voor moslim kinderen. Educatief speelgoed en Islamitische kinderboe ken.",
    address: "Wondelgemstraat 22",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0643,
    longitude: 3.7274,
    category: "kids",
    partner_tier: "free",
    tier_expires_at: null,
    ramadan_special: null,
    ramadan_special_discount: null,
    contact_name: "Mariam Ouali",
    contact_email: "info@kidzcorner.be",
    contact_phone: "+32 9 666 77 88",
    website_url: "https://example.com/kidzcorner",
    facebook_url: null,
    instagram_url: null,
    logo_url: null,
    cover_image_url: null,
    opening_hours: null,
    status: "approved",
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
  // FREE - Tech
  {
    id: "shop-free-2",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: "Tech Halal",
    slug: "tech-halal",
    description: "Elektronica en gadgets. Telefoons, tablets, accessoires en smart home producten.",
    address: "Overpoortstraat 55",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0380,
    longitude: 3.7230,
    category: "tech",
    partner_tier: "free",
    tier_expires_at: null,
    ramadan_special: null,
    ramadan_special_discount: null,
    contact_name: "Yusuf Ahmed",
    contact_email: "info@techhalal.be",
    contact_phone: "+32 9 777 88 99",
    website_url: null,
    facebook_url: null,
    instagram_url: null,
    logo_url: null,
    cover_image_url: null,
    opening_hours: null,
    status: "approved",
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
];

// Dummy activities for demonstration - at least 4 per category
const dummyActivities: Activity[] = [
  // ========== LECTURES (4) ==========
  {
    id: "lecture-1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: "Ramadan Lezing: De spirituele reis",
    description: "Een inspirerende lezing over de betekenis van Ramadan en hoe we deze maand optimaal kunnen benutten.",
    activity_type: "lecture",
    location_name: "Fatih Moskee",
    address: "Sleepstraat 67",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0543,
    longitude: 3.7174,
    event_date: "2026-03-15",
    start_time: "20:00",
    end_time: "21:30",
    is_recurring: false,
    recurrence_pattern: null,
    recurrence_end_date: null,
    organizer_name: "Fatih Moskee",
    organizer_email: "info@fatihmoskee.be",
    organizer_phone: "+32 9 123 45 67",
    registration_url: null,
    website_url: null,
    facebook_url: null,
    instagram_url: null,
    cover_image_url: null,
    is_free: true,
    price: null,
    capacity: 200,
    for_youth: false,
    for_women: false,
    for_men: true,
    for_families: false,
    status: "approved",
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
  {
    id: "lecture-2",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: "Tafsir Al-Quran: Surat Al-Baqarah",
    description: "Wekelijkse tafsir sessie over Surat Al-Baqarah. Verdiep je begrip van de Koran.",
    activity_type: "lecture",
    location_name: "Eyup Sultan Moskee",
    address: "Dendermondsesteenweg 400",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0600,
    longitude: 3.7500,
    event_date: "2026-03-16",
    start_time: "19:00",
    end_time: "20:30",
    is_recurring: true,
    recurrence_pattern: "weekly",
    recurrence_end_date: null,
    organizer_name: "Eyup Sultan Moskee",
    organizer_email: "info@eyupsultan.be",
    organizer_phone: null,
    registration_url: null,
    website_url: null,
    facebook_url: null,
    instagram_url: null,
    cover_image_url: null,
    is_free: true,
    price: null,
    capacity: 150,
    for_youth: true,
    for_women: false,
    for_men: true,
    for_families: false,
    status: "approved",
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
  {
    id: "lecture-3",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: "De rechten van de buren in Islam",
    description: "Lezing over het belang van goede buurrelaties vanuit islamitisch perspectief.",
    activity_type: "lecture",
    location_name: "Al Fath Moskee",
    address: "Bevrijdingslaan 110",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0400,
    longitude: 3.7300,
    event_date: "2026-03-18",
    start_time: "20:30",
    end_time: "22:00",
    is_recurring: false,
    recurrence_pattern: null,
    recurrence_end_date: null,
    organizer_name: "Al Fath Moskee",
    organizer_email: "info@alfath.be",
    organizer_phone: "+32 9 234 56 78",
    registration_url: null,
    website_url: null,
    facebook_url: null,
    instagram_url: null,
    cover_image_url: null,
    is_free: true,
    price: null,
    capacity: 100,
    for_youth: true,
    for_women: true,
    for_men: true,
    for_families: true,
    status: "approved",
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
  {
    id: "lecture-4",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: "Zusters Lezing: Moeders van de gelovigen",
    description: "Exclusieve lezing voor zusters over de vrouwen van de Profeet (vzmh).",
    activity_type: "lecture",
    location_name: "Islamitisch Centrum Gent",
    address: "Forelstraat 91",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0443,
    longitude: 3.7074,
    event_date: "2026-03-20",
    start_time: "14:00",
    end_time: "16:00",
    is_recurring: false,
    recurrence_pattern: null,
    recurrence_end_date: null,
    organizer_name: "ICG Zusters",
    organizer_email: "zusters@icg.be",
    organizer_phone: null,
    registration_url: null,
    website_url: null,
    facebook_url: null,
    instagram_url: null,
    cover_image_url: null,
    is_free: true,
    price: null,
    capacity: 80,
    for_youth: false,
    for_women: true,
    for_men: false,
    for_families: false,
    status: "approved",
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },

  // ========== WORKSHOPS (4) ==========
  {
    id: "workshop-1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: "Zusters Koran Cirkel",
    description: "Wekelijkse Koran studie exclusief voor zusters. Leer tajweed en verdiep je kennis.",
    activity_type: "workshop",
    location_name: "Islamitisch Centrum Gent",
    address: "Forelstraat 91",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0443,
    longitude: 3.7074,
    event_date: "2026-03-18",
    start_time: "14:00",
    end_time: "16:00",
    is_recurring: true,
    recurrence_pattern: "weekly",
    recurrence_end_date: null,
    organizer_name: "ICG",
    organizer_email: "info@icg.be",
    organizer_phone: null,
    registration_url: "https://example.com/register",
    website_url: null,
    facebook_url: null,
    instagram_url: null,
    cover_image_url: null,
    is_free: true,
    price: null,
    capacity: 30,
    for_youth: false,
    for_women: true,
    for_men: false,
    for_families: false,
    status: "approved",
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
  {
    id: "workshop-2",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: "Arabisch voor beginners",
    description: "Leer de basis van de Arabische taal. Ideaal voor nieuwkomers die de Koran beter willen begrijpen.",
    activity_type: "workshop",
    location_name: "Cultureel Centrum De Centrale",
    address: "Kraankindersstraat 2",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0510,
    longitude: 3.7220,
    event_date: "2026-03-17",
    start_time: "10:00",
    end_time: "12:00",
    is_recurring: true,
    recurrence_pattern: "weekly",
    recurrence_end_date: null,
    organizer_name: "Taalschool Al-Noor",
    organizer_email: "info@alnoor-taal.be",
    organizer_phone: "+32 9 345 67 89",
    registration_url: "https://example.com/arabisch",
    website_url: null,
    facebook_url: null,
    instagram_url: null,
    cover_image_url: null,
    is_free: false,
    price: "€50 per maand",
    capacity: 20,
    for_youth: true,
    for_women: true,
    for_men: true,
    for_families: false,
    status: "approved",
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
  {
    id: "workshop-3",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: "Islamitische kalligrafie workshop",
    description: "Ontdek de kunst van Arabische kalligrafie. Alle materialen worden voorzien.",
    activity_type: "workshop",
    location_name: "Kunstencentrum Vooruit",
    address: "Sint-Pietersnieuwstraat 23",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0450,
    longitude: 3.7250,
    event_date: "2026-03-22",
    start_time: "14:00",
    end_time: "17:00",
    is_recurring: false,
    recurrence_pattern: null,
    recurrence_end_date: null,
    organizer_name: "Kalligrafie Meester Ahmed",
    organizer_email: "ahmed@kalligrafie.be",
    organizer_phone: null,
    registration_url: "https://example.com/kalligrafie",
    website_url: null,
    facebook_url: null,
    instagram_url: null,
    cover_image_url: null,
    is_free: false,
    price: "€25",
    capacity: 15,
    for_youth: true,
    for_women: true,
    for_men: true,
    for_families: true,
    status: "approved",
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
  {
    id: "workshop-4",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: "Iftar koken: Marokkaanse specialiteiten",
    description: "Leer authentieke Marokkaanse iftar gerechten bereiden. Harira, briwat en meer!",
    activity_type: "workshop",
    location_name: "Kookstudio De Smaak",
    address: "Vlasmarkt 12",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0530,
    longitude: 3.7200,
    event_date: "2026-03-19",
    start_time: "15:00",
    end_time: "18:00",
    is_recurring: false,
    recurrence_pattern: null,
    recurrence_end_date: null,
    organizer_name: "Chef Karima",
    organizer_email: "karima@koken.be",
    organizer_phone: "+32 9 111 22 33",
    registration_url: "https://example.com/koken",
    website_url: null,
    facebook_url: null,
    instagram_url: null,
    cover_image_url: null,
    is_free: false,
    price: "€35 incl. ingrediënten",
    capacity: 12,
    for_youth: false,
    for_women: true,
    for_men: true,
    for_families: false,
    status: "approved",
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },

  // ========== CHARITY (4) ==========
  {
    id: "charity-1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: "Voedselactie voor minderbedeelden",
    description: "Help mee met het inzamelen en verdelen van voedselpakketten voor families in nood.",
    activity_type: "charity",
    location_name: "Buurtcentrum De Wijkuit",
    address: "Bevrijdingslaan 5",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0343,
    longitude: 3.7374,
    event_date: "2026-03-20",
    start_time: "10:00",
    end_time: "14:00",
    is_recurring: false,
    recurrence_pattern: null,
    recurrence_end_date: null,
    organizer_name: "VZW Helpende Hand",
    organizer_email: "info@helpendehand.be",
    organizer_phone: "+32 9 456 78 90",
    registration_url: null,
    website_url: null,
    facebook_url: null,
    instagram_url: null,
    cover_image_url: null,
    is_free: true,
    price: null,
    capacity: null,
    for_youth: true,
    for_women: true,
    for_men: true,
    for_families: true,
    status: "approved",
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
  {
    id: "charity-2",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: "Kledingactie voor vluchtelingen",
    description: "Doneer warme kleding en dekens voor vluchtelingenfamilies in Gent.",
    activity_type: "charity",
    location_name: "Rode Kruis Gent",
    address: "Gasmeterlaan 89",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0480,
    longitude: 3.7400,
    event_date: "2026-03-16",
    start_time: "09:00",
    end_time: "17:00",
    is_recurring: false,
    recurrence_pattern: null,
    recurrence_end_date: null,
    organizer_name: "Rode Kruis Gent",
    organizer_email: "gent@rodekruis.be",
    organizer_phone: "+32 9 222 33 44",
    registration_url: null,
    website_url: null,
    facebook_url: null,
    instagram_url: null,
    cover_image_url: null,
    is_free: true,
    price: null,
    capacity: null,
    for_youth: true,
    for_women: true,
    for_men: true,
    for_families: true,
    status: "approved",
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
  {
    id: "charity-3",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: "Zakat distributie - Ramadan 2026",
    description: "Officiële zakat distributie via erkende instantie. Meld je aan als vrijwilliger.",
    activity_type: "charity",
    location_name: "Fatih Moskee",
    address: "Sleepstraat 67",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0543,
    longitude: 3.7174,
    event_date: "2026-03-25",
    start_time: "10:00",
    end_time: "16:00",
    is_recurring: false,
    recurrence_pattern: null,
    recurrence_end_date: null,
    organizer_name: "Zakat Foundation Belgium",
    organizer_email: "info@zakatbe.org",
    organizer_phone: null,
    registration_url: "https://example.com/zakat",
    website_url: null,
    facebook_url: null,
    instagram_url: null,
    cover_image_url: null,
    is_free: true,
    price: null,
    capacity: 50,
    for_youth: true,
    for_women: true,
    for_men: true,
    for_families: false,
    status: "approved",
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
  {
    id: "charity-4",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: "Bloeddonatie actie",
    description: "Geef bloed, red levens. Speciale bloeddonatie actie tijdens Ramadan.",
    activity_type: "charity",
    location_name: "UZ Gent",
    address: "Corneel Heymanslaan 10",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0240,
    longitude: 3.7300,
    event_date: "2026-03-21",
    start_time: "08:00",
    end_time: "14:00",
    is_recurring: false,
    recurrence_pattern: null,
    recurrence_end_date: null,
    organizer_name: "Rode Kruis Vlaanderen",
    organizer_email: "bloed@rodekruis.be",
    organizer_phone: null,
    registration_url: "https://example.com/bloed",
    website_url: null,
    facebook_url: null,
    instagram_url: null,
    cover_image_url: null,
    is_free: true,
    price: null,
    capacity: 100,
    for_youth: false,
    for_women: true,
    for_men: true,
    for_families: false,
    status: "approved",
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },

  // ========== COMMUNITY (4) ==========
  {
    id: "community-1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: "Familie Iftar & Spelletjesavond",
    description: "Gezellige iftar voor het hele gezin gevolgd door spelletjes en activiteiten voor kinderen.",
    activity_type: "community",
    location_name: "Cultureel Centrum De Centrale",
    address: "Kraankindersstraat 2",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0510,
    longitude: 3.7220,
    event_date: "2026-03-25",
    start_time: "18:30",
    end_time: "21:00",
    is_recurring: false,
    recurrence_pattern: null,
    recurrence_end_date: null,
    organizer_name: "Gentse Moslim Families",
    organizer_email: "info@gmf.be",
    organizer_phone: "+32 9 777 88 99",
    registration_url: "https://example.com/familie-iftar",
    website_url: null,
    facebook_url: null,
    instagram_url: null,
    cover_image_url: null,
    is_free: false,
    price: "€10 per gezin",
    capacity: 100,
    for_youth: true,
    for_women: true,
    for_men: true,
    for_families: true,
    status: "approved",
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
  {
    id: "community-2",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: "Multiculturele Iftar Gent",
    description: "Iftar voor alle Gentenaars - ongeacht achtergrond. Ontmoet je buren!",
    activity_type: "community",
    location_name: "Stadhuis Gent",
    address: "Botermarkt 1",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0535,
    longitude: 3.7250,
    event_date: "2026-03-23",
    start_time: "19:00",
    end_time: "21:30",
    is_recurring: false,
    recurrence_pattern: null,
    recurrence_end_date: null,
    organizer_name: "Stad Gent",
    organizer_email: "diversiteit@stad.gent",
    organizer_phone: null,
    registration_url: "https://example.com/multicultureel",
    website_url: null,
    facebook_url: null,
    instagram_url: null,
    cover_image_url: null,
    is_free: true,
    price: null,
    capacity: 300,
    for_youth: true,
    for_women: true,
    for_men: true,
    for_families: true,
    status: "approved",
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
  {
    id: "community-3",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: "Buurtiftar Wondelgem",
    description: "Jaarlijkse buurtiftar voor alle inwoners van Wondelgem en omstreken.",
    activity_type: "community",
    location_name: "Gemeenschapscentrum Wondelgem",
    address: "Botestraat 98",
    city: "Gent",
    postal_code: "9032",
    latitude: 51.0700,
    longitude: 3.7200,
    event_date: "2026-03-27",
    start_time: "18:00",
    end_time: "21:00",
    is_recurring: false,
    recurrence_pattern: null,
    recurrence_end_date: null,
    organizer_name: "Buurtwerking Wondelgem",
    organizer_email: "info@wondelgem.be",
    organizer_phone: "+32 9 333 44 55",
    registration_url: null,
    website_url: null,
    facebook_url: null,
    instagram_url: null,
    cover_image_url: null,
    is_free: true,
    price: null,
    capacity: 150,
    for_youth: true,
    for_women: true,
    for_men: true,
    for_families: true,
    status: "approved",
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
  {
    id: "community-4",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: "Open Moskee Dag",
    description: "Kom kennismaken met de moskee. Rondleiding, thee, en gesprek met de imam.",
    activity_type: "community",
    location_name: "Al Fath Moskee",
    address: "Bevrijdingslaan 110",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0400,
    longitude: 3.7300,
    event_date: "2026-03-29",
    start_time: "14:00",
    end_time: "17:00",
    is_recurring: false,
    recurrence_pattern: null,
    recurrence_end_date: null,
    organizer_name: "Al Fath Moskee",
    organizer_email: "info@alfath.be",
    organizer_phone: null,
    registration_url: null,
    website_url: null,
    facebook_url: null,
    instagram_url: null,
    cover_image_url: null,
    is_free: true,
    price: null,
    capacity: 50,
    for_youth: true,
    for_women: true,
    for_men: true,
    for_families: true,
    status: "approved",
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },

  // ========== YOUTH (4) ==========
  {
    id: "youth-1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: "Jongerenbijeenkomst: Ramadan Challenge",
    description: "Speciaal voor jongeren! Doe mee aan de Ramadan Challenge en win prijzen.",
    activity_type: "youth",
    location_name: "Jeugdhuis Trefpunt",
    address: "Dok Noord 7",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0643,
    longitude: 3.7474,
    event_date: "2026-03-22",
    start_time: "18:00",
    end_time: "20:00",
    is_recurring: true,
    recurrence_pattern: "weekly",
    recurrence_end_date: null,
    organizer_name: "Moslimjongeren Gent",
    organizer_email: "info@mjg.be",
    organizer_phone: null,
    registration_url: "https://example.com/ramadan-challenge",
    website_url: null,
    facebook_url: null,
    instagram_url: null,
    cover_image_url: null,
    is_free: true,
    price: null,
    capacity: 50,
    for_youth: true,
    for_women: true,
    for_men: true,
    for_families: false,
    status: "approved",
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
  {
    id: "youth-2",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: "Gaming Night - Halal Edition",
    description: "Gezellige game-avond voor moslimjongeren. FIFA toernooi en meer!",
    activity_type: "youth",
    location_name: "Jeugdcentrum De Brug",
    address: "Blekerijstraat 50",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0550,
    longitude: 3.7150,
    event_date: "2026-03-24",
    start_time: "19:00",
    end_time: "23:00",
    is_recurring: false,
    recurrence_pattern: null,
    recurrence_end_date: null,
    organizer_name: "Muslim Youth Gent",
    organizer_email: "info@muslimy.be",
    organizer_phone: null,
    registration_url: "https://example.com/gaming",
    website_url: null,
    facebook_url: null,
    instagram_url: null,
    cover_image_url: null,
    is_free: true,
    price: null,
    capacity: 40,
    for_youth: true,
    for_women: false,
    for_men: true,
    for_families: false,
    status: "approved",
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
  {
    id: "youth-3",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: "Sisters Suhoor Hangout",
    description: "Late night suhoor en gezelligheid voor zusters tussen 16-25 jaar.",
    activity_type: "youth",
    location_name: "Zusters Centrum Gent",
    address: "Onderstraat 22",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0520,
    longitude: 3.7180,
    event_date: "2026-03-26",
    start_time: "02:00",
    end_time: "05:00",
    is_recurring: false,
    recurrence_pattern: null,
    recurrence_end_date: null,
    organizer_name: "Sisters United",
    organizer_email: "info@sisters.be",
    organizer_phone: null,
    registration_url: "https://example.com/suhoor",
    website_url: null,
    facebook_url: null,
    instagram_url: null,
    cover_image_url: null,
    is_free: true,
    price: null,
    capacity: 25,
    for_youth: true,
    for_women: true,
    for_men: false,
    for_families: false,
    status: "approved",
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
  {
    id: "youth-4",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: "Career Talk: Moslimjongeren in het bedrijfsleven",
    description: "Inspirerende verhalen van succesvolle moslimprofessionals. Netwerkmogelijkheden.",
    activity_type: "youth",
    location_name: "UGent Campus Sterre",
    address: "Krijgslaan 281",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0280,
    longitude: 3.7100,
    event_date: "2026-03-28",
    start_time: "14:00",
    end_time: "17:00",
    is_recurring: false,
    recurrence_pattern: null,
    recurrence_end_date: null,
    organizer_name: "Muslim Students Gent",
    organizer_email: "info@msg.be",
    organizer_phone: null,
    registration_url: "https://example.com/career",
    website_url: null,
    facebook_url: null,
    instagram_url: null,
    cover_image_url: null,
    is_free: true,
    price: null,
    capacity: 100,
    for_youth: true,
    for_women: true,
    for_men: true,
    for_families: false,
    status: "approved",
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },

  // ========== SPORTS (4) ==========
  {
    id: "sports-1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: "Brothers Voetbaltoernooi",
    description: "5x5 voetbaltoernooi voor broeders. Vorm je team en schrijf je in!",
    activity_type: "sports",
    location_name: "Sporthal Blaarmeersen",
    address: "Zuiderlaan 14",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0350,
    longitude: 3.6900,
    event_date: "2026-03-21",
    start_time: "14:00",
    end_time: "18:00",
    is_recurring: false,
    recurrence_pattern: null,
    recurrence_end_date: null,
    organizer_name: "Muslim Sports Gent",
    organizer_email: "info@muslimsports.be",
    organizer_phone: "+32 9 444 55 66",
    registration_url: "https://example.com/voetbal",
    website_url: null,
    facebook_url: null,
    instagram_url: null,
    cover_image_url: null,
    is_free: false,
    price: "€5 per persoon",
    capacity: 80,
    for_youth: true,
    for_women: false,
    for_men: true,
    for_families: false,
    status: "approved",
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
  {
    id: "sports-2",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: "Sisters Zwemmen - Alleen voor vrouwen",
    description: "Zwemmen exclusief voor zusters. Volledig privacy gegarandeerd.",
    activity_type: "sports",
    location_name: "Zwembad Rozebroeken",
    address: "Rozebroeken 101",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0600,
    longitude: 3.7000,
    event_date: "2026-03-23",
    start_time: "10:00",
    end_time: "12:00",
    is_recurring: true,
    recurrence_pattern: "weekly",
    recurrence_end_date: null,
    organizer_name: "Sisters Sports",
    organizer_email: "info@sisterssports.be",
    organizer_phone: null,
    registration_url: "https://example.com/zwemmen",
    website_url: null,
    facebook_url: null,
    instagram_url: null,
    cover_image_url: null,
    is_free: false,
    price: "€8 per sessie",
    capacity: 30,
    for_youth: true,
    for_women: true,
    for_men: false,
    for_families: false,
    status: "approved",
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
  {
    id: "sports-3",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: "Ramadan Running Club",
    description: "Ochtendloop voor fitnessliefhebbers. 5K route door het Citadelpark.",
    activity_type: "sports",
    location_name: "Citadelpark - Ingang",
    address: "Charles de Kerckhovelaan",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0420,
    longitude: 3.7180,
    event_date: "2026-03-17",
    start_time: "06:30",
    end_time: "07:30",
    is_recurring: true,
    recurrence_pattern: "daily",
    recurrence_end_date: null,
    organizer_name: "Muslim Runners Belgium",
    organizer_email: "info@muslimrunners.be",
    organizer_phone: null,
    registration_url: null,
    website_url: null,
    facebook_url: null,
    instagram_url: null,
    cover_image_url: null,
    is_free: true,
    price: null,
    capacity: null,
    for_youth: true,
    for_women: true,
    for_men: true,
    for_families: false,
    status: "approved",
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
  {
    id: "sports-4",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: "Basketbal Brothers Night",
    description: "Wekelijkse basketbaltraining en vriendschappelijke wedstrijden.",
    activity_type: "sports",
    location_name: "Sporthal Ledeberg",
    address: "Sportpleinstraat 2",
    city: "Gent",
    postal_code: "9050",
    latitude: 51.0380,
    longitude: 3.7400,
    event_date: "2026-03-19",
    start_time: "20:00",
    end_time: "22:00",
    is_recurring: true,
    recurrence_pattern: "weekly",
    recurrence_end_date: null,
    organizer_name: "Brothers Basketball",
    organizer_email: "info@brosbasket.be",
    organizer_phone: null,
    registration_url: null,
    website_url: null,
    facebook_url: null,
    instagram_url: null,
    cover_image_url: null,
    is_free: false,
    price: "€3 per avond",
    capacity: 20,
    for_youth: true,
    for_women: false,
    for_men: true,
    for_families: false,
    status: "approved",
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },

  // ========== SHOPPING - WINKELS (4) ==========
  {
    id: "shopping-1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: "Al-Noor Modest Fashion",
    description: "Modeste kleding voor dames en heren. Abayas, thawbs, hijabs en meer. Ramadan collectie nu beschikbaar!",
    activity_type: "shopping",
    location_name: "Al-Noor Modest Fashion",
    address: "Sleepstraat 45",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0540,
    longitude: 3.7170,
    event_date: "2026-03-15",
    start_time: "10:00",
    end_time: "19:00",
    is_recurring: true,
    recurrence_pattern: "daily",
    recurrence_end_date: null,
    organizer_name: "Al-Noor Fashion",
    organizer_email: "info@alnoorfashion.be",
    organizer_phone: "+32 9 123 11 22",
    registration_url: null,
    website_url: "https://example.com/alnoorfashion",
    facebook_url: "https://facebook.com/alnoorfashion",
    instagram_url: "https://instagram.com/alnoorfashion",
    cover_image_url: null,
    is_free: true,
    price: null,
    capacity: null,
    for_youth: true,
    for_women: true,
    for_men: true,
    for_families: true,
    status: "approved",
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
  {
    id: "shopping-2",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: "Istanbul Meubelen",
    description: "Turkse en Marokkaanse meubelen, tapijten, en woondecoratie. Gratis levering in Gent.",
    activity_type: "shopping",
    location_name: "Istanbul Meubelen",
    address: "Brugsepoortstraat 150",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0500,
    longitude: 3.7050,
    event_date: "2026-03-15",
    start_time: "10:00",
    end_time: "18:00",
    is_recurring: true,
    recurrence_pattern: "daily",
    recurrence_end_date: null,
    organizer_name: "Istanbul Meubelen",
    organizer_email: "info@istanbulmeubelen.be",
    organizer_phone: "+32 9 234 55 66",
    registration_url: null,
    website_url: "https://example.com/istanbulmeubelen",
    facebook_url: null,
    instagram_url: null,
    cover_image_url: null,
    is_free: true,
    price: null,
    capacity: null,
    for_youth: false,
    for_women: true,
    for_men: true,
    for_families: true,
    status: "approved",
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
  {
    id: "shopping-3",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: "Parfumerie Al-Oud",
    description: "Arabische parfums, oud, bakhoor en attar. Premium kwaliteit uit Dubai en Saudi-Arabië.",
    activity_type: "shopping",
    location_name: "Parfumerie Al-Oud",
    address: "Veldstraat 120",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0525,
    longitude: 3.7220,
    event_date: "2026-03-15",
    start_time: "10:00",
    end_time: "19:00",
    is_recurring: true,
    recurrence_pattern: "daily",
    recurrence_end_date: null,
    organizer_name: "Al-Oud Parfums",
    organizer_email: "info@aloud.be",
    organizer_phone: "+32 9 345 66 77",
    registration_url: null,
    website_url: "https://example.com/aloud",
    facebook_url: null,
    instagram_url: "https://instagram.com/aloudparfums",
    cover_image_url: null,
    is_free: true,
    price: null,
    capacity: null,
    for_youth: true,
    for_women: true,
    for_men: true,
    for_families: false,
    status: "approved",
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
  {
    id: "shopping-4",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: "Kitab Boekhandel",
    description: "Islamitische boeken, Korans, kinderboeken, en educatief materiaal. Groot assortiment in NL, AR en EN.",
    activity_type: "shopping",
    location_name: "Kitab Boekhandel",
    address: "Wondelgemstraat 88",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0620,
    longitude: 3.7250,
    event_date: "2026-03-15",
    start_time: "09:00",
    end_time: "18:00",
    is_recurring: true,
    recurrence_pattern: "daily",
    recurrence_end_date: null,
    organizer_name: "Kitab Boekhandel",
    organizer_email: "info@kitab.be",
    organizer_phone: "+32 9 456 77 88",
    registration_url: null,
    website_url: "https://example.com/kitab",
    facebook_url: "https://facebook.com/kitabgent",
    instagram_url: null,
    cover_image_url: null,
    is_free: true,
    price: null,
    capacity: null,
    for_youth: true,
    for_women: true,
    for_men: true,
    for_families: true,
    status: "approved",
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },

  // ========== OTHER (4) ==========
  {
    id: "other-1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: "Ramadan Lights Opening Ceremony",
    description: "Officiële opening van Ramadan Lights 2026. Lichtshow, muziek en speeches.",
    activity_type: "other",
    location_name: "Korenmarkt",
    address: "Korenmarkt",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0537,
    longitude: 3.7231,
    event_date: "2026-03-01",
    start_time: "19:00",
    end_time: "21:00",
    is_recurring: false,
    recurrence_pattern: null,
    recurrence_end_date: null,
    organizer_name: "VGM",
    organizer_email: "vzwvgm@gmail.com",
    organizer_phone: null,
    registration_url: null,
    website_url: null,
    facebook_url: null,
    instagram_url: null,
    cover_image_url: null,
    is_free: true,
    price: null,
    capacity: 1000,
    for_youth: true,
    for_women: true,
    for_men: true,
    for_families: true,
    status: "approved",
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
  {
    id: "other-2",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: "Eid ul-Fitr Gebed - Flanders Expo",
    description: "Groot Eid gebed voor de hele Gentse moslimgemeenschap.",
    activity_type: "other",
    location_name: "Flanders Expo",
    address: "Maaltekouter 1",
    city: "Gent",
    postal_code: "9051",
    latitude: 51.0350,
    longitude: 3.7450,
    event_date: "2026-03-31",
    start_time: "08:00",
    end_time: "10:00",
    is_recurring: false,
    recurrence_pattern: null,
    recurrence_end_date: null,
    organizer_name: "Executief Moslims België",
    organizer_email: "info@emb.be",
    organizer_phone: null,
    registration_url: null,
    website_url: null,
    facebook_url: null,
    instagram_url: null,
    cover_image_url: null,
    is_free: true,
    price: null,
    capacity: 5000,
    for_youth: true,
    for_women: true,
    for_men: true,
    for_families: true,
    status: "approved",
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
  {
    id: "other-3",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: "Ramadan Fototentoonstelling",
    description: "Fototentoonstelling over Ramadan tradities wereldwijd. Gratis toegang.",
    activity_type: "other",
    location_name: "STAM Gent",
    address: "Godshuizenlaan 2",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0400,
    longitude: 3.7100,
    event_date: "2026-03-15",
    start_time: "10:00",
    end_time: "18:00",
    is_recurring: true,
    recurrence_pattern: "daily",
    recurrence_end_date: null,
    organizer_name: "STAM Museum",
    organizer_email: "info@stam.gent",
    organizer_phone: null,
    registration_url: null,
    website_url: null,
    facebook_url: null,
    instagram_url: null,
    cover_image_url: null,
    is_free: true,
    price: null,
    capacity: null,
    for_youth: true,
    for_women: true,
    for_men: true,
    for_families: true,
    status: "approved",
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
  {
    id: "other-4",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: "Nacht van de Kader",
    description: "Speciale nachtelijke aanbidding op Laylat al-Qadr. Tarawih, dua en Koran recitatie.",
    activity_type: "other",
    location_name: "Alle Moskeeën in Gent",
    address: "Diverse locaties",
    city: "Gent",
    postal_code: "9000",
    latitude: 51.0543,
    longitude: 3.7174,
    event_date: "2026-03-27",
    start_time: "21:00",
    end_time: "05:00",
    is_recurring: false,
    recurrence_pattern: null,
    recurrence_end_date: null,
    organizer_name: "Moskeeën Gent",
    organizer_email: "info@moskeeengent.be",
    organizer_phone: null,
    registration_url: null,
    website_url: null,
    facebook_url: null,
    instagram_url: null,
    cover_image_url: null,
    is_free: true,
    price: null,
    capacity: null,
    for_youth: true,
    for_women: true,
    for_men: true,
    for_families: true,
    status: "approved",
    approval_token: "xxx",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    rejection_reason: null,
  },
];

// Filter chip component
function FilterChip({
  label,
  icon,
  active,
  onClick,
  count,
}: {
  label: string;
  icon?: React.ReactNode;
  active: boolean;
  onClick: () => void;
  count?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
        active
          ? "bg-teal text-white shadow-md"
          : "bg-white text-text-secondary hover:bg-gray-100 border border-gray-200"
      }`}
    >
      {icon}
      {label}
      {count !== undefined && count > 0 && (
        <span
          className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
            active ? "bg-white/20 text-white" : "bg-gray-100 text-text-muted"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

export default function WatTeDoenPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [foodPartners, setFoodPartners] = useState<FoodPartner[]>([]);
  const [shopPartners, setShopPartners] = useState<ShopPartner[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);
  const [isLoadingPartners, setIsLoadingPartners] = useState(true);
  const [isLoadingShopPartners, setIsLoadingShopPartners] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>("food");
  const [showFilters, setShowFilters] = useState(false);
  const [partnerViewMode, setPartnerViewMode] = useState<"list" | "map">("list");

  // Lock body scroll when filter overlay is open on mobile
  useEffect(() => {
    if (showFilters) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showFilters]);

  // Food partner filters
  const [foodFilters, setFoodFilters] = useState({
    cuisineType: null as CuisineType | null,
    dishType: null as DishType | null,
    category: null as FoodPartnerCategory | null,
    halalCertified: false,
    hasDelivery: false,
    hasTakeaway: false,
  });

  // Shop partner filters
  const [shopFilters, setShopFilters] = useState({
    category: null as ShopCategory | null,
    hasRamadanSpecial: false,
  });

  // Activity filters
  const [activityFilters, setActivityFilters] = useState({
    forMen: false,
    forWomen: false,
    forFamilies: false,
    forYouth: false,
    city: "",
  });

  // Calendar view state for activities
  type ActivityViewMode = "list" | "3days" | "week" | "month";
  const [activityViewMode, setActivityViewMode] = useState<ActivityViewMode>("list");
  const [calendarStartDate, setCalendarStartDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });

  const navigateCalendar = (direction: "prev" | "next") => {
    const offset = activityViewMode === "3days" ? 3 : activityViewMode === "week" ? 7 : 30;
    const newDate = new Date(calendarStartDate);
    newDate.setDate(calendarStartDate.getDate() + (direction === "next" ? offset : -offset));
    setCalendarStartDate(newDate);
  };

  const goToToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setCalendarStartDate(today);
  };

  const getCalendarDays = () => {
    if (activityViewMode === "month") {
      // Show full month grid (35 days starting from start of week containing startDate)
      const startOfMonth = new Date(calendarStartDate.getFullYear(), calendarStartDate.getMonth(), 1);
      const firstDayOfWeek = (startOfMonth.getDay() + 6) % 7; // Monday = 0
      const startDate = new Date(startOfMonth);
      startDate.setDate(startDate.getDate() - firstDayOfWeek);

      const days: Date[] = [];
      for (let i = 0; i < 35; i++) {
        const day = new Date(startDate);
        day.setDate(startDate.getDate() + i);
        days.push(day);
      }
      return days;
    } else {
      const numDays = activityViewMode === "3days" ? 3 : 7;
      const result: Date[] = [];
      for (let i = 0; i < numDays; i++) {
        const day = new Date(calendarStartDate);
        day.setDate(calendarStartDate.getDate() + i);
        result.push(day);
      }
      return result;
    }
  };

  const calendarDays = getCalendarDays();
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const MONTH_NAMES = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];
  const DAY_NAMES_FULL = ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"];

  // FAB menu state
  const [showAddMenu, setShowAddMenu] = useState(false);

  // CTA section ref and visibility state for floating FAB
  const ctaSectionRef = useRef<HTMLDivElement>(null);
  const [ctaInView, setCtaInView] = useState(false);

  // Track CTA section visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setCtaInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (ctaSectionRef.current) {
      observer.observe(ctaSectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Scroll refs for arrow navigation
  const foodFilterScrollRef = useRef<HTMLDivElement>(null);
  const shopFilterScrollRef = useRef<HTMLDivElement>(null);

  const scrollFilters = (direction: "left" | "right") => {
    if (foodFilterScrollRef.current) {
      const scrollAmount = 200;
      foodFilterScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollShopFilters = (direction: "left" | "right") => {
    if (shopFilterScrollRef.current) {
      const scrollAmount = 200;
      shopFilterScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    async function fetchActivities() {
      try {
        const response = await fetch("/api/activities/list");
        const data = await response.json();
        if (data.success && data.data.length > 0) {
          setActivities(data.data);
        } else {
          setActivities(dummyActivities);
        }
      } catch (error) {
        console.error("Error fetching activities:", error);
        setActivities(dummyActivities);
      } finally {
        setIsLoadingActivities(false);
      }
    }

    async function fetchFoodPartners() {
      try {
        const response = await fetch("/api/food-partners/list");
        const data = await response.json();
        if (data.success && data.data.length > 0) {
          setFoodPartners(data.data);
        } else {
          setFoodPartners(dummyFoodPartners);
        }
      } catch (error) {
        console.error("Error fetching food partners:", error);
        setFoodPartners(dummyFoodPartners);
      } finally {
        setIsLoadingPartners(false);
      }
    }

    async function fetchShopPartners() {
      try {
        const response = await fetch("/api/shop-partners/list");
        const data = await response.json();
        if (data.success && data.data.length > 0) {
          setShopPartners(data.data);
        } else {
          setShopPartners(dummyShopPartners);
        }
      } catch (error) {
        console.error("Error fetching shop partners:", error);
        setShopPartners(dummyShopPartners);
      } finally {
        setIsLoadingShopPartners(false);
      }
    }

    fetchActivities();
    fetchFoodPartners();
    fetchShopPartners();
  }, []);

  // Check if any filter is active
  const hasActiveFoodFilters =
    foodFilters.cuisineType !== null ||
    foodFilters.dishType !== null ||
    foodFilters.category !== null ||
    foodFilters.halalCertified ||
    foodFilters.hasDelivery ||
    foodFilters.hasTakeaway;

  const hasActiveActivityFilters =
    activityFilters.forMen ||
    activityFilters.forWomen ||
    activityFilters.forFamilies ||
    activityFilters.forYouth ||
    activityFilters.city !== "";

  const hasActiveShopFilters =
    shopFilters.category !== null ||
    shopFilters.hasRamadanSpecial;

  // Filter food partners
  const filteredFoodPartners = useMemo(() => {
    let result = [...foodPartners];

    if (foodFilters.cuisineType) {
      result = result.filter((p) => p.cuisine_type === foodFilters.cuisineType);
    }
    if (foodFilters.dishType) {
      result = result.filter((p) => p.dish_types?.includes(foodFilters.dishType!));
    }
    if (foodFilters.category) {
      result = result.filter((p) => p.category === foodFilters.category);
    }
    if (foodFilters.halalCertified) {
      result = result.filter((p) => p.is_halal_certified);
    }
    if (foodFilters.hasDelivery) {
      result = result.filter(
        (p) => p.uber_eats_url || p.deliveroo_url || p.takeaway_url
      );
    }
    if (foodFilters.hasTakeaway) {
      result = result.filter((p) => p.takeaway_url);
    }

    // Sort by tier (premium first)
    const tierOrder = { premium: 0, partner_plus: 1, partner: 2, free: 3 };
    result.sort((a, b) => tierOrder[a.partner_tier] - tierOrder[b.partner_tier]);

    return result;
  }, [foodPartners, foodFilters]);

  // Filter activities by selected category and filters
  const filteredActivities = useMemo(() => {
    if (selectedCategory === "food" || selectedCategory === "shopping") return [];

    let result = activities.filter(
      (activity) => activity.activity_type === selectedCategory
    );

    // Apply audience filters
    if (activityFilters.forMen) {
      result = result.filter((a) => a.for_men);
    }
    if (activityFilters.forWomen) {
      result = result.filter((a) => a.for_women);
    }
    if (activityFilters.forFamilies) {
      result = result.filter((a) => a.for_families);
    }
    if (activityFilters.forYouth) {
      result = result.filter((a) => a.for_youth);
    }
    if (activityFilters.city) {
      result = result.filter((a) =>
        a.city.toLowerCase().includes(activityFilters.city.toLowerCase())
      );
    }

    return result;
  }, [activities, selectedCategory, activityFilters]);

  // Filter shop partners
  const filteredShopPartners = useMemo(() => {
    let result = [...shopPartners];

    if (shopFilters.category) {
      result = result.filter((p) => p.category === shopFilters.category);
    }
    if (shopFilters.hasRamadanSpecial) {
      result = result.filter((p) => p.ramadan_special);
    }

    // Sort by tier (premium first)
    const tierOrder = { premium: 0, partner_plus: 1, partner: 2, free: 3 };
    result.sort((a, b) => tierOrder[a.partner_tier] - tierOrder[b.partner_tier]);

    return result;
  }, [shopPartners, shopFilters]);

  // Get unique cuisine types from food partners
  const availableCuisineTypes = useMemo(() => {
    const types = new Set<CuisineType>();
    foodPartners.forEach((p) => {
      if (p.cuisine_type) types.add(p.cuisine_type);
    });
    return Array.from(types);
  }, [foodPartners]);

  // Clear all filters
  const clearFoodFilters = () => {
    setFoodFilters({
      cuisineType: null,
      dishType: null,
      category: null,
      halalCertified: false,
      hasDelivery: false,
      hasTakeaway: false,
    });
  };

  const clearActivityFilters = () => {
    setActivityFilters({
      forMen: false,
      forWomen: false,
      forFamilies: false,
      forYouth: false,
      city: "",
    });
  };

  const clearShopFilters = () => {
    setShopFilters({
      category: null,
      hasRamadanSpecial: false,
    });
  };

  // Get category config
  const selectedCategoryConfig = categories.find((c) => c.id === selectedCategory);

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-12 bg-[#0f2d2d]">
        <div className="section-container">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              <p className="text-teal-400 font-medium mb-4 tracking-wide uppercase text-sm">
                Ramadan 2026
              </p>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-white mb-6 tracking-tight">
                Wat te doen
              </h1>

              <p className="text-xl text-white/70 leading-relaxed max-w-2xl">
                Ontdek halal eten & drinken en activiteiten in Gent tijdens Ramadan.
              </p>
            </motion.div>

            {/* View Mode Toggle - Like Mosques Page */}
            {(selectedCategory === "food" || selectedCategory === "shopping") && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex p-1 bg-white/10 rounded-lg backdrop-blur-sm self-start sm:self-auto"
              >
                <button
                  onClick={() => setPartnerViewMode("map")}
                  className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${
                    partnerViewMode === "map"
                      ? "text-white"
                      : "text-white/50 hover:text-white/70"
                  }`}
                >
                  {partnerViewMode === "map" && (
                    <motion.div
                      layoutId="viewModeTab"
                      className="absolute inset-0 bg-teal rounded-md"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                    />
                  )}
                  <Map className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">Kaart</span>
                </button>
                <button
                  onClick={() => setPartnerViewMode("list")}
                  className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${
                    partnerViewMode === "list"
                      ? "text-white"
                      : "text-white/50 hover:text-white/70"
                  }`}
                >
                  {partnerViewMode === "list" && (
                    <motion.div
                      layoutId="viewModeTab"
                      className="absolute inset-0 bg-teal rounded-md"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                    />
                  )}
                  <List className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">Lijst</span>
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Category Icons - Eventbrite Style */}
      <section className="bg-white py-8 border-b border-gray-100">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8">
              {categories.map((category, index) => {
                const Icon = category.icon;
                const isActive = selectedCategory === category.id;

                return (
                  <motion.button
                    key={category.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      // Clear filters when switching categories
                      if (category.id === "food") {
                        clearActivityFilters();
                        clearShopFilters();
                      } else if (category.id === "shopping") {
                        clearFoodFilters();
                        clearActivityFilters();
                      } else {
                        clearFoodFilters();
                        clearShopFilters();
                      }
                    }}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all duration-200 ${
                        isActive
                          ? "bg-teal text-white ring-4 ring-teal/30 scale-110"
                          : `${category.bgColor} ${category.color} hover:scale-105 hover:shadow-lg`
                      }`}
                    >
                      <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
                    </div>
                    <span
                      className={`text-xs sm:text-sm font-medium transition-colors text-center ${
                        isActive
                          ? "text-teal"
                          : "text-text-secondary group-hover:text-text-primary"
                      }`}
                    >
                      {category.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Full Page Map View for Food/Shop Partners */}
      {partnerViewMode === "map" && (selectedCategory === "food" || selectedCategory === "shopping") ? (
        <section className="bg-[#0f2d2d]" style={{ height: "calc(100vh - 280px)", minHeight: "500px" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key="sponsor-map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <SponsorMap
                foodPartners={selectedCategory === "food" ? filteredFoodPartners : []}
                shopPartners={selectedCategory === "shopping" ? filteredShopPartners : []}
                showOnlyPaid={false}
                className="h-full"
              />
            </motion.div>
          </AnimatePresence>
        </section>
      ) : (
      <>
      {/* Filters Section - Takeaway.com Style */}
      <section className="bg-white border-b border-gray-100 sticky top-16 z-30">
        <div className="section-container py-4">
          {selectedCategory === "food" ? (
            // Food Partner Filters
            <div className="space-y-4">
              {/* Main filter bar with arrows */}
              <div className="flex items-center gap-3">
                {/* Fixed Filter Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                    showFilters || hasActiveFoodFilters
                      ? "bg-teal text-white"
                      : "bg-gray-100 text-text-secondary hover:bg-gray-200"
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {hasActiveFoodFilters && (
                    <span className="w-5 h-5 bg-white text-teal text-xs font-bold rounded-full flex items-center justify-center">
                      {(foodFilters.cuisineType ? 1 : 0) +
                        (foodFilters.dishType ? 1 : 0) +
                        (foodFilters.category ? 1 : 0) +
                        (foodFilters.halalCertified ? 1 : 0) +
                        (foodFilters.hasDelivery ? 1 : 0) +
                        (foodFilters.hasTakeaway ? 1 : 0)}
                    </span>
                  )}
                </button>

                <div className="h-6 w-px bg-gray-200 flex-shrink-0" />

                {/* Scrollable container with arrows */}
                <div className="relative flex-1 flex items-center min-w-0">
                  {/* Left arrow */}
                  <button
                    onClick={() => scrollFilters("left")}
                    className="absolute left-0 z-10 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center text-text-secondary hover:text-text-primary hover:shadow-lg transition-all -ml-2"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {/* Scrollable filter chips */}
                  <div
                    ref={foodFilterScrollRef}
                    className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide mx-8 scroll-smooth"
                  >
                    {/* Quick dish type filters */}
                    {(Object.keys(dishTypeLabels) as DishType[]).slice(0, 6).map((dishType) => {
                      const dishInfo = dishTypeLabels[dishType];
                      return (
                        <FilterChip
                          key={dishType}
                          label={dishInfo.label}
                          icon={<span className="text-base">{dishInfo.emoji}</span>}
                          active={foodFilters.dishType === dishType}
                          onClick={() =>
                            setFoodFilters({
                              ...foodFilters,
                              dishType: foodFilters.dishType === dishType ? null : dishType,
                            })
                          }
                        />
                      );
                    })}

                    <div className="h-6 w-px bg-gray-200 flex-shrink-0" />

                    {/* Quick cuisine filters */}
                    {availableCuisineTypes.slice(0, 4).map((cuisineType) => (
                      <FilterChip
                        key={cuisineType}
                        label={cuisineTypeLabels[cuisineType]}
                        icon={<span className="text-base">{cuisineIcons[cuisineType]}</span>}
                        active={foodFilters.cuisineType === cuisineType}
                        onClick={() =>
                          setFoodFilters({
                            ...foodFilters,
                            cuisineType:
                              foodFilters.cuisineType === cuisineType ? null : cuisineType,
                          })
                        }
                      />
                    ))}

                    <div className="h-6 w-px bg-gray-200 flex-shrink-0" />

                    {/* Quick action filters */}
                    <FilterChip
                      label="Halal Gecertificeerd"
                      icon={<Check className="w-4 h-4" />}
                      active={foodFilters.halalCertified}
                      onClick={() =>
                        setFoodFilters({
                          ...foodFilters,
                          halalCertified: !foodFilters.halalCertified,
                        })
                      }
                    />
                    <FilterChip
                      label="Bezorging"
                      icon={<Truck className="w-4 h-4" />}
                      active={foodFilters.hasDelivery}
                      onClick={() =>
                        setFoodFilters({
                          ...foodFilters,
                          hasDelivery: !foodFilters.hasDelivery,
                        })
                      }
                    />
                    <FilterChip
                      label="Takeaway"
                      icon={<ShoppingBag className="w-4 h-4" />}
                      active={foodFilters.hasTakeaway}
                      onClick={() =>
                        setFoodFilters({
                          ...foodFilters,
                          hasTakeaway: !foodFilters.hasTakeaway,
                        })
                      }
                    />
                  </div>

                  {/* Right arrow */}
                  <button
                    onClick={() => scrollFilters("right")}
                    className="absolute right-0 z-10 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center text-text-secondary hover:text-text-primary hover:shadow-lg transition-all -mr-2"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Expanded filter panel - Mobile overlay / Desktop inline */}
              <AnimatePresence>
                {showFilters && (
                  <>
                    {/* Mobile: Full screen overlay */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="md:hidden fixed inset-0 z-50 bg-white flex flex-col pt-16"
                    >
                      {/* Header */}
                      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-text-primary">Filters</h3>
                        <button
                          onClick={() => setShowFilters(false)}
                          className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-text-primary hover:bg-gray-200 transition-all active:scale-95"
                          aria-label="Sluiten"
                        >
                          <X className="w-6 h-6" />
                        </button>
                      </div>

                      {/* Scrollable content */}
                      <div className="overflow-y-auto flex-1 px-4 py-6 space-y-6">
                        {/* Cuisine Type Grid */}
                        <div>
                          <p className="text-sm font-medium text-text-secondary mb-3">
                            Type keuken
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {(Object.keys(cuisineTypeLabels) as CuisineType[]).map(
                              (cuisineType) => (
                                <FilterChip
                                  key={cuisineType}
                                  label={cuisineTypeLabels[cuisineType]}
                                  icon={
                                    <span className="text-base">
                                      {cuisineIcons[cuisineType]}
                                    </span>
                                  }
                                  active={foodFilters.cuisineType === cuisineType}
                                  onClick={() =>
                                    setFoodFilters({
                                      ...foodFilters,
                                      cuisineType:
                                        foodFilters.cuisineType === cuisineType
                                          ? null
                                          : cuisineType,
                                    })
                                  }
                                />
                              )
                            )}
                          </div>
                        </div>

                        {/* Dish Type Grid */}
                        <div>
                          <p className="text-sm font-medium text-text-secondary mb-3">
                            Type gerechten
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {(Object.keys(dishTypeLabels) as DishType[]).map(
                              (dishType) => {
                                const dishInfo = dishTypeLabels[dishType];
                                return (
                                  <FilterChip
                                    key={dishType}
                                    label={dishInfo.label}
                                    icon={
                                      <span className="text-base">
                                        {dishInfo.emoji}
                                      </span>
                                    }
                                    active={foodFilters.dishType === dishType}
                                    onClick={() =>
                                      setFoodFilters({
                                        ...foodFilters,
                                        dishType:
                                          foodFilters.dishType === dishType
                                            ? null
                                            : dishType,
                                      })
                                    }
                                  />
                                );
                              }
                            )}
                          </div>
                        </div>

                        {/* Category Filter */}
                        <div>
                          <p className="text-sm font-medium text-text-secondary mb-3">
                            Categorie
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {(Object.keys(categoryLabels) as FoodPartnerCategory[]).map(
                              (category) => (
                                <FilterChip
                                  key={category}
                                  label={categoryLabels[category]}
                                  active={foodFilters.category === category}
                                  onClick={() =>
                                    setFoodFilters({
                                      ...foodFilters,
                                      category:
                                        foodFilters.category === category ? null : category,
                                    })
                                  }
                                />
                              )
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Footer with apply/clear buttons */}
                      <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-4 flex gap-3">
                        {hasActiveFoodFilters && (
                          <button
                            onClick={clearFoodFilters}
                            className="flex-1 px-4 py-3 border border-gray-300 text-text-secondary rounded-xl font-medium hover:bg-gray-50 transition-all"
                          >
                            Wissen
                          </button>
                        )}
                        <button
                          onClick={() => setShowFilters(false)}
                          className="flex-1 px-4 py-3 bg-teal text-white rounded-xl font-medium hover:bg-teal/90 transition-all"
                        >
                          Toon {filteredFoodPartners.length} resultaten
                        </button>
                      </div>
                    </motion.div>

                    {/* Desktop: Inline panel */}
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="hidden md:block bg-gray-50 rounded-2xl p-5 space-y-5"
                    >
                      {/* Cuisine Type Grid */}
                      <div>
                        <p className="text-sm font-medium text-text-secondary mb-3">
                          Type keuken
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(Object.keys(cuisineTypeLabels) as CuisineType[]).map(
                            (cuisineType) => (
                              <FilterChip
                                key={cuisineType}
                                label={cuisineTypeLabels[cuisineType]}
                                icon={
                                  <span className="text-base">
                                    {cuisineIcons[cuisineType]}
                                  </span>
                                }
                                active={foodFilters.cuisineType === cuisineType}
                                onClick={() =>
                                  setFoodFilters({
                                    ...foodFilters,
                                    cuisineType:
                                      foodFilters.cuisineType === cuisineType
                                        ? null
                                        : cuisineType,
                                  })
                                }
                              />
                            )
                          )}
                        </div>
                      </div>

                      {/* Dish Type Grid */}
                      <div>
                        <p className="text-sm font-medium text-text-secondary mb-3">
                          Type gerechten
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(Object.keys(dishTypeLabels) as DishType[]).map(
                            (dishType) => {
                              const dishInfo = dishTypeLabels[dishType];
                              return (
                                <FilterChip
                                  key={dishType}
                                  label={dishInfo.label}
                                  icon={
                                    <span className="text-base">
                                      {dishInfo.emoji}
                                    </span>
                                  }
                                  active={foodFilters.dishType === dishType}
                                  onClick={() =>
                                    setFoodFilters({
                                      ...foodFilters,
                                      dishType:
                                        foodFilters.dishType === dishType
                                          ? null
                                          : dishType,
                                    })
                                  }
                                />
                              );
                            }
                          )}
                        </div>
                      </div>

                      {/* Category Filter */}
                      <div>
                        <p className="text-sm font-medium text-text-secondary mb-3">
                          Categorie
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(Object.keys(categoryLabels) as FoodPartnerCategory[]).map(
                            (category) => (
                              <FilterChip
                                key={category}
                                label={categoryLabels[category]}
                                active={foodFilters.category === category}
                                onClick={() =>
                                  setFoodFilters({
                                    ...foodFilters,
                                    category:
                                      foodFilters.category === category ? null : category,
                                  })
                                }
                              />
                            )
                          )}
                        </div>
                      </div>

                      {/* Clear filters */}
                      {hasActiveFoodFilters && (
                        <button
                          onClick={clearFoodFilters}
                          className="inline-flex items-center gap-1 text-sm text-teal hover:underline"
                        >
                          <X className="w-4 h-4" />
                          Alle filters wissen
                        </button>
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : selectedCategory === "shopping" ? (
            // Shop Partner Filters
            <div className="space-y-4">
              {/* Main filter bar with arrows */}
              <div className="flex items-center gap-3">
                {/* Fixed Filter Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                    showFilters || hasActiveShopFilters
                      ? "bg-pink-500 text-white"
                      : "bg-gray-100 text-text-secondary hover:bg-gray-200"
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {hasActiveShopFilters && (
                    <span className="w-5 h-5 bg-white text-pink-500 text-xs font-bold rounded-full flex items-center justify-center">
                      {(shopFilters.category ? 1 : 0) +
                        (shopFilters.hasRamadanSpecial ? 1 : 0)}
                    </span>
                  )}
                </button>

                <div className="h-6 w-px bg-gray-200 flex-shrink-0" />

                {/* Scrollable container with arrows */}
                <div className="relative flex-1 flex items-center min-w-0">
                  {/* Left arrow */}
                  <button
                    onClick={() => scrollShopFilters("left")}
                    className="absolute left-0 z-10 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center text-text-secondary hover:text-text-primary hover:shadow-lg transition-all -ml-2"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {/* Scrollable filter chips */}
                  <div
                    ref={shopFilterScrollRef}
                    className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide mx-8 scroll-smooth"
                  >
                    {/* Shop category filters */}
                    {(Object.keys(shopCategoryLabels) as ShopCategory[]).map((category) => {
                      const Icon = shopCategoryIcons[category];
                      return (
                        <FilterChip
                          key={category}
                          label={shopCategoryLabels[category]}
                          icon={<Icon className="w-4 h-4" />}
                          active={shopFilters.category === category}
                          onClick={() =>
                            setShopFilters({
                              ...shopFilters,
                              category: shopFilters.category === category ? null : category,
                            })
                          }
                        />
                      );
                    })}

                    <div className="h-6 w-px bg-gray-200 flex-shrink-0" />

                    {/* Ramadan special filter */}
                    <FilterChip
                      label="Heeft Ramadan actie"
                      icon={<Sparkles className="w-4 h-4" />}
                      active={shopFilters.hasRamadanSpecial}
                      onClick={() =>
                        setShopFilters({
                          ...shopFilters,
                          hasRamadanSpecial: !shopFilters.hasRamadanSpecial,
                        })
                      }
                    />

                    {/* Clear filters */}
                    {hasActiveShopFilters && (
                      <button
                        onClick={clearShopFilters}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium text-pink-600 hover:bg-pink-50 transition-all whitespace-nowrap flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                        Wissen
                      </button>
                    )}
                  </div>

                  {/* Right arrow */}
                  <button
                    onClick={() => scrollShopFilters("right")}
                    className="absolute right-0 z-10 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center text-text-secondary hover:text-text-primary hover:shadow-lg transition-all -mr-2"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Activity Filters
            <div className="space-y-4">
              {/* Main filter bar */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide flex-1">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                      showFilters || hasActiveActivityFilters
                        ? "bg-teal text-white"
                        : "bg-gray-100 text-text-secondary hover:bg-gray-200"
                    }`}
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                    {hasActiveActivityFilters && (
                      <span className="w-5 h-5 bg-white text-teal text-xs font-bold rounded-full flex items-center justify-center">
                        {(activityFilters.forMen ? 1 : 0) +
                          (activityFilters.forWomen ? 1 : 0) +
                          (activityFilters.forFamilies ? 1 : 0) +
                          (activityFilters.forYouth ? 1 : 0) +
                          (activityFilters.city ? 1 : 0)}
                      </span>
                    )}
                  </button>

                  <div className="h-6 w-px bg-gray-200" />

                  {/* Quick audience filters */}
                  <FilterChip
                    label="Voor mannen"
                    active={activityFilters.forMen}
                    onClick={() =>
                      setActivityFilters({
                        ...activityFilters,
                        forMen: !activityFilters.forMen,
                      })
                    }
                  />
                  <FilterChip
                    label="Voor vrouwen"
                    active={activityFilters.forWomen}
                    onClick={() =>
                      setActivityFilters({
                        ...activityFilters,
                        forWomen: !activityFilters.forWomen,
                      })
                    }
                  />
                  <FilterChip
                    label="Gezinnen"
                    icon={<Users className="w-4 h-4" />}
                    active={activityFilters.forFamilies}
                    onClick={() =>
                      setActivityFilters({
                        ...activityFilters,
                        forFamilies: !activityFilters.forFamilies,
                      })
                    }
                  />
                  <FilterChip
                    label="Jeugd"
                    icon={<Sparkles className="w-4 h-4" />}
                    active={activityFilters.forYouth}
                    onClick={() =>
                      setActivityFilters({
                        ...activityFilters,
                        forYouth: !activityFilters.forYouth,
                      })
                    }
                  />
                </div>

                {/* View toggle */}
                <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1 flex-shrink-0">
                  <button
                    onClick={() => setActivityViewMode("list")}
                    className={`p-2 rounded-full transition-all ${
                      activityViewMode === "list"
                        ? "bg-white shadow-sm text-teal"
                        : "text-text-muted hover:text-text-secondary"
                    }`}
                    title="Lijst weergave"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActivityViewMode("3days")}
                    className={`px-2.5 py-1.5 rounded-full transition-all text-xs font-medium ${
                      activityViewMode === "3days"
                        ? "bg-white shadow-sm text-teal"
                        : "text-text-muted hover:text-text-secondary"
                    }`}
                    title="3 dagen weergave"
                  >
                    3D
                  </button>
                  <button
                    onClick={() => setActivityViewMode("week")}
                    className={`px-2.5 py-1.5 rounded-full transition-all text-xs font-medium ${
                      activityViewMode === "week"
                        ? "bg-white shadow-sm text-teal"
                        : "text-text-muted hover:text-text-secondary"
                    }`}
                    title="Week weergave"
                  >
                    W
                  </button>
                  <button
                    onClick={() => setActivityViewMode("month")}
                    className={`p-2 rounded-full transition-all ${
                      activityViewMode === "month"
                        ? "bg-white shadow-sm text-teal"
                        : "text-text-muted hover:text-text-secondary"
                    }`}
                    title="Maand weergave"
                  >
                    <CalendarDays className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Expanded filter panel - Mobile overlay / Desktop inline */}
              <AnimatePresence>
                {showFilters && (
                  <>
                    {/* Mobile: Full screen overlay */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="md:hidden fixed inset-0 z-50 bg-white flex flex-col pt-16"
                    >
                      {/* Header */}
                      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-text-primary">Filters</h3>
                        <button
                          onClick={() => setShowFilters(false)}
                          className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-text-primary hover:bg-gray-200 transition-all active:scale-95"
                          aria-label="Sluiten"
                        >
                          <X className="w-6 h-6" />
                        </button>
                      </div>

                      {/* Scrollable content */}
                      <div className="overflow-y-auto flex-1 px-4 py-6 space-y-6">
                        {/* Audience filters */}
                        <div>
                          <p className="text-sm font-medium text-text-secondary mb-3">
                            Doelgroep
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <FilterChip
                              label="Voor mannen"
                              active={activityFilters.forMen}
                              onClick={() =>
                                setActivityFilters({
                                  ...activityFilters,
                                  forMen: !activityFilters.forMen,
                                })
                              }
                            />
                            <FilterChip
                              label="Voor vrouwen"
                              active={activityFilters.forWomen}
                              onClick={() =>
                                setActivityFilters({
                                  ...activityFilters,
                                  forWomen: !activityFilters.forWomen,
                                })
                              }
                            />
                            <FilterChip
                              label="Voor gezinnen"
                              icon={<Users className="w-4 h-4" />}
                              active={activityFilters.forFamilies}
                              onClick={() =>
                                setActivityFilters({
                                  ...activityFilters,
                                  forFamilies: !activityFilters.forFamilies,
                                })
                              }
                            />
                            <FilterChip
                              label="Voor jeugd"
                              icon={<Sparkles className="w-4 h-4" />}
                              active={activityFilters.forYouth}
                              onClick={() =>
                                setActivityFilters({
                                  ...activityFilters,
                                  forYouth: !activityFilters.forYouth,
                                })
                              }
                            />
                          </div>
                        </div>

                        {/* Location filter */}
                        <div>
                          <p className="text-sm font-medium text-text-secondary mb-3">
                            Locatie
                          </p>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input
                              type="text"
                              value={activityFilters.city}
                              onChange={(e) =>
                                setActivityFilters({
                                  ...activityFilters,
                                  city: e.target.value,
                                })
                              }
                              placeholder="Zoek op stad..."
                              className="input-field pl-10 w-full"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Footer with apply/clear buttons */}
                      <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-4 flex gap-3">
                        {hasActiveActivityFilters && (
                          <button
                            onClick={clearActivityFilters}
                            className="flex-1 px-4 py-3 border border-gray-300 text-text-secondary rounded-xl font-medium hover:bg-gray-50 transition-all"
                          >
                            Wissen
                          </button>
                        )}
                        <button
                          onClick={() => setShowFilters(false)}
                          className="flex-1 px-4 py-3 bg-teal text-white rounded-xl font-medium hover:bg-teal/90 transition-all"
                        >
                          Toon {filteredActivities.length} resultaten
                        </button>
                      </div>
                    </motion.div>

                    {/* Desktop: Inline panel */}
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="hidden md:block bg-gray-50 rounded-2xl p-5 space-y-5"
                    >
                      {/* Audience filters */}
                      <div>
                        <p className="text-sm font-medium text-text-secondary mb-3">
                          Doelgroep
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <FilterChip
                            label="Voor mannen"
                            active={activityFilters.forMen}
                            onClick={() =>
                              setActivityFilters({
                                ...activityFilters,
                                forMen: !activityFilters.forMen,
                              })
                            }
                          />
                          <FilterChip
                            label="Voor vrouwen"
                            active={activityFilters.forWomen}
                            onClick={() =>
                              setActivityFilters({
                                ...activityFilters,
                                forWomen: !activityFilters.forWomen,
                              })
                            }
                          />
                          <FilterChip
                            label="Voor gezinnen"
                            icon={<Users className="w-4 h-4" />}
                            active={activityFilters.forFamilies}
                            onClick={() =>
                              setActivityFilters({
                                ...activityFilters,
                                forFamilies: !activityFilters.forFamilies,
                              })
                            }
                          />
                          <FilterChip
                            label="Voor jeugd"
                            icon={<Sparkles className="w-4 h-4" />}
                            active={activityFilters.forYouth}
                            onClick={() =>
                              setActivityFilters({
                                ...activityFilters,
                                forYouth: !activityFilters.forYouth,
                              })
                            }
                          />
                        </div>
                      </div>

                      {/* Location filter */}
                      <div>
                        <p className="text-sm font-medium text-text-secondary mb-3">
                          Locatie
                        </p>
                        <div className="relative max-w-xs">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                          <input
                            type="text"
                            value={activityFilters.city}
                            onChange={(e) =>
                              setActivityFilters({
                                ...activityFilters,
                                city: e.target.value,
                              })
                            }
                            placeholder="Zoek op stad..."
                            className="input-field pl-10 w-full"
                          />
                        </div>
                      </div>

                      {/* Clear filters */}
                      {hasActiveActivityFilters && (
                        <button
                          onClick={clearActivityFilters}
                          className="inline-flex items-center gap-1 text-sm text-teal hover:underline"
                        >
                          <X className="w-4 h-4" />
                          Alle filters wissen
                        </button>
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* Content Section */}
      <div className="bg-[#f8fafa] min-h-[50vh]">
        <section className="section-padding">
          <div className="section-container">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <div>
                <motion.h2
                  key={selectedCategory}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl md:text-3xl font-display font-semibold text-text-primary"
                >
                  {selectedCategory === "food"
                    ? "Halal Eten & Drinken"
                    : selectedCategory === "shopping"
                    ? "Shopping"
                    : selectedCategoryConfig?.label}
                </motion.h2>
                <motion.p
                  key={`${selectedCategory}-desc`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-text-muted mt-1"
                >
                  {selectedCategory === "food"
                    ? `${filteredFoodPartners.length} ${filteredFoodPartners.length === 1 ? "resultaat" : "resultaten"} in Gent`
                    : selectedCategory === "shopping"
                    ? `${filteredShopPartners.length} ${filteredShopPartners.length === 1 ? "winkel" : "winkels"} in Gent`
                    : `${filteredActivities.length} ${filteredActivities.length === 1 ? "activiteit" : "activiteiten"} gevonden`}
                </motion.p>
              </div>

              {selectedCategory === "food" ? (
                <Link
                  href="/word-food-partner"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full font-medium bg-gold text-gray-900 hover:bg-gold/90 transition-all"
                >
                  Word Food Partner
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              ) : selectedCategory === "shopping" ? (
                <Link
                  href="/word-shop-partner"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full font-medium bg-pink-500 text-white hover:bg-pink-600 transition-all"
                >
                  Word Shop Partner
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              ) : (
                <Link
                  href="/wat-te-doen/activiteit-toevoegen"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full font-medium border-2 border-teal text-teal hover:bg-teal hover:text-white transition-all"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Activiteit toevoegen
                </Link>
              )}
            </div>

            {/* Results in Column Layout */}
            {selectedCategory === "food" ? (
              // Food Partners
              isLoadingPartners ? (
                <div className="flex justify-center py-12">
                  <div className="w-12 h-12 border-2 border-teal/30 border-t-teal rounded-full animate-spin" />
                </div>
              ) : partnerViewMode === "map" ? (
                // Map View for Food Partners
                <motion.div
                  key="food-map"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-[600px] rounded-2xl overflow-hidden shadow-lg"
                >
                  <SponsorMap
                    foodPartners={filteredFoodPartners}
                    shopPartners={[]}
                    showOnlyPaid={false}
                    className="h-full"
                  />
                </motion.div>
              ) : filteredFoodPartners.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-text-muted text-lg">
                    {hasActiveFoodFilters
                      ? "Geen resultaten met de huidige filters"
                      : "Nog geen food partners beschikbaar"}
                  </p>
                  {hasActiveFoodFilters && (
                    <button
                      onClick={clearFoodFilters}
                      className="mt-4 text-teal hover:underline"
                    >
                      Filters wissen
                    </button>
                  )}
                </div>
              ) : (
                <motion.div
                  key="food-list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col gap-4"
                >
                  {filteredFoodPartners.map((partner, index) => (
                    <motion.div
                      key={partner.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <FoodPartnerCard partner={partner} index={index} />
                    </motion.div>
                  ))}
                </motion.div>
              )
            ) : selectedCategory === "shopping" ? (
              // Shop Partners
              isLoadingShopPartners ? (
                <div className="flex justify-center py-12">
                  <div className="w-12 h-12 border-2 border-pink-300 border-t-pink-500 rounded-full animate-spin" />
                </div>
              ) : partnerViewMode === "map" ? (
                // Map View for Shop Partners
                <motion.div
                  key="shop-map"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-[600px] rounded-2xl overflow-hidden shadow-lg"
                >
                  <SponsorMap
                    foodPartners={[]}
                    shopPartners={filteredShopPartners}
                    showOnlyPaid={false}
                    className="h-full"
                  />
                </motion.div>
              ) : filteredShopPartners.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-text-muted text-lg">
                    {hasActiveShopFilters
                      ? "Geen winkels met de huidige filters"
                      : "Nog geen shop partners beschikbaar"}
                  </p>
                  {hasActiveShopFilters && (
                    <button
                      onClick={clearShopFilters}
                      className="mt-4 text-pink-500 hover:underline"
                    >
                      Filters wissen
                    </button>
                  )}
                </div>
              ) : (
                <motion.div
                  key="shop-list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col gap-4"
                >
                  {filteredShopPartners.map((partner, index) => (
                    <motion.div
                      key={partner.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ShopPartnerCard partner={partner} index={index} />
                    </motion.div>
                  ))}
                </motion.div>
              )
            ) : (
              // Activities
              isLoadingActivities ? (
                <div className="flex justify-center py-12">
                  <div className="w-12 h-12 border-2 border-teal/30 border-t-teal rounded-full animate-spin" />
                </div>
              ) : filteredActivities.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-text-muted text-lg">
                    {hasActiveActivityFilters
                      ? "Geen activiteiten met de huidige filters"
                      : `Nog geen ${selectedCategoryConfig?.label.toLowerCase()} activiteiten beschikbaar`}
                  </p>
                  {hasActiveActivityFilters ? (
                    <button
                      onClick={clearActivityFilters}
                      className="mt-4 text-teal hover:underline"
                    >
                      Filters wissen
                    </button>
                  ) : (
                    <Link
                      href="/wat-te-doen/activiteit-toevoegen"
                      className="inline-flex items-center mt-4 text-teal hover:underline"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Voeg er een toe
                    </Link>
                  )}
                </div>
              ) : activityViewMode !== "list" ? (
                // Calendar Views (3 days, week, month)
                <motion.div
                  key={`activity-calendar-${selectedCategory}-${activityViewMode}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                >
                  {/* Calendar Navigation */}
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigateCalendar("prev")}
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        aria-label="Vorige"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>

                      <button
                        onClick={goToToday}
                        className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-medium"
                      >
                        Vandaag
                      </button>

                      <button
                        onClick={() => navigateCalendar("next")}
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        aria-label="Volgende"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Date range display */}
                    <div className="text-sm text-text-muted font-medium">
                      {activityViewMode === "month"
                        ? `${MONTH_NAMES[calendarStartDate.getMonth()]} ${calendarStartDate.getFullYear()}`
                        : `${calendarDays[0].getDate()} ${MONTH_NAMES[calendarDays[0].getMonth()]} - ${calendarDays[calendarDays.length - 1].getDate()} ${MONTH_NAMES[calendarDays[calendarDays.length - 1].getMonth()]}`
                      }
                    </div>
                  </div>

                  {/* Month View */}
                  {activityViewMode === "month" && (
                    <>
                      <div className="grid grid-cols-7 gap-2 mb-4">
                        {["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"].map((day) => (
                          <div key={day} className="text-center text-sm font-medium text-text-muted py-2">
                            {day}
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-2">
                        {calendarDays.map((date, i) => {
                          const dateStr = date.toISOString().split("T")[0];
                          const dayActivities = filteredActivities.filter(
                            (a) => a.event_date === dateStr
                          );
                          const dayIsToday = isToday(date);
                          const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
                          const isCurrentMonth = date.getMonth() === calendarStartDate.getMonth();

                          return (
                            <div
                              key={i}
                              className={`min-h-[80px] p-2 rounded-xl border transition-all ${
                                dayIsToday
                                  ? "border-teal bg-teal/5"
                                  : isPast
                                  ? "border-gray-100 bg-gray-50 opacity-50"
                                  : !isCurrentMonth
                                  ? "border-gray-50 bg-gray-25 opacity-40"
                                  : "border-gray-100 hover:border-gray-200"
                              }`}
                            >
                              <div className={`text-sm font-medium mb-1 ${dayIsToday ? "text-teal" : !isCurrentMonth ? "text-text-muted" : "text-text-secondary"}`}>
                                {date.getDate()}
                              </div>
                              {dayActivities.length > 0 && (
                                <div className="space-y-1">
                                  {dayActivities.slice(0, 2).map((activity) => (
                                    <div
                                      key={activity.id}
                                      className="text-xs bg-teal/10 text-teal px-1.5 py-0.5 rounded truncate"
                                      title={activity.title}
                                    >
                                      {activity.title}
                                    </div>
                                  ))}
                                  {dayActivities.length > 2 && (
                                    <div className="text-xs text-text-muted">
                                      +{dayActivities.length - 2} meer
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {/* 3 Days / Week View */}
                  {(activityViewMode === "3days" || activityViewMode === "week") && (
                    <div className={`grid gap-4 ${activityViewMode === "3days" ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-2 sm:grid-cols-4 lg:grid-cols-7"}`}>
                      {calendarDays.map((date) => {
                        const dateStr = date.toISOString().split("T")[0];
                        const dayActivities = filteredActivities.filter(
                          (a) => a.event_date === dateStr
                        );
                        const dayIsToday = isToday(date);

                        return (
                          <div
                            key={date.toISOString()}
                            className={`rounded-2xl border-2 p-4 transition-all ${
                              dayIsToday
                                ? "border-teal bg-teal/5"
                                : "border-gray-100 bg-white hover:border-gray-200"
                            }`}
                          >
                            {/* Day header */}
                            <div className="text-center mb-3 pb-3 border-b border-gray-100">
                              <div className={`text-xs font-medium uppercase tracking-wide ${dayIsToday ? "text-teal" : "text-text-muted"}`}>
                                {DAY_NAMES_FULL[date.getDay()]}
                              </div>
                              <div className={`text-2xl font-bold ${dayIsToday ? "text-teal" : "text-text-primary"}`}>
                                {date.getDate()}
                              </div>
                              <div className="text-xs text-text-muted">
                                {MONTH_NAMES[date.getMonth()]}
                              </div>
                            </div>

                            {/* Activities for this day */}
                            <div className="space-y-2">
                              {dayActivities.length === 0 ? (
                                <p className="text-xs text-text-muted text-center py-2">
                                  Geen activiteiten
                                </p>
                              ) : (
                                dayActivities.map((activity) => (
                                  <div
                                    key={activity.id}
                                    className="w-full p-2 bg-gray-50 rounded-lg text-xs text-left hover:bg-teal/10 hover:ring-1 hover:ring-teal/30 transition-all cursor-pointer"
                                  >
                                    <div className="font-semibold text-text-primary truncate">
                                      {activity.title}
                                    </div>
                                    {activity.start_time && (
                                      <div className="flex items-center gap-1 text-text-muted mt-1">
                                        <span>{activity.start_time.slice(0, 5)}</span>
                                      </div>
                                    )}
                                    <div className="text-text-muted truncate mt-1">
                                      {activity.location_name}
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>

                            {/* Count badge */}
                            {dayActivities.length > 0 && (
                              <div className="mt-3 pt-2 border-t border-gray-100 text-center">
                                <span className="text-xs font-medium text-teal">
                                  {dayActivities.length} activiteit{dayActivities.length !== 1 ? "en" : ""}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* List below calendar for all activities */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h4 className="font-medium text-text-secondary mb-4">Alle activiteiten</h4>
                    <div className="space-y-3">
                      {filteredActivities.map((activity) => (
                        <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                          <div className="w-12 h-12 bg-teal/10 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                            <span className="text-xs text-teal font-medium">
                              {new Date(activity.event_date).toLocaleDateString("nl-BE", { weekday: "short" })}
                            </span>
                            <span className="text-lg font-bold text-teal">
                              {new Date(activity.event_date).getDate()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-text-primary truncate">{activity.title}</p>
                            <p className="text-sm text-text-muted truncate">{activity.location_name}</p>
                          </div>
                          {activity.start_time && (
                            <span className="text-sm text-text-muted flex-shrink-0">{activity.start_time.slice(0, 5)}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                // List View
                <motion.div
                  key={`activity-list-${selectedCategory}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col gap-4"
                >
                  {filteredActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ActivityCard activity={activity} index={index} />
                    </motion.div>
                  ))}
                </motion.div>
              )
            )}
          </div>
        </section>
      </div>

      {/* CTA Section with FAB */}
      <section ref={ctaSectionRef} className="bg-[#0f2d2d] section-padding">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-white mb-4">
              Heeft u iets toe te voegen?
            </h2>
            <p className="text-lg text-white/70 mb-8">
              Voeg uw activiteit of etablissement toe aan Ramadan Lights Gent.
            </p>

            {/* FAB Button in CTA */}
            <div className="relative inline-block">
              <AnimatePresence>
                {showAddMenu && ctaInView && (
                  <>
                    {/* Backdrop */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black/40 z-[59]"
                      onClick={() => setShowAddMenu(false)}
                    />

                    {/* Menu Options - Fixed center on screen */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 20 }}
                      className="fixed inset-x-0 bottom-32 flex flex-col gap-3 items-center z-[61] px-4"
                    >
                      <Link
                        href="/wat-te-doen/activiteit-toevoegen"
                        className="flex items-center gap-3 pl-4 pr-5 py-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all group"
                        onClick={() => setShowAddMenu(false)}
                      >
                        <span className="w-10 h-10 bg-teal/10 text-teal rounded-full flex items-center justify-center group-hover:bg-teal group-hover:text-white transition-all">
                          <Calendar className="w-5 h-5" />
                        </span>
                        <span className="font-medium text-text-primary whitespace-nowrap">Activiteit toevoegen</span>
                      </Link>

                      <Link
                        href="/word-food-partner"
                        className="flex items-center gap-3 pl-4 pr-5 py-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all group"
                        onClick={() => setShowAddMenu(false)}
                      >
                        <span className="w-10 h-10 bg-gold/10 text-gold rounded-full flex items-center justify-center group-hover:bg-gold group-hover:text-white transition-all">
                          <Utensils className="w-5 h-5" />
                        </span>
                        <span className="font-medium text-text-primary whitespace-nowrap">Word Food Partner</span>
                      </Link>

                      <Link
                        href="/word-shop-partner"
                        className="flex items-center gap-3 pl-4 pr-5 py-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all group"
                        onClick={() => setShowAddMenu(false)}
                      >
                        <span className="w-10 h-10 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center group-hover:bg-pink-500 group-hover:text-white transition-all">
                          <Store className="w-5 h-5" />
                        </span>
                        <span className="font-medium text-text-primary whitespace-nowrap">Word Shop Partner</span>
                      </Link>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              {/* FAB Button */}
              <motion.button
                onClick={() => setShowAddMenu(!showAddMenu)}
                className={`relative z-[62] w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition-all ${
                  showAddMenu
                    ? "bg-white/20 text-white rotate-45"
                    : "bg-white text-teal hover:bg-white/90 hover:shadow-xl"
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-8 h-8" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Floating FAB - Hidden when CTA section is in view */}
      <AnimatePresence>
        {!ctaInView && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-[60]"
          >
            <AnimatePresence>
              {showAddMenu && (
                <>
                  {/* Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/40 z-[59]"
                    onClick={() => setShowAddMenu(false)}
                  />

                  {/* Menu Options */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    className="absolute bottom-16 right-0 flex flex-col gap-3 items-end z-[61]"
                  >
                    <Link
                      href="/wat-te-doen/activiteit-toevoegen"
                      className="flex items-center gap-3 pl-4 pr-5 py-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all group"
                      onClick={() => setShowAddMenu(false)}
                    >
                      <span className="w-10 h-10 bg-teal/10 text-teal rounded-full flex items-center justify-center group-hover:bg-teal group-hover:text-white transition-all">
                        <Calendar className="w-5 h-5" />
                      </span>
                      <span className="font-medium text-text-primary whitespace-nowrap">Activiteit toevoegen</span>
                    </Link>

                    <Link
                      href="/word-food-partner"
                      className="flex items-center gap-3 pl-4 pr-5 py-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all group"
                      onClick={() => setShowAddMenu(false)}
                    >
                      <span className="w-10 h-10 bg-gold/10 text-gold rounded-full flex items-center justify-center group-hover:bg-gold group-hover:text-white transition-all">
                        <Utensils className="w-5 h-5" />
                      </span>
                      <span className="font-medium text-text-primary whitespace-nowrap">Word Food Partner</span>
                    </Link>

                    <Link
                      href="/word-shop-partner"
                      className="flex items-center gap-3 pl-4 pr-5 py-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all group"
                      onClick={() => setShowAddMenu(false)}
                    >
                      <span className="w-10 h-10 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center group-hover:bg-pink-500 group-hover:text-white transition-all">
                        <Store className="w-5 h-5" />
                      </span>
                      <span className="font-medium text-text-primary whitespace-nowrap">Word Shop Partner</span>
                    </Link>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* FAB Button */}
            <motion.button
              onClick={() => setShowAddMenu(!showAddMenu)}
              className={`relative z-[62] w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all ${
                showAddMenu
                  ? "bg-gray-700 text-white rotate-45"
                  : "bg-teal text-white hover:bg-teal/90 hover:shadow-xl"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-7 h-7" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      </>
      )}

      <Footer />
    </main>
  );
}
