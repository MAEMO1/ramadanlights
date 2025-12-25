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
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Clean Professional Hero */}
      <section className="relative pt-32 pb-16 md:pb-20 bg-gradient-to-b from-[#0f2d2d] to-[#1a4a4a]">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            {/* Breadcrumb style label */}
            <div className="flex items-center gap-2 text-white/50 text-sm mb-6">
              <span>Ramadan Lights Gent</span>
              <span>/</span>
              <span className="text-white/80">Moskeeën</span>
            </div>

            {/* Main heading - clean typography */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4 tracking-tight">
              Moskeeën in Gent
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-white/70 max-w-xl leading-relaxed mb-8">
              Vind alle {mosques.length > 0 ? mosques.length : ""} moskeeën en islamitische centra in Gent en omgeving.
            </p>

            {/* Search integrated in hero */}
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Zoek op naam of adres..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:bg-white/15 focus:border-white/30 transition-all"
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
          </motion.div>
        </div>
      </section>

      {/* Main Content - White background for professionalism */}
      <section className="py-8 md:py-12 bg-white">
        <div className="section-container">
          {/* Controls bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-gray-100"
          >
            {/* Results count */}
            <div className="text-text-secondary text-sm">
              <span className="font-medium text-text-primary">{filteredMosques.length}</span>
              {" "}moskee{filteredMosques.length !== 1 ? "ën" : ""} gevonden
              {searchQuery && (
                <span className="text-text-muted">
                  {" "}voor &ldquo;{searchQuery}&rdquo;
                </span>
              )}
            </div>

            {/* View toggle */}
            <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
              <button
                onClick={() => setViewMode("map")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === "map"
                    ? "bg-white text-text-primary shadow-sm"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                <Map className="w-4 h-4" />
                Kaart
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === "list"
                    ? "bg-white text-text-primary shadow-sm"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                <List className="w-4 h-4" />
                Lijst
              </button>
            </div>
          </motion.div>

          {isLoading ? (
            <div className="h-[600px] bg-gray-50 rounded-2xl flex items-center justify-center">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 border-2 border-teal/30 border-t-teal rounded-full animate-spin mb-4" />
                <div className="text-text-muted">Moskeeën laden...</div>
              </div>
            </div>
          ) : (
            <>
              {/* Map View */}
              {viewMode === "map" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm"
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
                      <Building2 className="w-16 h-16 text-gray-300 mb-4" />
                      <h3 className="text-lg font-semibold text-text-primary mb-2">
                        Geen moskeeën gevonden
                      </h3>
                      <p className="text-text-muted text-center mb-6 max-w-sm">
                        Er zijn geen resultaten voor je zoekopdracht.
                      </p>
                      <button
                        onClick={clearSearch}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal text-white rounded-lg font-medium hover:bg-teal-dark transition-all"
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
                          className={`group bg-white border border-gray-200 rounded-xl p-5 hover:border-teal/30 hover:shadow-md transition-all duration-200 cursor-pointer ${
                            selectedMosque?.id === mosque.id ? "border-teal ring-1 ring-teal/20" : ""
                          }`}
                          onClick={() => setSelectedMosque(mosque)}
                        >
                          <h3 className="font-semibold text-text-primary mb-2 group-hover:text-teal transition-colors">
                            {mosque.name}
                          </h3>

                          <div className="flex items-start gap-2 text-text-muted text-sm mb-4">
                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{mosque.fullAddress}</span>
                          </div>

                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mosque.fullAddress)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-teal text-sm font-medium hover:text-teal-dark transition-colors"
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
                      className="bg-gray-50 rounded-2xl flex flex-col items-center justify-center py-16 px-8"
                    >
                      <Building2 className="w-16 h-16 text-gray-300 mb-4" />
                      <h3 className="text-lg font-semibold text-text-primary mb-2">
                        Geen moskeeën gevonden
                      </h3>
                      <p className="text-text-muted text-center mb-6 max-w-sm">
                        Er zijn geen resultaten voor je zoekopdracht.
                      </p>
                      <button
                        onClick={clearSearch}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal text-white rounded-lg font-medium hover:bg-teal-dark transition-all"
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
