"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  Globe,
  Phone,
  Utensils,
  ExternalLink,
  Facebook,
  Instagram,
  Check,
  ShoppingBag,
  Star,
  Truck,
  ImageIcon,
  Navigation,
} from "lucide-react";
import type { FoodPartner, CuisineType } from "@/lib/food-partner-types";
import { categoryLabels, cuisineTypeLabels, getTierBadgeInfo, isFeaturedPartner, isPremiumPartner } from "@/lib/food-partner-types";
import { getTierConfig } from "@/lib/partner-config";

// Cuisine type icon mapping
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

interface FoodPartnerCardProps {
  partner: FoodPartner;
  index?: number;
  isInView?: boolean;
}

export function FoodPartnerCard({
  partner,
  index = 0,
  isInView = true,
}: FoodPartnerCardProps) {
  const tierConfig = getTierConfig(partner.partner_tier);
  const badgeInfo = getTierBadgeInfo(partner.partner_tier);
  const isFeatured = isFeaturedPartner(partner.partner_tier);
  const hasPremiumFeatures = isPremiumPartner(partner.partner_tier);
  const isPremium = partner.partner_tier === "premium";
  const isBasicPartner = partner.partner_tier === "partner"; // €300 tier - should be compact

  // Check if has any delivery option
  const hasDelivery = partner.uber_eats_url || partner.deliveroo_url || partner.takeaway_url;

  // Compact card for basic partner tier (€300)
  if (isBasicPartner) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.1 + index * 0.05 }}
        className={`group relative rounded-xl overflow-hidden transition-all hover:shadow-lg ${tierConfig.cardStyle}`}
      >
        <div className="flex items-center gap-4 p-4">
          {/* Small Image/Logo */}
          <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden">
            {partner.cover_image_url || partner.logo_url ? (
              <img
                src={partner.logo_url || partner.cover_image_url || ""}
                alt={partner.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-gray-300" />
              </div>
            )}
            {partner.is_halal_certified && (
              <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-600 text-white rounded-full flex items-center justify-center">
                <Check className="w-3 h-3" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-display font-semibold text-text-primary group-hover:text-teal transition-colors truncate">
                  {partner.name}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-text-muted">
                    {categoryLabels[partner.category]}
                  </span>
                  {partner.cuisine_type && (
                    <span className="flex items-center gap-1 text-xs text-text-muted">
                      <span>{cuisineIcons[partner.cuisine_type]}</span>
                      {cuisineTypeLabels[partner.cuisine_type]}
                    </span>
                  )}
                </div>
              </div>
              {hasDelivery && (
                <div className="flex-shrink-0 p-1.5 bg-teal/10 text-teal rounded-full">
                  <Truck className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-text-muted">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{partner.address}, {partner.city}</span>
            </div>

            {/* Iftar Special - Compact */}
            {partner.iftar_special && (
              <div className="flex items-center gap-1.5 mt-1.5">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span className="text-xs text-amber-700 truncate">{partner.iftar_special}</span>
                {partner.iftar_special_price && (
                  <span className="text-xs font-semibold text-amber-900 flex-shrink-0">{partner.iftar_special_price}</span>
                )}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col gap-2 flex-shrink-0">
            {partner.website_url && (
              <a
                href={partner.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-teal text-white rounded-full hover:bg-teal/90 transition-colors"
                title="Website"
              >
                <Globe className="w-4 h-4" />
              </a>
            )}
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${partner.address}, ${partner.postal_code || ""} ${partner.city}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
              title="Route"
            >
              <Navigation className="w-4 h-4" />
            </a>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.1 + index * 0.05 }}
      className={`group relative rounded-2xl overflow-hidden transition-all hover:shadow-xl ${tierConfig.cardStyle}`}
    >
      {/* Takeaway.com Style Horizontal Layout */}
      <div className="flex flex-col sm:flex-row">
        {/* Image Section - Always Visible */}
        <div className="relative w-full sm:w-48 md:w-56 h-40 sm:h-auto flex-shrink-0">
          {partner.cover_image_url || partner.logo_url ? (
            <img
              src={partner.cover_image_url || partner.logo_url || ""}
              alt={partner.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <ImageIcon className="w-12 h-12 text-gray-300" />
            </div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent sm:bg-gradient-to-r" />

          {/* Sponsor/Featured Badge */}
          {badgeInfo && (
            <div
              className={`absolute top-3 left-3 px-3 py-1 text-xs font-bold uppercase tracking-wide rounded-full shadow-lg ${badgeInfo.className}`}
            >
              {badgeInfo.label}
            </div>
          )}

          {/* Halal Badge on Image */}
          {partner.is_halal_certified && (
            <div className="absolute bottom-3 left-3 px-2 py-1 bg-green-600 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
              <Check className="w-3 h-3" />
              Halal
            </div>
          )}

          {/* Delivery Badge */}
          {hasDelivery && (
            <div className="absolute bottom-3 right-3 px-2 py-1 bg-teal text-white text-xs font-medium rounded-full flex items-center gap-1 shadow-lg">
              <Truck className="w-3 h-3" />
              Bezorging
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-semibold text-lg text-text-primary group-hover:text-teal transition-colors">
                {partner.name}
              </h3>

              {/* Category & Cuisine Type */}
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                  {categoryLabels[partner.category]}
                </span>
                {partner.cuisine_type && (
                  <span className="flex items-center gap-1 text-xs text-text-muted">
                    <span>{cuisineIcons[partner.cuisine_type]}</span>
                    {cuisineTypeLabels[partner.cuisine_type]}
                  </span>
                )}
              </div>
            </div>

            {/* Logo (small, on the side) */}
            {partner.logo_url && partner.cover_image_url && (
              <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-white border border-gray-100 shadow-sm">
                <img
                  src={partner.logo_url}
                  alt={`${partner.name} logo`}
                  className="w-full h-full object-contain p-1"
                />
              </div>
            )}
          </div>

          {/* Address - Clickable with route */}
          <div className="flex items-center gap-2 text-text-muted text-sm mb-3">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${partner.address}, ${partner.postal_code || ""} ${partner.city}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate hover:text-teal hover:underline transition-colors"
            >
              {partner.address}, {partner.city}
            </a>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${partner.address}, ${partner.postal_code || ""} ${partner.city}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 p-1.5 bg-teal/10 text-teal rounded-full hover:bg-teal hover:text-white transition-colors"
              title="Route plannen"
            >
              <Navigation className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Iftar Special (for featured partners) - Takeaway Style */}
          {isFeatured && partner.iftar_special && (
            <div className="p-3 bg-amber-50 rounded-xl mb-3 border border-amber-100">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="text-sm font-semibold text-amber-700">
                  Iftar Special
                </span>
                {partner.iftar_special_price && (
                  <span className="ml-auto text-sm font-bold text-amber-900">
                    {partner.iftar_special_price}
                  </span>
                )}
              </div>
              <p className="text-xs text-amber-700 line-clamp-1">
                {partner.iftar_special}
              </p>
            </div>
          )}

          {/* Description - Short */}
          {partner.description && (
            <p className="text-sm text-text-muted line-clamp-2 mb-4">
              {partner.description}
            </p>
          )}

          {/* Action Buttons - Takeaway Style */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Primary CTAs */}
            {partner.website_url && (
              <a
                href={partner.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal text-white text-sm font-medium rounded-full hover:bg-teal/90 transition-colors"
              >
                <Globe className="w-4 h-4" />
                Website
              </a>
            )}

            {partner.menu_url && (
              <a
                href={partner.menu_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-200 transition-colors"
              >
                <Utensils className="w-4 h-4" />
                Menu
              </a>
            )}

            {partner.reservation_url && (
              <a
                href={partner.reservation_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-100 text-amber-700 text-sm font-medium rounded-full hover:bg-amber-200 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Reserveren
              </a>
            )}

            {partner.contact_phone && (
              <a
                href={`tel:${partner.contact_phone}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-full hover:bg-green-200 transition-colors"
              >
                <Phone className="w-4 h-4" />
                Bellen
              </a>
            )}
          </div>

          {/* Delivery Buttons - Takeaway Style (for featured partners) */}
          {isFeatured && hasDelivery && (
            <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-100">
              <span className="text-xs text-text-muted mr-1">Bestellen via:</span>
              {partner.takeaway_url && (
                <a
                  href={partner.takeaway_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 text-white text-xs font-medium rounded-full hover:bg-orange-600 transition-colors"
                >
                  <ShoppingBag className="w-3 h-3" />
                  Takeaway
                </a>
              )}
              {partner.uber_eats_url && (
                <a
                  href={partner.uber_eats_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-xs font-medium rounded-full hover:bg-gray-800 transition-colors"
                >
                  Uber Eats
                </a>
              )}
              {partner.deliveroo_url && (
                <a
                  href={partner.deliveroo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 text-white text-xs font-medium rounded-full hover:bg-teal-700 transition-colors"
                >
                  Deliveroo
                </a>
              )}
            </div>
          )}

          {/* Social Links (for featured partners) */}
          {isFeatured && (partner.facebook_url || partner.instagram_url) && (
            <div className="flex items-center gap-2 mt-3">
              {partner.facebook_url && (
                <a
                  href={partner.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {partner.instagram_url && (
                <a
                  href={partner.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-pink-100 text-pink-700 rounded-full hover:bg-pink-200 transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sponsored disclosure for paid tiers */}
      {isFeatured && (
        <div className="px-5 pb-3 -mt-2">
          <p className="text-[10px] text-text-muted/60 italic">
            Betaalde partnervermelding
          </p>
        </div>
      )}
    </motion.div>
  );
}
