import {
  Lamp,
  Shirt,
  BookOpen,
  Gift,
  Sparkles,
  Baby,
  Smartphone,
  Store,
  type LucideIcon,
} from "lucide-react";

// Shop Partner category types
export type ShopCategory =
  | "decor"
  | "clothing"
  | "spiritual"
  | "gifts"
  | "beauty"
  | "kids"
  | "tech"
  | "other";

// Reuse PartnerTier from food-partner-types
export type { PartnerTier } from "./food-partner-types";
import type { PartnerTier } from "./food-partner-types";

// Status types
export type ShopPartnerStatus = "pending" | "approved" | "rejected";

// Main ShopPartner interface
export interface ShopPartner {
  id: string;
  created_at: string;
  updated_at: string;

  // Basic Information
  name: string;
  slug: string | null;
  description: string | null;

  // Location
  address: string;
  city: string;
  postal_code: string | null;
  latitude: number | null;
  longitude: number | null;

  // Category
  category: ShopCategory;

  // Partner Tier
  partner_tier: PartnerTier;
  tier_expires_at: string | null;

  // Ramadan Special (for paid tiers)
  ramadan_special: string | null;
  ramadan_special_discount: string | null;

  // Contact Information
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;

  // Links
  website_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;

  // Images
  logo_url: string | null;
  cover_image_url: string | null;

  // Opening Hours
  opening_hours: Record<string, { open: string; close: string }> | null;

  // Status
  status: ShopPartnerStatus;
  approval_token: string;
  approved_at: string | null;
  rejected_at: string | null;
  rejection_reason: string | null;
}

// Labels for categories (Dutch)
export const shopCategoryLabels: Record<ShopCategory, string> = {
  decor: "Decoratie & sfeer",
  clothing: "Kleding & fashion",
  spiritual: "Spiritueel & ritueel",
  gifts: "Geschenken & cadeaus",
  beauty: "Beauty & wellness",
  kids: "Kids & families",
  tech: "Tech & lifestyle",
  other: "Overig",
};

// Category icons (LucideIcon components for display)
export const shopCategoryIcons: Record<ShopCategory, LucideIcon> = {
  decor: Lamp,
  clothing: Shirt,
  spiritual: BookOpen,
  gifts: Gift,
  beauty: Sparkles,
  kids: Baby,
  tech: Smartphone,
  other: Store,
};

// Category emoji icons (for display as emoji)
export const shopCategoryEmojis: Record<ShopCategory, string> = {
  decor: "🏮",
  clothing: "👗",
  spiritual: "📿",
  gifts: "🎁",
  beauty: "✨",
  kids: "👶",
  tech: "📱",
  other: "🏪",
};

// Labels for tiers (Dutch) - Shop specific
export const shopTierLabels: Record<PartnerTier, string> = {
  free: "Gratis",
  partner: "Shop Partner",
  partner_plus: "Shop Partner Plus",
  premium: "Premium Partner",
};

// Helper function to get tier badge info (reuse same logic as food)
export function getShopTierBadgeInfo(tier: PartnerTier): {
  label: string;
  className: string;
} | null {
  switch (tier) {
    case "premium":
      return {
        label: "Sponsor",
        className: "bg-gold text-gray-900 font-bold",
      };
    case "partner_plus":
      return {
        label: "Uitgelicht",
        className: "bg-teal text-white font-medium",
      };
    case "partner":
    default:
      return null;
  }
}

// Helper function to check if partner is featured (paid tiers)
export function isShopFeaturedPartner(tier: PartnerTier): boolean {
  return tier === "partner" || tier === "partner_plus" || tier === "premium";
}

// Helper function to check if partner has premium features (plus or premium)
export function isShopPremiumPartner(tier: PartnerTier): boolean {
  return tier === "partner_plus" || tier === "premium";
}
