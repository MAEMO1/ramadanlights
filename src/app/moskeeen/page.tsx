"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MapPin, Navigation, Search, Map, LayoutGrid, ArrowRight, X } from "lucide-react";
import dynamic from "next/dynamic";

const MosqueMapComponent = dynamic(() => import("@/components/MosqueMapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-50 flex items-center justify-center">
      <div className="flex items-center gap-3 text-text-muted">
        <div className="w-5 h-5 border-2 border-teal/30 border-t-teal rounded-full animate-spin" />
        <span>Kaart laden...</span>
      </div>
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
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [selectedMosque, setSelectedMosque] = useState<Mosque | null>(null);

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

  const filteredMosques = useMemo(() => {
    if (!searchQuery.trim()) return mosques;
    const query = searchQuery.toLowerCase();
    return mosques.filter(
      (mosque) =>
        mosque.name.toLowerCase().includes(query) ||
        mosque.fullAddress.toLowerCase().includes(query)
    );
  }, [mosques, searchQuery]);

  const mosquesWithCoords = filteredMosques.filter((m) => m.latitude && m.longitude);

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-[#0f2d2d]">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <p className="text-teal-400 font-medium mb-4 tracking-wide uppercase text-sm">
              Gent
            </p>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-white mb-6 tracking-tight">
              Moskeeën
            </h1>

            <p className="text-xl text-white/70 mb-10 leading-relaxed max-w-2xl">
              Vind alle {mosques.length > 0 ? mosques.length : ""} moskeeën en islamitische centra in Gent en omgeving.
            </p>

            <a
              href="#mosques-content"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full font-medium bg-white text-[#0f2d2d] hover:bg-white/90 transition-all"
            >
              Bekijk locaties
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Main Content Section */}
      <section id="mosques-content" className="bg-off-white section-padding">
        <div className="section-container">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            {/* Title row */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="heading-section">Alle moskeeën</h2>
                <p className="text-text-muted mt-1">
                  {isLoading ? "Laden..." : `${filteredMosques.length} locatie${filteredMosques.length !== 1 ? "s" : ""}`}
                  {searchQuery && !isLoading && (
                    <span className="text-text-muted/70"> voor &ldquo;{searchQuery}&rdquo;</span>
                  )}
                </p>
              </div>

              {/* Segmented Control - Apple style */}
              <div className="inline-flex p-1 bg-gray-100 rounded-lg">
                <button
                  onClick={() => setViewMode("map")}
                  className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    viewMode === "map"
                      ? "text-text-primary"
                      : "text-text-muted hover:text-text-secondary"
                  }`}
                >
                  {viewMode === "map" && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-white rounded-md shadow-sm"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                    />
                  )}
                  <Map className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">Kaart</span>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    viewMode === "list"
                      ? "text-text-primary"
                      : "text-text-muted hover:text-text-secondary"
                  }`}
                >
                  {viewMode === "list" && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-white rounded-md shadow-sm"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                    />
                  )}
                  <LayoutGrid className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">Lijst</span>
                </button>
              </div>
            </div>

            {/* Search bar */}
            <div className="relative max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Zoek moskee..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal/30 transition-all"
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
          </motion.div>

          {/* Content */}
          {isLoading ? (
            <div className="h-[500px] bg-white rounded-2xl border border-gray-100 flex items-center justify-center">
              <div className="flex items-center gap-3 text-text-muted">
                <div className="w-5 h-5 border-2 border-teal/30 border-t-teal rounded-full animate-spin" />
                <span>Locaties laden...</span>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {/* Map View */}
              {viewMode === "map" && (
                <motion.div
                  key="map"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
                  style={{ height: "600px" }}
                >
                  {mosquesWithCoords.length > 0 ? (
                    <MosqueMapComponent
                      mosques={mosquesWithCoords}
                      selectedMosqueId={selectedMosque?.id}
                      onMosqueSelect={setSelectedMosque}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center">
                      <p className="text-text-muted mb-3">Geen moskeeën gevonden</p>
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="text-teal text-sm hover:underline"
                        >
                          Zoekopdracht wissen
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {/* List View */}
              {viewMode === "list" && (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {filteredMosques.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
                      <p className="text-text-muted mb-3">
                        Geen moskeeën gevonden
                      </p>
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="text-teal text-sm hover:underline"
                        >
                          Zoekopdracht wissen
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {filteredMosques.map((mosque, index) => (
                        <motion.article
                          key={mosque.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className={`group bg-white rounded-2xl border border-gray-100 p-6 hover:border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer ${
                            selectedMosque?.id === mosque.id ? "ring-2 ring-teal border-transparent" : ""
                          }`}
                          onClick={() => setSelectedMosque(mosque)}
                        >
                          {/* Name & Address */}
                          <h3 className="font-display font-semibold text-text-primary mb-2 group-hover:text-teal transition-colors">
                            {mosque.name}
                          </h3>
                          <p className="flex items-start gap-2 text-text-muted text-sm mb-5">
                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-text-muted/50" />
                            <span>{mosque.fullAddress}</span>
                          </p>

                          {/* Footer */}
                          <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                            <span className="text-xs font-medium text-teal bg-teal/8 px-2.5 py-1 rounded-full">
                              {mosque.city}
                            </span>
                            <a
                              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mosque.fullAddress)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-teal transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Navigation className="w-3.5 h-3.5" />
                              Route
                            </a>
                          </div>
                        </motion.article>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#0f2d2d] section-padding">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-white mb-4">
              Op zoek naar een iftar?
            </h2>
            <p className="text-lg text-white/70 mb-8">
              Bekijk de iftarkaart om iftar locaties in Gent te vinden.
            </p>
            <a
              href="/iftar"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full font-medium bg-white text-[#0f2d2d] hover:bg-white/90 transition-all"
            >
              <Map className="w-5 h-5 mr-2" />
              Naar de iftarkaart
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
