"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MapPin, List, Map, Navigation, Search } from "lucide-react";
import dynamic from "next/dynamic";

const MosqueMapComponent = dynamic(() => import("@/components/MosqueMapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-[#0a2020] rounded-2xl flex items-center justify-center">
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

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-[#0f2d2d] to-[#1a4a4a] overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative z-10 section-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="badge mb-6 inline-block">Moskeeën</span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
              Moskeeën in{" "}
              <span className="text-gold">Gent</span>
            </h1>

            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8">
              Vind alle moskeeën en islamitische centra in Gent en omgeving.
            </p>

            {/* Stats */}
            <div className="flex justify-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-gold">{mosques.length}</div>
                <div className="text-sm text-white/60">Moskeeën</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-[#0f2d2d] section-padding">
        <div className="section-container">
          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6"
          >
            {/* Search */}
            <div className="relative w-full sm:w-auto sm:min-w-[300px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Zoek moskee..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder:text-white/40 focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20"
              />
            </div>

            {/* View toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("map")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  viewMode === "map"
                    ? "bg-gold text-[#0f2d2d]"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                <Map className="w-4 h-4" />
                Kaart
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  viewMode === "list"
                    ? "bg-gold text-[#0f2d2d]"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                <List className="w-4 h-4" />
                Lijst
              </button>
            </div>
          </motion.div>

          {/* Results count */}
          <div className="text-white/60 text-sm mb-4">
            {filteredMosques.length} moskee{filteredMosques.length !== 1 ? "ën" : ""} gevonden
          </div>

          {isLoading ? (
            <div className="h-[500px] bg-[#0a2020] rounded-2xl flex items-center justify-center">
              <div className="text-white/50">Moskeeën laden...</div>
            </div>
          ) : (
            <>
              {/* Map View */}
              {viewMode === "map" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="rounded-2xl overflow-hidden shadow-2xl"
                  style={{ height: "500px" }}
                >
                  {mosquesWithCoords.length > 0 ? (
                    <MosqueMapComponent
                      mosques={mosquesWithCoords}
                      selectedMosqueId={selectedMosque?.id}
                      onMosqueSelect={setSelectedMosque}
                    />
                  ) : (
                    <div className="w-full h-full bg-[#0a2020] flex items-center justify-center">
                      <p className="text-white/60">Geen moskeeën gevonden</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* List View */}
              {viewMode === "list" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {filteredMosques.map((mosque, index) => (
                    <motion.div
                      key={mosque.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.03 }}
                      className={`bg-white rounded-2xl p-5 hover:shadow-lg transition-all cursor-pointer ${
                        selectedMosque?.id === mosque.id ? "ring-2 ring-gold" : ""
                      }`}
                      onClick={() => setSelectedMosque(mosque)}
                    >
                      <h3 className="font-display font-semibold text-lg text-text-primary mb-2">
                        {mosque.name}
                      </h3>
                      <div className="flex items-start gap-2 text-text-muted text-sm mb-4">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-teal" />
                        <span>{mosque.fullAddress}</span>
                      </div>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mosque.fullAddress)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-teal text-white text-sm rounded-full hover:bg-teal/90 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Navigation className="w-4 h-4" />
                        Route plannen
                      </a>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>

      {/* List Section (always shown below map) */}
      {viewMode === "map" && !isLoading && (
        <section className="bg-white section-padding">
          <div className="section-container">
            <div className="text-center mb-10">
              <h2 className="heading-section mb-4">Alle moskeeën</h2>
              <p className="text-body">
                Overzicht van alle {mosques.length} moskeeën in Gent
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMosques.map((mosque, index) => (
                <motion.div
                  key={mosque.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.03 }}
                  className="card hover:shadow-lg transition-shadow"
                >
                  <h3 className="font-display font-semibold text-lg text-text-primary mb-2">
                    {mosque.name}
                  </h3>
                  <div className="flex items-start gap-2 text-text-muted text-sm mb-4">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-teal" />
                    <span>{mosque.fullAddress}</span>
                  </div>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mosque.fullAddress)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-teal text-white text-sm rounded-full hover:bg-teal/90 transition-colors"
                  >
                    <Navigation className="w-4 h-4" />
                    Route plannen
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
