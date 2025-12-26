// Food Partner category types
export type FoodPartnerCategory =
  | "restaurant"
  | "bakery"
  | "butcher"
  | "supermarket"
  | "catering"
  | "cafe"
  | "other";

// Partner tier types
export type PartnerTier = "free" | "partner" | "partner_plus" | "premium";

// Status types
export type FoodPartnerStatus = "pending" | "approved" | "rejected";

// Main FoodPartner interface
export interface FoodPartner {
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
  category: FoodPartnerCategory;
  cuisine_type: string | null;

  // Halal Status
  is_halal_certified: boolean;
  halal_certification_info: string | null;

  // Partner Tier
  partner_tier: PartnerTier;
  tier_expires_at: string | null;

  // Iftar Special (for paid tiers)
  iftar_special: string | null;
  iftar_special_price: string | null;

  // Contact Information
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;

  // Links
  website_url: string | null;
  menu_url: string | null;
  reservation_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  uber_eats_url: string | null;
  deliveroo_url: string | null;

  // Images
  logo_url: string | null;
  cover_image_url: string | null;

  // Opening Hours
  opening_hours: Record<string, { open: string; close: string }> | null;

  // Status
  status: FoodPartnerStatus;
  approval_token: string;
  approved_at: string | null;
  rejected_at: string | null;
  rejection_reason: string | null;
}

// Labels for categories (Dutch)
export const categoryLabels: Record<FoodPartnerCategory, string> = {
  restaurant: "Restaurant",
  bakery: "Bakkerij",
  butcher: "Slagerij",
  supermarket: "Supermarkt",
  catering: "Catering",
  cafe: "Café",
  other: "Overig",
};

// Labels for tiers (Dutch)
export const tierLabels: Record<PartnerTier, string> = {
  free: "Gratis",
  partner: "Food Partner",
  partner_plus: "Food Partner Plus",
  premium: "Premium Partner",
};

// Helper function to get tier badge info
export function getTierBadgeInfo(tier: PartnerTier): {
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
export function isFeaturedPartner(tier: PartnerTier): boolean {
  return tier === "partner" || tier === "partner_plus" || tier === "premium";
}

// Helper function to check if partner has premium features (plus or premium)
export function isPremiumPartner(tier: PartnerTier): boolean {
  return tier === "partner_plus" || tier === "premium";
}
