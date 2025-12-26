"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Map, List, Filter, X, Crown, Star, Utensils, ShoppingBag } from "lucide-react";
import type { FoodPartner, PartnerTier } from "@/lib/food-partner-types";
import { categoryLabels } from "@/lib/food-partner-types";
import type { ShopPartner } from "@/lib/shop-partner-types";
import { shopCategoryLabels } from "@/lib/shop-partner-types";
import type { MapSponsor } from "./SponsorMapComponent";

// Dynamically load map component to avoid SSR issues
const SponsorMapComponent = dynamic(
  () => import("./SponsorMapComponent"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-2xl">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Kaart laden...</p>
        </div>
      </div>
    ),
  }
);

// Convert FoodPartner to MapSponsor
export function foodPartnerToMapSponsor(partner: FoodPartner): MapSponsor | null {
  if (!partner.latitude || !partner.longitude) return null;

  return {
    id: partner.id,
    name: partner.name,
    type: "food",
    tier: partner.partner_tier,
    latitude: partner.latitude,
    longitude: partner.longitude,
    address: partner.address,
    city: partner.city,
    description: partner.description,
    logo_url: partner.logo_url,
    category: partner.category,
    categoryLabel: categoryLabels[partner.category],
    special: partner.iftar_special,
    specialPrice: partner.iftar_special_price,
  };
}

// Convert ShopPartner to MapSponsor
export function shopPartnerToMapSponsor(partner: ShopPartner): MapSponsor | null {
  if (!partner.latitude || !partner.longitude) return null;

  return {
    id: partner.id,
    name: partner.name,
    type: "shop",
    tier: partner.partner_tier,
    latitude: partner.latitude,
    longitude: partner.longitude,
    address: partner.address,
    city: partner.city,
    description: partner.description,
    logo_url: partner.logo_url,
    category: partner.category,
    categoryLabel: shopCategoryLabels[partner.category],
    special: partner.ramadan_special,
    specialPrice: partner.ramadan_special_discount,
  };
}

interface SponsorMapProps {
  foodPartners: FoodPartner[];
  shopPartners: ShopPartner[];
  showOnlyPaid?: boolean;
  className?: string;
}

type FilterType = "all" | "food" | "shop";
type TierFilter = "all" | "premium" | "partner_plus" | "partner";

export function SponsorMap({
  foodPartners,
  shopPartners,
  showOnlyPaid = true,
  className = ""
}: SponsorMapProps) {
  const [typeFilter, setTypeFilter] = useState<FilterType>("all");
  const [tierFilter, setTierFilter] = useState<TierFilter>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Convert and filter sponsors
  const allSponsors = useMemo(() => {
    const foodSponsors = foodPartners
      .map(foodPartnerToMapSponsor)
      .filter((s): s is MapSponsor => s !== null);

    const shopSponsors = shopPartners
      .map(shopPartnerToMapSponsor)
      .filter((s): s is MapSponsor => s !== null);

    let combined = [...foodSponsors, ...shopSponsors];

    // Filter out free tier if showOnlyPaid is true
    if (showOnlyPaid) {
      combined = combined.filter(s => s.tier !== "free");
    }

    // Apply type filter
    if (typeFilter !== "all") {
      combined = combined.filter(s => s.type === typeFilter);
    }

    // Apply tier filter
    if (tierFilter !== "all") {
      combined = combined.filter(s => s.tier === tierFilter);
    }

    return combined;
  }, [foodPartners, shopPartners, showOnlyPaid, typeFilter, tierFilter]);

  // Count sponsors per tier
  const tierCounts = useMemo(() => {
    const counts = { premium: 0, partner_plus: 0, partner: 0, free: 0 };
    allSponsors.forEach(s => {
      counts[s.tier]++;
    });
    return counts;
  }, [allSponsors]);

  const hasActiveFilters = typeFilter !== "all" || tierFilter !== "all";

  return (
    <div className={`relative ${className}`}>
      {/* Filter Bar */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex items-center justify-between gap-4">
        {/* Filter toggle button */}
        <motion.button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm shadow-lg transition-all ${
            showFilters || hasActiveFilters
              ? "bg-teal text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Filter className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded-full text-xs">
              {(typeFilter !== "all" ? 1 : 0) + (tierFilter !== "all" ? 1 : 0)}
            </span>
          )}
        </motion.button>

        {/* Sponsor count */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2.5 shadow-lg">
          <span className="text-sm font-medium text-gray-700">
            {allSponsors.length} {allSponsors.length === 1 ? "sponsor" : "sponsors"}
          </span>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-16 left-4 z-[1000] bg-white rounded-2xl shadow-xl p-5 min-w-[280px]"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={() => {
                  setTypeFilter("all");
                  setTierFilter("all");
                }}
                className="text-xs text-teal hover:text-teal-dark font-medium"
              >
                Reset
              </button>
            )}
          </div>

          {/* Type Filter */}
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Type</p>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "all", label: "Alles", icon: null },
                { value: "food", label: "Eten", icon: Utensils },
                { value: "shop", label: "Winkels", icon: ShoppingBag },
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setTypeFilter(value as FilterType)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    typeFilter === value
                      ? "bg-teal text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Tier Filter */}
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Categorie</p>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "all", label: "Alles", icon: null, count: allSponsors.length },
                { value: "premium", label: "Premium", icon: Crown, count: tierCounts.premium },
                { value: "partner_plus", label: "Plus", icon: Star, count: tierCounts.partner_plus },
                { value: "partner", label: "Partner", icon: null, count: tierCounts.partner },
              ].map(({ value, label, icon: Icon, count }) => (
                <button
                  key={value}
                  onClick={() => setTierFilter(value as TierFilter)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    tierFilter === value
                      ? value === "premium"
                        ? "bg-amber-100 text-amber-800"
                        : value === "partner_plus"
                        ? "bg-teal text-white"
                        : "bg-indigo-100 text-indigo-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  {label}
                  <span className="text-xs opacity-70">({count})</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Map */}
      <div className="w-full h-full">
        <SponsorMapComponent
          sponsors={allSponsors}
          showRoutes={true}
        />
      </div>
    </div>
  );
}
