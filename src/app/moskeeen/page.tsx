"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MapPin, List, Map, Navigation, Search, X } from "lucide-react";
import dynamic from "next/dynamic";

const MosqueMapComponent = dynamic(() => import("@/components/MosqueMapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#0a2020] rounded-2xl flex items-center justify-center">
      <div className="text-white/50">Kaart laden...</div>
    </div>
  ),
});

interface Mosque {
  id: string;
  name: string;
  address: string;
  houseNumber: string;
  city: string;
  fullAddress: string;
  latitude: number | null;
  longitude: number | null;
}

// Islamic geometric pattern SVG
const IslamicPattern = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.07]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
    <defs>
      <pattern id="islamic-star" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <polygon
          points="10,0 12.5,7.5 20,7.5 14,12 16.5,20 10,15 3.5,20 6,12 0,7.5 7.5,7.5"
          fill="currentColor"
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#islamic-star)" />
  </svg>
);

// Mosque silhouette for hero
const MosqueSilhouette = () => (
  <div className="absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden">
    <svg
      className="w-full h-auto text-black/10"
      viewBox="0 0 1200 200"
      preserveAspectRatio="xMidYMax slice"
      style={{ marginBottom: '-2px' }}
    >
      {/* Main dome mosque - center */}
      <path d="M550 200 L550 140 Q550 100 600 80 Q650 100 650 140 L650 200" fill="currentColor"/>
      <circle cx="600" cy="75" r="8" fill="currentColor"/>
      <rect x="595" y="40" width="10" height="35" fill="currentColor"/>
      <circle cx="600" cy="35" r="6" fill="currentColor"/>

      {/* Left minaret */}
      <rect x="510" y="100" width="20" height="100" fill="currentColor"/>
      <path d="M505 100 L520 60 L535 100 Z" fill="currentColor"/>
      <circle cx="520" cy="55" r="5" fill="currentColor"/>

      {/* Right minaret */}
      <rect x="670" y="100" width="20" height="100" fill="currentColor"/>
      <path d="M665 100 L680 60 L695 100 Z" fill="currentColor"/>
      <circle cx="680" cy="55" r="5" fill="currentColor"/>

      {/* Secondary mosque left */}
      <path d="M200 200 L200 160 Q200 130 240 115 Q280 130 280 160 L280 200" fill="currentColor"/>
      <rect x="235" y="90" width="8" height="25" fill="currentColor"/>
      <circle cx="239" cy="85" r="5" fill="currentColor"/>

      {/* Secondary mosque right */}
      <path d="M920 200 L920 150 Q920 120 970 105 Q1020 120 1020 150 L1020 200" fill="currentColor"/>
      <rect x="965" y="75" width="10" height="30" fill="currentColor"/>
      <circle cx="970" cy="70" r="6" fill="currentColor"/>

      {/* Small buildings/houses */}
      <rect x="100" y="170" width="60" height="30" fill="currentColor"/>
      <rect x="320" y="175" width="40" height="25" fill="currentColor"/>
      <rect x="380" y="165" width="50" height="35" fill="currentColor"/>
      <rect x="750" y="170" width="45" height="30" fill="currentColor"/>
      <rect x="820" y="175" width="55" height="25" fill="currentColor"/>
      <rect x="1050" y="165" width="60" height="35" fill="currentColor"/>
      <rect x="1130" y="175" width="70" height="25" fill="currentColor"/>
      <rect x="0" y="180" width="70" height="20" fill="currentColor"/>
    </svg>
  </div>
);

// Empty state illustration
const EmptyStateIllustration = () => (
  <svg className="w-32 h-32 text-white/20 mb-6" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" strokeDasharray="8 4"/>
    <path
      d="M35 70 L35 50 Q35 35 50 28 Q65 35 65 50 L65 70"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <line x1="50" y1="28" x2="50" y2="18" stroke="currentColor" strokeWidth="2"/>
    <circle cx="50" cy="15" r="3" fill="currentColor"/>
    <line x1="30" y1="75" x2="70" y2="75" stroke="currentColor" strokeWidth="2"/>
    <text x="50" y="90" textAnchor="middle" fill="currentColor" fontSize="8">?</text>
  </svg>
);

export default function MosquePage() {
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [selectedMosque, setSelectedMosque] = useState<Mosque | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchMosques() {
      try {
        const response = await fetch("/api/mosques");
        const data = await response.json();
        if (data.success) {
          setMosques(data.data);
        }
      } catch (error) {
        console.error("Error fetching mosques:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMosques();
  }, []);

  const filteredMosques = mosques.filter((mosque) =>
    mosque.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mosque.fullAddress.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const mosquesWithCoords = filteredMosques.filter((m) => m.latitude && m.longitude);

  const clearSearch = () => setSearchQuery("");

  // Get unique cities/areas for stats
  const uniqueAreas = Array.from(new Set(mosques.map(m => m.city)));

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section - Enhanced with Islamic aesthetics */}
      <section className="relative pt-32 pb-32 bg-gradient-to-b from-[#0a1f1f] via-[#0f2d2d] to-[#1a4a4a] overflow-hidden">
        {/* Islamic geometric pattern background */}
        <div className="absolute inset-0 text-white">
          <IslamicPattern />
        </div>

        {/* Radial gradient overlay for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_0%,rgba(10,31,31,0.4)_70%)]" />

        {/* Decorative crescents */}
        <div className="absolute top-20 left-[10%] text-gold/20 text-6xl font-light select-none">☪</div>
        <div className="absolute top-40 right-[15%] text-gold/10 text-4xl font-light select-none">☪</div>
        <div className="absolute bottom-40 left-[20%] text-gold/15 text-3xl font-light select-none">☪</div>

        <div className="relative z-10 section-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold/20 border border-gold/30 text-gold rounded-full text-sm font-medium mb-8 backdrop-blur-sm"
            >
              <span className="text-lg">☪</span>
              Gebedshuizen
            </motion.span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
              Moskeeën in{" "}
              <span className="text-gold relative">
                Gent
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-gold/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q25 0 50 5 T100 5" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-12 leading-relaxed">
              Ontdek alle moskeeën en islamitische centra in Gent.
              Plan je bezoek en vind de dichtstbijzijnde gebedsplek.
            </p>

            {/* Enhanced Stats */}
            <div className="flex justify-center gap-12 md:gap-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-gold mb-1">{mosques.length}</div>
                <div className="text-sm text-white/50 uppercase tracking-wider">Moskeeën</div>
              </motion.div>
              <div className="w-px bg-white/10" />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-white mb-1">{uniqueAreas.length}</div>
                <div className="text-sm text-white/50 uppercase tracking-wider">Stad</div>
              </motion.div>
              <div className="w-px bg-white/10" />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-white/80 mb-1">5+</div>
                <div className="text-sm text-white/50 uppercase tracking-wider">Wijken</div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Mosque silhouette at bottom */}
        <MosqueSilhouette />
      </section>

      {/* Main Content */}
      <section className="bg-[#0f2d2d] section-padding">
        <div className="section-container">
          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8"
          >
            {/* Search with clear button */}
            <div className="relative w-full sm:w-auto sm:min-w-[350px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Zoek op naam of adres..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 bg-white/10 border border-white/20 rounded-full text-white placeholder:text-white/40 focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-white/20 text-white/60 hover:bg-white/30 hover:text-white transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* View toggle - enhanced */}
            <div className="flex gap-2 p-1 bg-white/5 rounded-full">
              <button
                onClick={() => setViewMode("map")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all ${
                  viewMode === "map"
                    ? "bg-gold text-[#0f2d2d] shadow-lg shadow-gold/20"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <Map className="w-4 h-4" />
                Kaart
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all ${
                  viewMode === "list"
                    ? "bg-gold text-[#0f2d2d] shadow-lg shadow-gold/20"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <List className="w-4 h-4" />
                Lijst
              </button>
            </div>
          </motion.div>

          {/* Results count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 text-white/50 text-sm mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-gold/60" />
            {filteredMosques.length} moskee{filteredMosques.length !== 1 ? "ën" : ""} gevonden
            {searchQuery && (
              <span className="text-white/30">
                voor &ldquo;{searchQuery}&rdquo;
              </span>
            )}
          </motion.div>

          {isLoading ? (
            <div className="h-[70vh] min-h-[500px] max-h-[800px] bg-[#0a2020] rounded-2xl flex items-center justify-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-2 border-gold/30 border-t-gold rounded-full animate-spin mb-4" />
                <div className="text-white/50">Moskeeën laden...</div>
              </div>
            </div>
          ) : (
            <>
              {/* Map View - Increased height */}
              {viewMode === "map" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="rounded-2xl overflow-hidden shadow-2xl shadow-black/30"
                  style={{ height: "clamp(500px, 70vh, 800px)" }}
                >
                  {mosquesWithCoords.length > 0 ? (
                    <MosqueMapComponent
                      mosques={mosquesWithCoords}
                      selectedMosqueId={selectedMosque?.id}
                      onMosqueSelect={setSelectedMosque}
                    />
                  ) : (
                    /* Enhanced empty state */
                    <div className="w-full h-full bg-gradient-to-b from-[#0a2020] to-[#0d2828] flex flex-col items-center justify-center p-8">
                      <EmptyStateIllustration />
                      <h3 className="text-xl font-display font-semibold text-white mb-2">
                        Geen moskeeën gevonden
                      </h3>
                      <p className="text-white/50 text-center mb-6 max-w-sm">
                        Er zijn geen resultaten voor je zoekopdracht. Probeer een andere zoekterm.
                      </p>
                      <button
                        onClick={clearSearch}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-[#0f2d2d] rounded-full font-medium hover:bg-gold/90 transition-all"
                      >
                        <X className="w-4 h-4" />
                        Wis zoekopdracht
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* List View - Enhanced cards */}
              {viewMode === "list" && (
                <>
                  {filteredMosques.length > 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
                    >
                      {filteredMosques.map((mosque, index) => (
                        <motion.div
                          key={mosque.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.05 + index * 0.03 }}
                          className={`group bg-gradient-to-br from-white to-white/95 rounded-2xl p-6 hover:shadow-xl hover:shadow-black/10 transition-all duration-300 cursor-pointer border border-transparent hover:border-gold/20 ${
                            selectedMosque?.id === mosque.id ? "ring-2 ring-gold shadow-lg shadow-gold/10" : ""
                          }`}
                          onClick={() => setSelectedMosque(mosque)}
                        >
                          {/* Decorative accent */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal to-teal/80 flex items-center justify-center text-white text-lg shadow-lg shadow-teal/20">
                              ☪
                            </div>
                            <span className="text-xs text-text-muted bg-gray-100 px-2.5 py-1 rounded-full">
                              {mosque.city}
                            </span>
                          </div>

                          <h3 className="font-display font-semibold text-lg text-text-primary mb-3 group-hover:text-teal transition-colors">
                            {mosque.name}
                          </h3>

                          <div className="flex items-start gap-2 text-text-muted text-sm mb-5">
                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-teal/60" />
                            <span className="leading-relaxed">{mosque.fullAddress}</span>
                          </div>

                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mosque.fullAddress)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal text-white text-sm rounded-full hover:bg-teal-dark transition-colors shadow-md shadow-teal/20"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Navigation className="w-4 h-4" />
                            Route plannen
                          </a>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    /* Enhanced empty state for list view */
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-b from-[#0a2020] to-[#0d2828] rounded-2xl flex flex-col items-center justify-center p-12"
                    >
                      <EmptyStateIllustration />
                      <h3 className="text-xl font-display font-semibold text-white mb-2">
                        Geen moskeeën gevonden
                      </h3>
                      <p className="text-white/50 text-center mb-6 max-w-sm">
                        Er zijn geen resultaten voor je zoekopdracht. Probeer een andere zoekterm.
                      </p>
                      <button
                        onClick={clearSearch}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-[#0f2d2d] rounded-full font-medium hover:bg-gold/90 transition-all"
                      >
                        <X className="w-4 h-4" />
                        Wis zoekopdracht
                      </button>
                    </motion.div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
