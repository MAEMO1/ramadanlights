"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FoodPartnerCard } from "@/components/FoodPartnerCard";
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
  type LucideIcon,
} from "lucide-react";
import { useRef } from "react";
import Link from "next/link";
import type { Activity, ActivityType } from "@/lib/activity-types";
import type { FoodPartner, CuisineType, FoodPartnerCategory, DishType } from "@/lib/food-partner-types";
import { cuisineTypeLabels, categoryLabels, dishTypeLabels } from "@/lib/food-partner-types";

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
];

// Dummy activities for demonstration
const dummyActivities: Activity[] = [
  {
    id: "activity-1",
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
    id: "activity-2",
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
    id: "activity-3",
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
    id: "activity-4",
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
    id: "activity-5",
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
  // SHOPPING ACTIVITY
  {
    id: "activity-6",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: "Ramadan Markt - Halal Shopping Event",
    description: "Grote Ramadan markt met halal producten, kleding, boeken, parfums en meer. Ontdek diverse kramen van lokale ondernemers.",
    activity_type: "shopping",
    location_name: "Flanders Expo",
    address: "Maaltekouter 1",
    city: "Gent",
    postal_code: "9051",
    latitude: 51.0350,
    longitude: 3.7450,
    event_date: "2026-03-28",
    start_time: "10:00",
    end_time: "20:00",
    is_recurring: false,
    recurrence_pattern: null,
    recurrence_end_date: null,
    organizer_name: "Ramadan Lights Events",
    organizer_email: "events@ramadanlights.be",
    organizer_phone: "+32 9 999 00 11",
    registration_url: null,
    website_url: null,
    facebook_url: "https://facebook.com/ramadanmarkt",
    instagram_url: "https://instagram.com/ramadanmarkt",
    cover_image_url: null,
    is_free: true,
    price: null,
    capacity: 2000,
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
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);
  const [isLoadingPartners, setIsLoadingPartners] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>("food");
  const [showFilters, setShowFilters] = useState(false);

  // Food partner filters
  const [foodFilters, setFoodFilters] = useState({
    cuisineType: null as CuisineType | null,
    category: null as FoodPartnerCategory | null,
    halalCertified: false,
    hasDelivery: false,
    hasTakeaway: false,
  });

  // Activity filters
  const [activityFilters, setActivityFilters] = useState({
    forMen: false,
    forWomen: false,
    forFamilies: false,
    forYouth: false,
    city: "",
  });

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

    fetchActivities();
    fetchFoodPartners();
  }, []);

  // Check if any filter is active
  const hasActiveFoodFilters =
    foodFilters.cuisineType !== null ||
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

  // Filter food partners
  const filteredFoodPartners = useMemo(() => {
    let result = [...foodPartners];

    if (foodFilters.cuisineType) {
      result = result.filter((p) => p.cuisine_type === foodFilters.cuisineType);
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
    if (selectedCategory === "food") return [];

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

  // Get category config
  const selectedCategoryConfig = categories.find((c) => c.id === selectedCategory);

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-12 bg-[#0f2d2d]">
        <div className="section-container">
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

            <p className="text-xl text-white/70 mb-6 leading-relaxed max-w-2xl">
              Ontdek halal eten & drinken en activiteiten in Gent tijdens Ramadan.
            </p>
          </motion.div>
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
                      } else {
                        clearFoodFilters();
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

      {/* Filters Section - Takeaway.com Style */}
      <section className="bg-white border-b border-gray-100 sticky top-16 z-30">
        <div className="section-container py-4">
          {selectedCategory === "food" ? (
            // Food Partner Filters
            <div className="space-y-4">
              {/* Main filter bar */}
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
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
                        (foodFilters.category ? 1 : 0) +
                        (foodFilters.halalCertified ? 1 : 0) +
                        (foodFilters.hasDelivery ? 1 : 0) +
                        (foodFilters.hasTakeaway ? 1 : 0)}
                    </span>
                  )}
                </button>

                <div className="h-6 w-px bg-gray-200" />

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

                <div className="h-6 w-px bg-gray-200" />

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

              {/* Expanded filter panel */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-gray-50 rounded-2xl p-5 space-y-5"
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
                )}
              </AnimatePresence>
            </div>
          ) : (
            // Activity Filters
            <div className="space-y-4">
              {/* Main filter bar */}
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
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

              {/* Expanded filter panel */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-gray-50 rounded-2xl p-5 space-y-5"
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
              ) : (
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

      {/* CTA Section */}
      <section className="bg-[#0f2d2d] section-padding">
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
              <Link
                href="/wat-te-doen/activiteit-toevoegen"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full font-medium bg-white text-[#0f2d2d] hover:bg-white/90 transition-all"
              >
                <Plus className="w-5 h-5 mr-2" />
                Activiteit toevoegen
              </Link>
              <Link
                href="/word-food-partner"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full font-medium border-2 border-gold text-gold hover:bg-gold hover:text-gray-900 transition-all"
              >
                Word Food Partner
              </Link>
              <Link
                href="/word-shop-partner"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full font-medium border-2 border-pink-400 text-pink-400 hover:bg-pink-500 hover:text-white hover:border-pink-500 transition-all"
              >
                Word Shop Partner
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
