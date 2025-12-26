"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useMemo } from "react";
import { Search, Filter, X, Check } from "lucide-react";
import type { FoodPartner, FoodPartnerCategory } from "@/lib/food-partner-types";
import { categoryLabels } from "@/lib/food-partner-types";
import { FoodPartnerCard } from "./FoodPartnerCard";

interface FoodPartnerListProps {
  partners: FoodPartner[];
  embedded?: boolean;
}

export function FoodPartnerList({ partners, embedded = false }: FoodPartnerListProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: "all" as "all" | FoodPartnerCategory,
    halal_certified: false,
  });

  // Check if any filter is active
  const hasActiveFilters = filters.category !== "all" || filters.halal_certified;

  // Separate featured and regular partners
  const { featuredPartners, regularPartners } = useMemo(() => {
    const featured = partners.filter(
      (p) => p.partner_tier === "partner_plus" || p.partner_tier === "partner"
    );
    const regular = partners.filter((p) => p.partner_tier === "free");
    return { featuredPartners: featured, regularPartners: regular };
  }, [partners]);

  // Filter partners
  const filteredPartners = useMemo(() => {
    let result = partners;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (partner) =>
          partner.name.toLowerCase().includes(query) ||
          partner.address.toLowerCase().includes(query) ||
          partner.city.toLowerCase().includes(query) ||
          (partner.cuisine_type?.toLowerCase().includes(query) ?? false)
      );
    }

    // Category filter
    if (filters.category !== "all") {
      result = result.filter((partner) => partner.category === filters.category);
    }

    // Halal certified filter
    if (filters.halal_certified) {
      result = result.filter((partner) => partner.is_halal_certified);
    }

    // Sort by tier priority, then by name
    const tierOrder: Record<string, number> = {
      partner_plus: 0,
      partner: 1,
      free: 2,
    };

    result = [...result].sort((a, b) => {
      const tierDiff = tierOrder[a.partner_tier] - tierOrder[b.partner_tier];
      if (tierDiff !== 0) return tierDiff;
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [partners, searchQuery, filters]);

  const clearFilters = () => {
    setFilters({
      category: "all",
      halal_certified: false,
    });
    setSearchQuery("");
  };

  if (partners.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-muted text-lg">Nog geen food partners beschikbaar</p>
      </div>
    );
  }

  const content = (
    <div ref={ref}>
      {/* Search & Filter Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.15 }}
        className="flex flex-col sm:flex-row gap-4 mb-6"
      >
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            placeholder="Zoek op naam, adres of keuken..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-12 w-full"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text-primary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
            showFilters || hasActiveFilters
              ? "bg-teal text-white"
              : "bg-gray-100 text-text-secondary hover:bg-gray-200"
          }`}
        >
          <Filter className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <span className="w-5 h-5 bg-white text-teal text-xs font-bold rounded-full flex items-center justify-center">
              {(filters.category !== "all" ? 1 : 0) + (filters.halal_certified ? 1 : 0)}
            </span>
          )}
        </button>
      </motion.div>

      {/* Filter Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-gray-50 rounded-2xl p-5 mb-6"
        >
          <div className="space-y-4">
            {/* Category filters */}
            <div>
              <p className="text-sm font-medium text-text-secondary mb-3">Categorie</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilters({ ...filters, category: "all" })}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    filters.category === "all"
                      ? "bg-teal text-white font-medium"
                      : "bg-white text-text-secondary hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  Alle
                </button>
                {(Object.keys(categoryLabels) as FoodPartnerCategory[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilters({ ...filters, category: cat })}
                    className={`px-4 py-2 rounded-full text-sm transition-all ${
                      filters.category === cat
                        ? "bg-teal text-white font-medium"
                        : "bg-white text-text-secondary hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {categoryLabels[cat]}
                  </button>
                ))}
              </div>
            </div>

            {/* Halal certified filter */}
            <div>
              <button
                onClick={() =>
                  setFilters({ ...filters, halal_certified: !filters.halal_certified })
                }
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all ${
                  filters.halal_certified
                    ? "bg-green-500 text-white font-medium"
                    : "bg-white text-text-secondary hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <Check className="w-4 h-4" />
                Halal Gecertificeerd
              </button>
            </div>

            {/* Clear filters */}
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-sm text-teal hover:underline">
                Alle filters wissen
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* Results count */}
      {(searchQuery || hasActiveFilters) && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-text-muted mb-6"
        >
          {filteredPartners.length} resultaat{filteredPartners.length !== 1 ? "en" : ""}{" "}
          gevonden
        </motion.p>
      )}

      {/* Partners Grid */}
      {filteredPartners.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-muted text-lg">
            {searchQuery || hasActiveFilters
              ? "Geen food partners gevonden met de huidige filters"
              : "Geen food partners beschikbaar"}
          </p>
          {(searchQuery || hasActiveFilters) && (
            <button onClick={clearFilters} className="mt-4 text-teal hover:underline">
              Filters wissen
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Featured Partners Section */}
          {!searchQuery && !hasActiveFilters && featuredPartners.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-display font-semibold text-text-primary mb-4">
                Uitgelichte Partners
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {featuredPartners.map((partner, index) => (
                  <FoodPartnerCard
                    key={partner.id}
                    partner={partner}
                    index={index}
                    isInView={isInView}
                  />
                ))}
              </div>
            </div>
          )}

          {/* All Partners / Filtered Results */}
          <div>
            {!searchQuery && !hasActiveFilters && regularPartners.length > 0 && (
              <h3 className="text-lg font-display font-semibold text-text-primary mb-4">
                Alle Food Partners
              </h3>
            )}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(searchQuery || hasActiveFilters ? filteredPartners : regularPartners).map(
                (partner, index) => (
                  <FoodPartnerCard
                    key={partner.id}
                    partner={partner}
                    index={index}
                    isInView={isInView}
                  />
                )
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <section id="food-partners" className="bg-off-white section-padding">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="heading-section mb-4"
          >
            Halal Eten & Drinken
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-body"
          >
            {partners.length} food partner{partners.length !== 1 ? "s" : ""} in Gent
          </motion.p>
        </div>
        {content}
      </div>
    </section>
  );
}
