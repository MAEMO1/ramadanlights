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
    for_men: true,
    for_women: true,
    for_families: true,
    frequency: "all" as "all" | "daily" | "weekly" | "specific_days" | "one_time",
  });
  const [showFilters, setShowFilters] = useState(false);

  const filteredLocations = locations.filter((loc) => {
    // Accessibility filters
    if (filters.for_men && !loc.for_men) return false;
    if (filters.for_women && !loc.for_women) return false;
    if (filters.for_families && !loc.for_families) return false;

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
        <div className="text-center mb-8">
          <motion.span
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            className="badge mb-6 inline-block"
          >
            Iftarkaart
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-display font-bold text-white mb-4"
          >
            Vind een iftar bij jou in de buurt
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-white/80 text-lg max-w-2xl mx-auto"
          >
            Bekijk alle iftar locaties in Gent en omgeving op de kaart.
          </motion.p>
        </div>

        {/* Stats and Filter toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center items-center gap-4 mb-6"
        >
          <div className="flex items-center gap-2 text-white/80">
            <MapPin className="w-5 h-5 text-gold" />
            <span>{locationsWithCoords.length} locaties op de kaart</span>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              showFilters
                ? "bg-gold text-[#0f2d2d]"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </motion.div>

        {/* Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 mb-6"
          >
            {/* Frequency filter */}
            <div className="flex flex-wrap justify-center gap-2">
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
                      ? "bg-gold text-[#0f2d2d] font-medium"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* Accessibility filters */}
            <div className="flex flex-wrap justify-center gap-4">
              <label className="flex items-center gap-2 text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.for_men}
                  onChange={(e) =>
                    setFilters({ ...filters, for_men: e.target.checked })
                  }
                  className="w-5 h-5 rounded border-white/30 text-gold focus:ring-gold"
                />
                <span>Mannen</span>
              </label>

              <label className="flex items-center gap-2 text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.for_women}
                  onChange={(e) =>
                    setFilters({ ...filters, for_women: e.target.checked })
                  }
                  className="w-5 h-5 rounded border-white/30 text-gold focus:ring-gold"
                />
                <span>Vrouwen</span>
              </label>

              <label className="flex items-center gap-2 text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.for_families}
                  onChange={(e) =>
                    setFilters({ ...filters, for_families: e.target.checked })
                  }
                  className="w-5 h-5 rounded border-white/30 text-gold focus:ring-gold"
                />
                <span>Gezinnen</span>
              </label>
            </div>
          </motion.div>
        )}

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className="relative rounded-2xl overflow-hidden shadow-2xl"
          style={{ height: "500px" }}
        >
          {locationsWithCoords.length > 0 ? (
            <IftarMapComponent locations={locationsWithCoords} />
          ) : (
            <div className="w-full h-full bg-[#0a2020] flex flex-col items-center justify-center text-center p-8">
              <MapPin className="w-16 h-16 text-white/30 mb-4" />
              <p className="text-white/60 text-lg">
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
