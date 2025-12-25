"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useMemo } from "react";
import { Clock, MapPin, Users, Check, Calendar, ExternalLink, Globe, Facebook, Instagram, Search, Filter, X } from "lucide-react";
import { type IftarLocation, formatFrequencyDisplay } from "@/lib/iftar-types";

interface IftarListProps {
  locations: IftarLocation[];
  mosqueAddresses?: Set<string>;
  embedded?: boolean;
}

export function IftarList({ locations, mosqueAddresses, embedded = false }: IftarListProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    for_men: false,
    for_women: false,
    for_families: false,
    frequency: "all" as "all" | "daily" | "weekly" | "specific_days" | "one_time",
  });

  // Check if a location is a mosque based on address match
  const isMosque = (location: IftarLocation): boolean => {
    if (!mosqueAddresses) return false;
    const locationAddress = location.address.toLowerCase();
    return Array.from(mosqueAddresses).some(mosqueAddr =>
      locationAddress.includes(mosqueAddr) || mosqueAddr.includes(locationAddress)
    );
  };

  // Check if any filter is active
  const anyAccessibilityFilter = filters.for_men || filters.for_women || filters.for_families;
  const hasActiveFilters = anyAccessibilityFilter || filters.frequency !== "all";

  // Filter locations
  const filteredLocations = useMemo(() => {
    let result = locations;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (loc) =>
          loc.mosque_name.toLowerCase().includes(query) ||
          loc.address.toLowerCase().includes(query) ||
          loc.city.toLowerCase().includes(query)
      );
    }

    // Accessibility filters (OR logic)
    if (anyAccessibilityFilter) {
      result = result.filter((loc) => {
        return (
          (filters.for_men && loc.for_men) ||
          (filters.for_women && loc.for_women) ||
          (filters.for_families && loc.for_families)
        );
      });
    }

    // Frequency filter
    if (filters.frequency !== "all") {
      result = result.filter((loc) => loc.frequency === filters.frequency);
    }

    // Sort alphabetically by name
    result = [...result].sort((a, b) => a.mosque_name.localeCompare(b.mosque_name));

    return result;
  }, [locations, searchQuery, filters, anyAccessibilityFilter]);

  const clearFilters = () => {
    setFilters({
      for_men: false,
      for_women: false,
      for_families: false,
      frequency: "all",
    });
    setSearchQuery("");
  };

  if (locations.length === 0) {
    return null;
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
            placeholder="Zoek op naam, adres of stad..."
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
              {(filters.for_men ? 1 : 0) + (filters.for_women ? 1 : 0) + (filters.for_families ? 1 : 0) + (filters.frequency !== "all" ? 1 : 0)}
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
            {/* Accessibility filters */}
            <div>
              <p className="text-sm font-medium text-text-secondary mb-3">Toegankelijk voor</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilters({ ...filters, for_men: !filters.for_men })}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    filters.for_men
                      ? "bg-blue-500 text-white font-medium"
                      : "bg-white text-text-secondary hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  Mannen
                </button>
                <button
                  onClick={() => setFilters({ ...filters, for_women: !filters.for_women })}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    filters.for_women
                      ? "bg-pink-500 text-white font-medium"
                      : "bg-white text-text-secondary hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  Vrouwen
                </button>
                <button
                  onClick={() => setFilters({ ...filters, for_families: !filters.for_families })}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    filters.for_families
                      ? "bg-purple-500 text-white font-medium"
                      : "bg-white text-text-secondary hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  Gezinnen
                </button>
              </div>
            </div>

            {/* Frequency filter */}
            <div>
              <p className="text-sm font-medium text-text-secondary mb-3">Frequentie</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "all", label: "Alle" },
                  { value: "daily", label: "Dagelijks" },
                  { value: "weekly", label: "Wekelijks" },
                  { value: "specific_days", label: "Specifieke dagen" },
                  { value: "one_time", label: "Eenmalig" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      setFilters({
                        ...filters,
                        frequency: option.value as typeof filters.frequency,
                      })
                    }
                    className={`px-4 py-2 rounded-full text-sm transition-all ${
                      filters.frequency === option.value
                        ? "bg-teal text-white font-medium"
                        : "bg-white text-text-secondary hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-teal hover:underline"
              >
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
          {filteredLocations.length} resultaat{filteredLocations.length !== 1 ? "en" : ""} gevonden
        </motion.p>
      )}

      {/* Grid */}
      {filteredLocations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-muted text-lg">
            {searchQuery || hasActiveFilters
              ? "Geen iftars gevonden met de huidige filters"
              : "Geen iftars beschikbaar"
            }
          </p>
          {(searchQuery || hasActiveFilters) && (
            <button
              onClick={clearFilters}
              className="mt-4 text-teal hover:underline"
            >
              Filters wissen
            </button>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLocations.map((location, index) => (
            <motion.div
              key={location.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="card hover:shadow-lg transition-shadow"
            >
              {/* Header */}
              <div className="mb-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-display font-semibold text-lg text-text-primary">
                    {location.mosque_name}
                  </h3>
                  {mosqueAddresses && (
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full flex-shrink-0 ${
                      isMosque(location)
                        ? "bg-teal/10 text-teal"
                        : "bg-amber-100 text-amber-700"
                    }`}>
                      {isMosque(location) ? "Moskee" : "Organisatie"}
                    </span>
                  )}
                </div>
                <div className="flex items-start gap-2 text-text-muted text-sm">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>
                    {location.address}, {location.city}
                  </span>
                </div>
              </div>

              {/* Time & Frequency */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 p-3 bg-teal/10 rounded-xl">
                  <Clock className="w-5 h-5 text-teal" />
                  <span className="font-semibold text-teal">
                    Iftar: {location.iftar_time}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-xl">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-700">
                    {formatFrequencyDisplay(location.frequency, location.days_of_week || [])}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm">
                {location.capacity && (
                  <div className="flex items-center gap-2 text-text-muted">
                    <Users className="w-4 h-4" />
                    <span>Capaciteit: {location.capacity} personen</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Check
                    className={`w-4 h-4 ${
                      location.is_free ? "text-green-500" : "text-text-muted"
                    }`}
                  />
                  <span
                    className={
                      location.is_free
                        ? "text-green-600 font-medium"
                        : "text-text-muted"
                    }
                  >
                    {location.is_free
                      ? "Gratis"
                      : location.price_info || "Betaald"}
                  </span>
                </div>
              </div>

              {/* Accessibility tags */}
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                {location.for_men && (
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                    Mannen
                  </span>
                )}
                {location.for_women && (
                  <span className="px-2 py-1 bg-pink-50 text-pink-700 text-xs rounded-full">
                    Vrouwen
                  </span>
                )}
                {location.for_families && (
                  <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full">
                    Gezinnen
                  </span>
                )}
              </div>

              {/* Description */}
              {location.description && (
                <p className="mt-4 text-sm text-text-muted line-clamp-2">
                  {location.description}
                </p>
              )}

              {/* Links */}
              {(location.registration_url || location.website_url || location.facebook_url || location.instagram_url) && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                  {location.registration_url && (
                    <a
                      href={location.registration_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal text-white text-xs rounded-full hover:bg-teal/90 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Inschrijven
                    </a>
                  )}
                  {location.website_url && (
                    <a
                      href={location.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <Globe className="w-3 h-3" />
                      Website
                    </a>
                  )}
                  {location.facebook_url && (
                    <a
                      href={location.facebook_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 text-xs rounded-full hover:bg-blue-200 transition-colors"
                    >
                      <Facebook className="w-3 h-3" />
                      Facebook
                    </a>
                  )}
                  {location.instagram_url && (
                    <a
                      href={location.instagram_url}
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
            </motion.div>
          ))}
        </div>
        )}
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <section id="iftar-list" className="bg-off-white section-padding">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="heading-section mb-4"
          >
            Alle iftar locaties
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-body"
          >
            {locations.length} iftar{locations.length !== 1 ? "s" : ""}{" "}
            beschikbaar
          </motion.p>
        </div>
        {content}
      </div>
    </section>
  );
}
