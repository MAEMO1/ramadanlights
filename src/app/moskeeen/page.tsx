"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MapPin, List, Map, Navigation, Search, X, Building2 } from "lucide-react";
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

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <Navbar />

      {/* Hero Section - Refined & Professional */}
      <section className="relative pt-28 pb-20 md:pt-32 md:pb-24 overflow-hidden">
        {/* Gradient background with subtle depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f2d2d] via-[#143939] to-[#1a4a4a]" />

        {/* Subtle geometric accent - top right */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.03]">
          <svg viewBox="0 0 400 400" className="w-full h-full" preserveAspectRatio="xMaxYMin slice">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1.5" fill="white"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Gradient orb for visual interest */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-teal/20 rounded-full blur-3xl opacity-40" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-gold/10 rounded-full blur-3xl opacity-50" />

        <div className="relative z-10 section-container">
          <div className="max-w-4xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full text-white/80 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-light" />
                Gebedshuizen in Gent
              </span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-5 tracking-tight leading-[1.1]"
            >
              Ontdek alle moskeeën
              <span className="block text-teal-light">in Gent</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-white/60 max-w-lg leading-relaxed mb-10"
            >
              Vind {mosques.length > 0 ? `alle ${mosques.length}` : "alle"} moskeeën en islamitische centra.
              Plan je bezoek en navigeer eenvoudig.
            </motion.p>

            {/* Search bar - prominent */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative max-w-xl"
            >
              <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-2xl" />
              <div className="relative flex items-center">
                <Search className="absolute left-5 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  placeholder="Zoek op naam of adres..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-14 py-4.5 bg-transparent border border-white/20 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:border-teal-light/50 focus:ring-1 focus:ring-teal-light/20 transition-all text-base"
                  style={{ paddingTop: '18px', paddingBottom: '18px' }}
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-5 w-7 h-7 flex items-center justify-center rounded-full bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-10 md:py-14">
        <div className="section-container">
          {/* Controls bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
          >
            {/* Results count */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-teal" />
              </div>
              <div>
                <div className="text-text-primary font-medium">
                  {filteredMosques.length} moskee{filteredMosques.length !== 1 ? "ën" : ""}
                </div>
                <div className="text-text-muted text-sm">
                  {searchQuery ? (
                    <>gevonden voor &ldquo;{searchQuery}&rdquo;</>
                  ) : (
                    "in Gent en omgeving"
                  )}
                </div>
              </div>
            </div>

            {/* View toggle */}
            <div className="flex gap-1 p-1.5 bg-white border border-gray-200 rounded-xl shadow-sm">
              <button
                onClick={() => setViewMode("map")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  viewMode === "map"
                    ? "bg-teal text-white shadow-sm"
                    : "text-text-muted hover:text-text-primary hover:bg-gray-50"
                }`}
              >
                <Map className="w-4 h-4" />
                Kaart
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  viewMode === "list"
                    ? "bg-teal text-white shadow-sm"
                    : "text-text-muted hover:text-text-primary hover:bg-gray-50"
                }`}
              >
                <List className="w-4 h-4" />
                Lijst
              </button>
            </div>
          </motion.div>

          {isLoading ? (
            <div className="h-[600px] bg-white rounded-2xl border border-gray-200 shadow-sm flex items-center justify-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-2 border-teal/20 border-t-teal rounded-full animate-spin mb-4" />
                <div className="text-text-muted">Moskeeën laden...</div>
              </div>
            </div>
          ) : (
            <>
              {/* Map View */}
              {viewMode === "map" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white"
                  style={{ height: "clamp(500px, 65vh, 700px)" }}
                >
                  {mosquesWithCoords.length > 0 ? (
                    <MosqueMapComponent
                      mosques={mosquesWithCoords}
                      selectedMosqueId={selectedMosque?.id}
                      onMosqueSelect={setSelectedMosque}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center p-8">
                      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                        <Building2 className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-text-primary mb-2">
                        Geen moskeeën gevonden
                      </h3>
                      <p className="text-text-muted text-center mb-6 max-w-sm">
                        Er zijn geen resultaten voor je zoekopdracht.
                      </p>
                      <button
                        onClick={clearSearch}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal text-white rounded-xl font-medium hover:bg-teal-dark transition-all shadow-sm"
                      >
                        Wis zoekopdracht
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* List View */}
              {viewMode === "list" && (
                <>
                  {filteredMosques.length > 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.15 }}
                      className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                      {filteredMosques.map((mosque, index) => (
                        <motion.div
                          key={mosque.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.05 + index * 0.02 }}
                          className={`group bg-white border border-gray-200 rounded-2xl p-6 hover:border-teal/30 hover:shadow-lg hover:shadow-teal/5 transition-all duration-300 cursor-pointer ${
                            selectedMosque?.id === mosque.id ? "border-teal ring-2 ring-teal/10" : ""
                          }`}
                          onClick={() => setSelectedMosque(mosque)}
                        >
                          {/* Icon header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal to-teal-dark flex items-center justify-center shadow-lg shadow-teal/20">
                              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zm1 14h-2v-1h2v1zm0-2h-2v-1h2v1zm1.5-3h-5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h5c.28 0 .5.22.5.5s-.22.5-.5.5z"/>
                              </svg>
                            </div>
                            <span className="text-xs font-medium text-teal bg-teal/10 px-2.5 py-1 rounded-full">
                              {mosque.city}
                            </span>
                          </div>

                          <h3 className="font-semibold text-text-primary text-lg mb-2 group-hover:text-teal transition-colors leading-tight">
                            {mosque.name}
                          </h3>

                          <div className="flex items-start gap-2 text-text-muted text-sm mb-5">
                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-text-muted/60" />
                            <span className="leading-relaxed">{mosque.fullAddress}</span>
                          </div>

                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mosque.fullAddress)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-text-primary text-sm font-medium rounded-xl hover:bg-teal hover:text-white transition-all group/btn"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Navigation className="w-4 h-4" />
                            Route plannen
                          </a>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-white border border-gray-200 rounded-2xl flex flex-col items-center justify-center py-20 px-8"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                        <Building2 className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-text-primary mb-2">
                        Geen moskeeën gevonden
                      </h3>
                      <p className="text-text-muted text-center mb-6 max-w-sm">
                        Er zijn geen resultaten voor je zoekopdracht.
                      </p>
                      <button
                        onClick={clearSearch}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal text-white rounded-xl font-medium hover:bg-teal-dark transition-all shadow-sm"
                      >
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
