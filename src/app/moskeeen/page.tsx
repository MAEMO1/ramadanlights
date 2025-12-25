"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MapPin, Navigation, Search, Map, List, ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";

const MosqueMapComponent = dynamic(() => import("@/components/MosqueMapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 rounded-2xl flex items-center justify-center">
      <div className="text-text-muted">Kaart laden...</div>
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
      <section className="pt-32 pb-24 bg-[#0f2d2d]">
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
          {/* Header with title and controls */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="heading-section mb-2"
              >
                Alle moskeeën
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-body"
              >
                {filteredMosques.length} moskee{filteredMosques.length !== 1 ? "ën" : ""}
                {searchQuery && ` gevonden voor "${searchQuery}"`}
              </motion.p>
            </div>

            {/* Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="text"
                  placeholder="Zoeken..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-12 w-full sm:w-64"
                />
              </div>

              {/* View Toggle */}
              <div className="flex rounded-xl overflow-hidden border border-gray-200 bg-white">
                <button
                  onClick={() => setViewMode("map")}
                  className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all ${
                    viewMode === "map"
                      ? "bg-teal text-white"
                      : "bg-white text-text-secondary hover:bg-gray-50"
                  }`}
                >
                  <Map className="w-4 h-4" />
                  Kaart
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all border-l border-gray-200 ${
                    viewMode === "list"
                      ? "bg-teal text-white"
                      : "bg-white text-text-secondary hover:bg-gray-50"
                  }`}
                >
                  <List className="w-4 h-4" />
                  Lijst
                </button>
              </div>
            </motion.div>
          </div>

          {isLoading ? (
            <div className="h-[500px] bg-white rounded-2xl flex items-center justify-center shadow-sm">
              <div className="text-text-muted">Locaties laden...</div>
            </div>
          ) : (
            <>
              {/* Map View */}
              {viewMode === "map" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl overflow-hidden shadow-lg"
                  style={{ height: "600px" }}
                >
                  {mosquesWithCoords.length > 0 ? (
                    <MosqueMapComponent
                      mosques={mosquesWithCoords}
                      selectedMosqueId={selectedMosque?.id}
                      onMosqueSelect={setSelectedMosque}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center">
                      <p className="text-text-muted mb-4">Geen moskeeën gevonden</p>
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="text-teal hover:underline text-sm"
                        >
                          Zoekfilter wissen
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {/* List View */}
              {viewMode === "list" && (
                <>
                  {filteredMosques.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm py-16 text-center">
                      <p className="text-text-muted text-lg mb-4">
                        Geen moskeeën gevonden{searchQuery && ` voor "${searchQuery}"`}
                      </p>
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="text-teal hover:underline"
                        >
                          Zoekfilter wissen
                        </button>
                      )}
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                      {filteredMosques.map((mosque, index) => (
                        <motion.div
                          key={mosque.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className={`card hover:shadow-lg transition-all cursor-pointer ${
                            selectedMosque?.id === mosque.id ? "ring-2 ring-teal" : ""
                          }`}
                          onClick={() => setSelectedMosque(mosque)}
                        >
                          <div className="mb-4">
                            <h3 className="font-display font-semibold text-lg text-text-primary mb-1">
                              {mosque.name}
                            </h3>
                            <div className="flex items-start gap-2 text-text-muted text-sm">
                              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              <span>{mosque.fullAddress}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="px-3 py-1 bg-teal/10 text-teal text-sm font-medium rounded-full">
                              {mosque.city}
                            </span>

                            <a
                              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mosque.fullAddress)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-teal text-sm font-medium hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Navigation className="w-4 h-4" />
                              Route
                            </a>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </>
              )}
            </>
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
