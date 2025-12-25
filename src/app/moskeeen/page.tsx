"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MapPin, Grid3X3, Map, Navigation, Search, X } from "lucide-react";
import dynamic from "next/dynamic";

const MosqueMapComponent = dynamic(() => import("@/components/MosqueMapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
      <div className="text-gray-400">Kaart laden...</div>
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

      {/* Hero - Clean & Editorial */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-16 bg-white border-b border-gray-100">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <p className="text-teal font-medium mb-3 tracking-wide text-sm uppercase">
              Gent
            </p>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4 tracking-tight">
              Moskeeën
            </h1>
            <p className="text-xl text-gray-500 leading-relaxed">
              Alle {mosques.length > 0 ? mosques.length : ""} moskeeën en islamitische centra in Gent.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Toolbar */}
      <section className="sticky top-[72px] z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="section-container">
          <div className="flex items-center justify-between gap-4 py-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Zoeken..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border-0 rounded-lg text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal/20 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* View toggle */}
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("map")}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-sm transition-colors ${
                  viewMode === "map"
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Map className="w-4 h-4" />
                <span className="hidden sm:inline">Kaart</span>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-sm transition-colors border-l border-gray-200 ${
                  viewMode === "list"
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
                <span className="hidden sm:inline">Lijst</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Results info */}
      {searchQuery && (
        <div className="section-container pt-6">
          <p className="text-sm text-gray-500">
            {filteredMosques.length} resultaten voor &ldquo;{searchQuery}&rdquo;
          </p>
        </div>
      )}

      {/* Main Content */}
      <section className="py-6 md:py-8">
        <div className="section-container">
          {isLoading ? (
            <div className="h-[500px] bg-gray-50 rounded-xl flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Map View */}
              {viewMode === "map" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-xl overflow-hidden bg-gray-100"
                  style={{ height: "calc(100vh - 280px)", minHeight: "500px", maxHeight: "700px" }}
                >
                  {mosquesWithCoords.length > 0 ? (
                    <MosqueMapComponent
                      mosques={mosquesWithCoords}
                      selectedMosqueId={selectedMosque?.id}
                      onMosqueSelect={setSelectedMosque}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <p className="text-gray-500 mb-4">Geen moskeeën gevonden</p>
                      <button
                        onClick={clearSearch}
                        className="text-teal hover:underline text-sm"
                      >
                        Zoekopdracht wissen
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
                      className="divide-y divide-gray-100"
                    >
                      {filteredMosques.map((mosque, index) => (
                        <motion.article
                          key={mosque.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.02 }}
                          className={`group py-5 first:pt-0 last:pb-0 cursor-pointer ${
                            selectedMosque?.id === mosque.id ? "bg-teal/5 -mx-4 px-4 rounded-lg" : ""
                          }`}
                          onClick={() => setSelectedMosque(mosque)}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 group-hover:text-teal transition-colors truncate">
                                {mosque.name}
                              </h3>
                              <p className="text-gray-500 text-sm mt-1 flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                                <span className="truncate">{mosque.fullAddress}</span>
                              </p>
                            </div>
                            <a
                              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mosque.fullAddress)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-shrink-0 flex items-center gap-1.5 text-sm text-gray-400 hover:text-teal transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Navigation className="w-4 h-4" />
                              <span className="hidden md:inline">Route</span>
                            </a>
                          </div>
                        </motion.article>
                      ))}
                    </motion.div>
                  ) : (
                    <div className="py-16 text-center">
                      <p className="text-gray-500 mb-4">Geen moskeeën gevonden</p>
                      <button
                        onClick={clearSearch}
                        className="text-teal hover:underline text-sm"
                      >
                        Zoekopdracht wissen
                      </button>
                    </div>
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
