// Food Partner category types
export type FoodPartnerCategory =
  | "restaurant"
  | "bakery"
  | "butcher"
  | "supermarket"
  | "catering"
  | "cafe"
  | "other";

// Cuisine type options (like Takeaway.com/UberEats)
export type CuisineType =
  | "turkish"
  | "moroccan"
  | "middle_eastern"
  | "indian_pakistani"
  | "indonesian"
  | "african"
  | "mediterranean"
  | "lebanese"
  | "persian"
  | "asian"
  | "international"
  | "other";

// Cuisine type labels (Dutch)
export const cuisineTypeLabels: Record<CuisineType, string> = {
  turkish: "Turks",
  moroccan: "Marokkaans",
  middle_eastern: "Midden-Oosters",
  indian_pakistani: "Indiaas/Pakistaans",
  indonesian: "Indonesisch",
  african: "Afrikaans",
  mediterranean: "Mediterraans",
  lebanese: "Libanees",
  persian: "Perzisch",
  asian: "Aziatisch",
  international: "Internationaal",
  other: "Overig",
};

// Dish type options (like Uber Eats/Deliveroo/Takeaway)
export type DishType =
  | "burgers"
  | "pizza"
  | "kebab"
  | "chicken"
  | "shawarma"
  | "grill"
  | "pasta"
  | "rice"
  | "soup"
  | "bread"
  | "wraps"
  | "fish"
  | "vegetarian"
  | "salads"
  | "desserts"
  | "snacks";

// Dish type labels with emoji icons (Dutch)
export const dishTypeLabels: Record<DishType, { label: string; emoji: string }> = {
  burgers: { label: "Burgers", emoji: "🍔" },
  pizza: { label: "Pizza", emoji: "🍕" },
  kebab: { label: "Kebab/Döner", emoji: "🥙" },
  chicken: { label: "Kip", emoji: "🍗" },
  shawarma: { label: "Shawarma", emoji: "🌯" },
  grill: { label: "Grillgerechten", emoji: "🥩" },
  pasta: { label: "Pasta", emoji: "🍝" },
  rice: { label: "Rijstgerechten", emoji: "🍚" },
  soup: { label: "Soep", emoji: "🍲" },
  bread: { label: "Brood/Pide", emoji: "🥖" },
  wraps: { label: "Wraps", emoji: "🌮" },
  fish: { label: "Vis", emoji: "🐟" },
  vegetarian: { label: "Vegetarisch", emoji: "🥗" },
  salads: { label: "Salades", emoji: "🥬" },
  desserts: { label: "Desserts", emoji: "🍰" },
  snacks: { label: "Snacks", emoji: "🍟" },
};

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
  cuisine_type: CuisineType | null;
  dish_types: DishType[] | null;

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
  takeaway_url: string | null;

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
