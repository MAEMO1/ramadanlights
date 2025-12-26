"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  MapPin,
  Globe,
  Check,
  Star,
  Truck,
  ImageIcon,
  Navigation,
  Phone,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
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
  const isPremium = isPremiumPartner(partner.partner_tier);

  // Check if has any delivery option
  const hasDelivery = partner.uber_eats_url || partner.deliveroo_url || partner.takeaway_url;

  // Gallery state for premium partners
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);

  // Collect all available images for gallery
  const galleryImages: string[] = [];
  if (partner.cover_image_url) galleryImages.push(partner.cover_image_url);
  if (partner.logo_url && partner.logo_url !== partner.cover_image_url) {
    galleryImages.push(partner.logo_url);
  }

  const hasMultipleImages = galleryImages.length > 1;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  // Premium/Partner Plus - Horizontal card with portrait image on LEFT
  if (isPremium) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 + index * 0.05 }}
          className={`group relative rounded-2xl overflow-hidden transition-all hover:shadow-xl bg-white ${tierConfig.cardStyle}`}
        >
          <div className="flex flex-col sm:flex-row">
            {/* LEFT: Portrait Image */}
            <div
              className="relative w-full sm:w-[280px] h-[200px] sm:h-auto sm:min-h-[320px] flex-shrink-0 cursor-pointer"
              onClick={() => galleryImages.length > 0 && setShowGallery(true)}
            >
              {galleryImages.length > 0 ? (
                <>
                  <img
                    src={galleryImages[currentImageIndex]}
                    alt={partner.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Gallery navigation arrows */}
                  {hasMultipleImages && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center text-gray-700 hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center text-gray-700 hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-gray-300" />
                </div>
              )}

              {/* Tier Badge - Top Left */}
              {badgeInfo && (
                <div className={`absolute top-3 left-3 px-3 py-1 text-xs font-bold uppercase tracking-wide rounded-md ${badgeInfo.className}`}>
                  {badgeInfo.label}
                </div>
              )}

              {/* Bottom badges */}
              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                {partner.is_halal_certified && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white text-xs font-medium rounded-md">
                    <Check className="w-3 h-3" />
                    Halal
                  </div>
                )}
                {hasDelivery && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded-md">
                    <Truck className="w-3 h-3" />
                    Bezorging
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Content */}
            <div className="flex-1 p-5">
              {/* Header with name and logo */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-xl font-semibold text-text-primary group-hover:text-teal transition-colors">
                    {partner.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-sm text-text-muted">
                    <span>{categoryLabels[partner.category]}</span>
                    {partner.cuisine_type && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <span>{cuisineIcons[partner.cuisine_type]}</span>
                          {cuisineTypeLabels[partner.cuisine_type]}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                {/* Logo thumbnail */}
                {partner.logo_url && partner.logo_url !== partner.cover_image_url && (
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                    <img src={partner.logo_url} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Address with route link */}
              <div className="flex items-center gap-2 mt-3 text-sm text-text-muted">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>{partner.address}, {partner.city}</span>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${partner.address}, ${partner.postal_code || ""} ${partner.city}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal hover:underline"
                >
                  <Navigation className="w-4 h-4" />
                </a>
              </div>

              {/* Iftar Special */}
              {partner.iftar_special && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-900">Iftar Special</p>
                        <p className="text-sm text-amber-700">{partner.iftar_special}</p>
                      </div>
                    </div>
                    {partner.iftar_special_price && (
                      <span className="text-sm font-bold text-amber-900 whitespace-nowrap">{partner.iftar_special_price}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              {partner.description && (
                <p className="text-sm text-text-secondary mt-3 line-clamp-2">
                  {partner.description}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 mt-4">
                {partner.website_url && (
                  <a
                    href={partner.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal text-white rounded-lg hover:bg-teal/90 transition-colors text-sm font-medium"
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
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-text-secondary rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    <span>🍽️</span>
                    Menu
                  </a>
                )}
                {partner.reservation_url && (
                  <a
                    href={partner.reservation_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-text-secondary rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Reserveren
                  </a>
                )}
                {partner.contact_phone && (
                  <a
                    href={`tel:${partner.contact_phone}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-text-secondary rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    <Phone className="w-4 h-4" />
                    Bellen
                  </a>
                )}
              </div>

              {/* Delivery options */}
              {hasDelivery && (
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xs text-text-muted">Bestellen via:</span>
                  {partner.takeaway_url && (
                    <a
                      href={partner.takeaway_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded-md hover:bg-orange-600 transition-colors"
                    >
                      Takeaway
                    </a>
                  )}
                  {partner.uber_eats_url && (
                    <a
                      href={partner.uber_eats_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1 bg-gray-800 text-white text-xs font-medium rounded-md hover:bg-gray-900 transition-colors"
                    >
                      Uber Eats
                    </a>
                  )}
                  {partner.deliveroo_url && (
                    <a
                      href={partner.deliveroo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1 bg-teal-600 text-white text-xs font-medium rounded-md hover:bg-teal-700 transition-colors"
                    >
                      Deliveroo
                    </a>
                  )}
                </div>
              )}

              {/* Social links */}
              {(partner.facebook_url || partner.instagram_url) && (
                <div className="flex items-center gap-2 mt-3">
                  {partner.facebook_url && (
                    <a
                      href={partner.facebook_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.77,7.46H14.5v-1.9c0-.9.6-1.1,1-1.1h3V.5L14.17.5C10.24.5,9.25,3.11,9.25,5.07V7.46H6.77v4.09h2.48V22.5h4.75V11.55h3.14l.41-4.09Z"/></svg>
                    </a>
                  )}
                  {partner.instagram_url && (
                    <a
                      href={partner.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12,2.16c3.2,0,3.58,0,4.85.07,3.25.15,4.77,1.69,4.92,4.92.06,1.27.07,1.65.07,4.85s0,3.58-.07,4.85c-.15,3.23-1.66,4.77-4.92,4.92-1.27.06-1.65.07-4.85.07s-3.58,0-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s0-3.58.07-4.85C2.38,3.92,3.9,2.38,7.15,2.23,8.42,2.18,8.8,2.16,12,2.16ZM12,0C8.74,0,8.33,0,7.05.07c-4.35.2-6.78,2.62-7,7C0,8.33,0,8.74,0,12s0,3.67.07,4.95c.2,4.36,2.62,6.78,7,7C8.33,24,8.74,24,12,24s3.67,0,4.95-.07c4.35-.2,6.78-2.62,7-7C24,15.67,24,15.26,24,12s0-3.67-.07-4.95c-.2-4.35-2.62-6.78-7-7C15.67,0,15.26,0,12,0Zm0,5.84A6.16,6.16,0,1,0,18.16,12,6.16,6.16,0,0,0,12,5.84ZM12,16a4,4,0,1,1,4-4A4,4,0,0,1,12,16ZM18.41,4.15a1.44,1.44,0,1,0,1.44,1.44A1.44,1.44,0,0,0,18.41,4.15Z"/></svg>
                    </a>
                  )}
                </div>
              )}

              {/* Sponsored disclosure */}
              <p className="text-[10px] text-text-muted/50 italic mt-3">
                Betaalde partnervermelding
              </p>
            </div>
          </div>
        </motion.div>

        {/* Full Screen Gallery Modal */}
        {showGallery && galleryImages.length > 0 && (
          <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setShowGallery(false)}
          >
            <button
              onClick={() => setShowGallery(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
            >
              <X className="w-6 h-6" />
            </button>

            <img
              src={galleryImages[currentImageIndex]}
              alt={partner.name}
              className="max-w-[90vw] max-h-[80vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {hasMultipleImages && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                  {galleryImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i); }}
                      className={`w-3 h-3 rounded-full transition-all ${
                        i === currentImageIndex ? "bg-white w-6" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            <p className="absolute bottom-6 left-6 text-white font-medium">
              {partner.name}
            </p>
          </div>
        )}
      </>
    );
  }

  // Standard compact card for partner and free tiers
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
              <div className="flex items-center gap-2">
                <h3 className="font-display font-semibold text-text-primary group-hover:text-teal transition-colors truncate">
                  {partner.name}
                </h3>
                {/* Tier Badge */}
                {badgeInfo && (
                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-full flex-shrink-0 ${badgeInfo.className}`}>
                    {badgeInfo.label}
                  </span>
                )}
              </div>
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

          {/* Iftar Special - Compact (for paid tiers) */}
          {isFeatured && partner.iftar_special && (
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

      {/* Sponsored disclosure for paid tiers */}
      {isFeatured && (
        <div className="px-4 pb-2 -mt-1">
          <p className="text-[9px] text-text-muted/50 italic">
            Betaalde partnervermelding
          </p>
        </div>
      )}
    </motion.div>
  );
}
