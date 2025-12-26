"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  MapPin,
  Globe,
  Tag,
  ImageIcon,
  Navigation,
  Phone,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
  Facebook,
  Instagram,
} from "lucide-react";
import type { ShopPartner } from "@/lib/shop-partner-types";
import { shopCategoryLabels, shopCategoryEmojis, getShopTierBadgeInfo, isShopFeaturedPartner, isShopPremiumPartner } from "@/lib/shop-partner-types";
import { getTierConfig } from "@/lib/partner-config";

interface ShopPartnerCardProps {
  partner: ShopPartner;
  index?: number;
  isInView?: boolean;
}

export function ShopPartnerCard({
  partner,
  index = 0,
  isInView = true,
}: ShopPartnerCardProps) {
  const tierConfig = getTierConfig(partner.partner_tier);
  const badgeInfo = getShopTierBadgeInfo(partner.partner_tier);
  const isFeatured = isShopFeaturedPartner(partner.partner_tier);
  const isPremium = isShopPremiumPartner(partner.partner_tier);

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

  // Google Maps navigation URL
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${partner.address}, ${partner.city}`
  )}`;

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
              className="relative w-full sm:w-[280px] aspect-[4/3] sm:aspect-auto sm:h-auto sm:min-h-[320px] flex-shrink-0 cursor-pointer"
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

              {/* Ramadan special badge */}
              {partner.ramadan_special && (
                <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 bg-amber-500 text-white text-xs font-medium rounded-md">
                  <Tag className="w-3 h-3" />
                  Ramadan Actie
                </div>
              )}
            </div>

            {/* RIGHT: Content */}
            <div className="flex-1 p-5 sm:p-6 flex flex-col">
              {/* Header */}
              <div className="mb-4">
                <h3 className="text-xl font-display font-bold text-text-primary mb-1">
                  {partner.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-text-muted">
                  <span className="text-lg">{shopCategoryEmojis[partner.category]}</span>
                  <span>{shopCategoryLabels[partner.category]}</span>
                </div>
              </div>

              {/* Address */}
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 text-sm text-text-secondary hover:text-teal transition-colors mb-4"
              >
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-teal" />
                <span>
                  {partner.address}, {partner.city}
                </span>
              </a>

              {/* Ramadan Special highlight */}
              {partner.ramadan_special && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 text-amber-700 font-semibold mb-2">
                    <Tag className="w-4 h-4" />
                    Ramadan Actie
                  </div>
                  <p className="text-sm text-amber-900">
                    {partner.ramadan_special}
                  </p>
                  {partner.ramadan_special_discount && (
                    <p className="text-sm font-bold text-amber-700 mt-2">
                      {partner.ramadan_special_discount}
                    </p>
                  )}
                </div>
              )}

              {/* Description */}
              {partner.description && (
                <p className="text-sm text-text-muted line-clamp-2 mb-4">
                  {partner.description}
                </p>
              )}

              {/* Action buttons */}
              <div className="mt-auto flex flex-wrap gap-2">
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
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-200 transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  Navigeer
                </a>
                {partner.facebook_url && (
                  <a
                    href={partner.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {partner.instagram_url && (
                  <a
                    href={partner.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-10 h-10 bg-pink-100 text-pink-600 rounded-full hover:bg-pink-200 transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
              </div>

              {/* Paid partner disclosure */}
              {isFeatured && (
                <p className="mt-4 text-xs text-text-muted">
                  Betaalde partnervermelding
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Full-screen gallery modal */}
        {showGallery && galleryImages.length > 0 && (
          <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setShowGallery(false)}
          >
            <button
              onClick={() => setShowGallery(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <img
              src={galleryImages[currentImageIndex]}
              alt={partner.name}
              className="max-w-[90vw] max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {hasMultipleImages && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        )}
      </>
    );
  }

  // Standard card (Partner / Free tier) - Compact horizontal layout
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.1 + index * 0.05 }}
      className={`group relative rounded-2xl overflow-hidden transition-all hover:shadow-lg bg-white ${tierConfig.cardStyle}`}
    >
      <div className="flex items-center gap-4 p-4">
        {/* Left: Small image/icon */}
        <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
          {partner.logo_url ? (
            <img
              src={partner.logo_url}
              alt={partner.name}
              className="w-full h-full object-cover"
            />
          ) : partner.cover_image_url ? (
            <img
              src={partner.cover_image_url}
              alt={partner.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-2xl">
              {shopCategoryEmojis[partner.category]}
            </div>
          )}

          {/* Ramadan special indicator */}
          {partner.ramadan_special && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
              <Tag className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        {/* Center: Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-semibold text-text-primary truncate">
              {partner.name}
            </h3>
            {badgeInfo && (
              <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${badgeInfo.className}`}>
                {badgeInfo.label}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-text-muted mb-1">
            <span>{shopCategoryEmojis[partner.category]}</span>
            <span>{shopCategoryLabels[partner.category]}</span>
          </div>
          <p className="text-xs text-text-muted truncate">
            {partner.address}, {partner.city}
          </p>

          {/* Ramadan special (compact) */}
          {isFeatured && partner.ramadan_special && (
            <p className="text-xs text-amber-600 font-medium mt-1 truncate">
              {partner.ramadan_special_discount || partner.ramadan_special}
            </p>
          )}
        </div>

        {/* Right: Quick actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {partner.website_url && (
            <a
              href={partner.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-teal/10 text-teal flex items-center justify-center hover:bg-teal hover:text-white transition-colors"
              title="Website"
            >
              <Globe className="w-4 h-4" />
            </a>
          )}
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors"
            title="Navigeer"
          >
            <Navigation className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Paid partner disclosure (subtle) */}
      {isFeatured && (
        <div className="px-4 pb-2">
          <p className="text-[10px] text-text-muted">Betaalde partnervermelding</p>
        </div>
      )}
    </motion.div>
  );
}
