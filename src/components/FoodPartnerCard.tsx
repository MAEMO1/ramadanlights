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
} from "lucide-react";
import type { FoodPartner } from "@/lib/food-partner-types";
import { categoryLabels, getTierBadgeInfo, isFeaturedPartner, isPremiumPartner } from "@/lib/food-partner-types";
import { getTierConfig } from "@/lib/partner-config";

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.1 + index * 0.05 }}
      className={`relative rounded-2xl overflow-hidden transition-shadow hover:shadow-lg ${tierConfig.cardStyle}`}
    >
      {/* Sponsor/Featured Badge */}
      {badgeInfo && (
        <div
          className={`absolute top-4 right-4 z-10 px-3 py-1 text-xs font-bold uppercase tracking-wide rounded-full ${badgeInfo.className}`}
        >
          {badgeInfo.label}
        </div>
      )}

      {/* Cover Image (for partner_plus and premium tiers) */}
      {hasPremiumFeatures && partner.cover_image_url && (
        <div className="relative h-40 w-full">
          <img
            src={partner.cover_image_url}
            alt={partner.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          {/* Logo */}
          {partner.logo_url && (
            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-white border border-gray-100">
              <img
                src={partner.logo_url}
                alt={`${partner.name} logo`}
                className="w-full h-full object-contain p-1"
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-lg text-text-primary truncate">
              {partner.name}
            </h3>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                {categoryLabels[partner.category]}
              </span>
              {partner.cuisine_type && (
                <span className="text-xs text-text-muted">
                  {partner.cuisine_type}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start gap-2 text-text-muted text-sm mb-4">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>
            {partner.address}, {partner.city}
          </span>
        </div>

        {/* Halal Certification */}
        {partner.is_halal_certified && (
          <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-xl mb-4">
            <Check className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">
              Halal Gecertificeerd
            </span>
          </div>
        )}

        {/* Iftar Special (for featured partners) */}
        {isFeatured && partner.iftar_special && (
          <div className="p-3 bg-amber-50 rounded-xl mb-4 border border-amber-200">
            <div className="flex items-center gap-2 mb-1">
              <Utensils className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-semibold text-amber-700">
                Iftar Special
              </span>
            </div>
            <p className="text-sm text-amber-800">{partner.iftar_special}</p>
            {partner.iftar_special_price && (
              <p className="text-sm font-bold text-amber-900 mt-1">
                {partner.iftar_special_price}
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

        {/* CTA Links */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
          {partner.website_url && (
            <a
              href={partner.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal text-white text-xs rounded-full hover:bg-teal/90 transition-colors"
            >
              <Globe className="w-3 h-3" />
              Website
            </a>
          )}
          {partner.menu_url && (
            <a
              href={partner.menu_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-gray-200 transition-colors"
            >
              <Utensils className="w-3 h-3" />
              Menu
            </a>
          )}
          {partner.reservation_url && (
            <a
              href={partner.reservation_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-700 text-xs rounded-full hover:bg-amber-200 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Reserveren
            </a>
          )}
          {partner.contact_phone && (
            <a
              href={`tel:${partner.contact_phone}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 text-xs rounded-full hover:bg-green-200 transition-colors"
            >
              <Phone className="w-3 h-3" />
              Bellen
            </a>
          )}
        </div>

        {/* Social Links (for featured partners) */}
        {isFeatured &&
          (partner.facebook_url || partner.instagram_url) && (
            <div className="flex gap-2 mt-3">
              {partner.facebook_url && (
                <a
                  href={partner.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 text-xs rounded-full hover:bg-blue-200 transition-colors"
                >
                  <Facebook className="w-3 h-3" />
                  Facebook
                </a>
              )}
              {partner.instagram_url && (
                <a
                  href={partner.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-pink-100 text-pink-700 text-xs rounded-full hover:bg-pink-200 transition-colors"
                >
                  <Instagram className="w-3 h-3" />
                  Instagram
                </a>
              )}
            </div>
          )}

        {/* Delivery Links (for partner_plus and premium) */}
        {hasPremiumFeatures &&
          (partner.uber_eats_url || partner.deliveroo_url) && (
            <div className="flex gap-2 mt-3">
              {partner.uber_eats_url && (
                <a
                  href={partner.uber_eats_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-xs rounded-full hover:bg-gray-800 transition-colors"
                >
                  Uber Eats
                </a>
              )}
              {partner.deliveroo_url && (
                <a
                  href={partner.deliveroo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 text-white text-xs rounded-full hover:bg-teal-700 transition-colors"
                >
                  Deliveroo
                </a>
              )}
            </div>
          )}
      </div>

      {/* Sponsored disclosure for paid tiers */}
      {isFeatured && (
        <div className="px-6 pb-4">
          <p className="text-[10px] text-text-muted italic">
            Dit is een betaalde partnervermelding
          </p>
        </div>
      )}
    </motion.div>
  );
}
