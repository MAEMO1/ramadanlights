"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { MapPin, Users, Filter } from "lucide-react";
import dynamic from "next/dynamic";
import type { IftarLocation } from "@/lib/iftar-types";

const IftarMapComponent = dynamic(() => import("./IftarMapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-[#0a2020] rounded-2xl flex items-center justify-center">
      <div className="text-white/50">Kaart laden...</div>
    </div>
  ),
});

interface IftarMapProps {
  locations: IftarLocation[];
}

export function IftarMap({ locations }: IftarMapProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [filters, setFilters] = useState({
    for_men: false,
    for_women: false,
    for_families: false,
    frequency: "all" as "all" | "daily" | "weekly" | "specific_days" | "one_time",
  });
  const [showFilters, setShowFilters] = useState(false);

  // Check if any accessibility filter is active
  const anyAccessibilityFilter = filters.for_men || filters.for_women || filters.for_families;

  const filteredLocations = locations.filter((loc) => {
    // Accessibility filters (OR logic - show if matches ANY selected filter)
    if (anyAccessibilityFilter) {
      const matchesAccessibility =
        (filters.for_men && loc.for_men) ||
        (filters.for_women && loc.for_women) ||
        (filters.for_families && loc.for_families);
      if (!matchesAccessibility) return false;
    }

    // Frequency filter
    if (filters.frequency !== "all" && loc.frequency !== filters.frequency) return false;

    return true;
  });

  // Only show locations that have coordinates
  const locationsWithCoords = filteredLocations.filter(
    (loc) => loc.latitude && loc.longitude
  );

  return (
    <section className="bg-[#0f2d2d] section-padding">
      <div ref={ref} className="section-container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              className="text-3xl md:text-4xl font-display font-semibold text-white"
            >
              Kaart
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="text-white/60 mt-2"
            >
              {locationsWithCoords.length} locaties
            </motion.p>
          </div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              showFilters
                ? "bg-white text-[#0f2d2d]"
                : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
          </motion.button>
        </div>

        {/* Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/10"
          >
            <div className="space-y-4">
              {/* Frequency filter */}
              <div>
                <p className="text-sm font-medium text-white/70 mb-3">Frequentie</p>
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
                          ? "bg-white text-[#0f2d2d] font-medium"
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accessibility filters */}
              <div>
                <p className="text-sm font-medium text-white/70 mb-3">Toegankelijk voor</p>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.for_men}
                      onChange={(e) =>
                        setFilters({ ...filters, for_men: e.target.checked })
                      }
                      className="w-4 h-4 rounded border-white/30 bg-white/10 text-teal focus:ring-teal"
                    />
                    <span className="text-sm">Mannen</span>
                  </label>

                  <label className="flex items-center gap-2 text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.for_women}
                      onChange={(e) =>
                        setFilters({ ...filters, for_women: e.target.checked })
                      }
                      className="w-4 h-4 rounded border-white/30 bg-white/10 text-teal focus:ring-teal"
                    />
                    <span className="text-sm">Vrouwen</span>
                  </label>

                  <label className="flex items-center gap-2 text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.for_families}
                      onChange={(e) =>
                        setFilters({ ...filters, for_families: e.target.checked })
                      }
                      className="w-4 h-4 rounded border-white/30 bg-white/10 text-teal focus:ring-teal"
                    />
                    <span className="text-sm">Gezinnen</span>
                  </label>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="relative isolate rounded-2xl overflow-hidden"
          style={{ height: "600px" }}
        >
          {locationsWithCoords.length > 0 ? (
            <IftarMapComponent locations={locationsWithCoords} />
          ) : (
            <div className="w-full h-full bg-[#1d3d3d] flex flex-col items-center justify-center text-center p-8">
              <MapPin className="w-12 h-12 text-white/30 mb-4" />
              <p className="text-white/50">
                {locations.length === 0
                  ? "Er zijn nog geen iftar locaties toegevoegd."
                  : "Geen locaties gevonden met de huidige filters."}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
