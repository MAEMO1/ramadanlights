"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MapPin, Navigation, Search, Map, ArrowRight } from "lucide-react";
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

      {/* Hero Section - Dark & Professional (like iftar page) */}
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
              href="#mosque-map"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full font-medium bg-white text-[#0f2d2d] hover:bg-white/90 transition-all"
            >
              Bekijk de kaart
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      <section id="mosque-map" className="bg-off-white section-padding">
        <div className="section-container">
          <div className="text-center mb-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="heading-section mb-4"
            >
              Moskeeën op de kaart
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-body"
            >
              Klik op een marker voor meer informatie
            </motion.p>
          </div>

          {isLoading ? (
            <div className="h-[500px] bg-gray-100 rounded-2xl flex items-center justify-center">
              <div className="text-text-muted">Kaart laden...</div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl overflow-hidden shadow-lg"
              style={{ height: "500px" }}
            >
              {mosquesWithCoords.length > 0 ? (
                <MosqueMapComponent
                  mosques={mosquesWithCoords}
                  onMosqueSelect={() => {}}
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <p className="text-text-muted">Geen moskeeën gevonden</p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* List Section */}
      <section id="mosque-list" className="bg-off-white section-padding">
        <div className="section-container">
          {/* Header */}
          <div className="text-center mb-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="heading-section mb-4"
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
              {mosques.length} moskee{mosques.length !== 1 ? "ën" : ""} in Gent
            </motion.p>
          </div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mb-8"
          >
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                placeholder="Zoek op naam of adres..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-12 w-full"
              />
            </div>
          </motion.div>

          {/* Results count */}
          {searchQuery && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-text-muted mb-6 text-center"
            >
              {filteredMosques.length} resultaten gevonden
            </motion.p>
          )}

          {/* Grid */}
          {filteredMosques.length === 0 && searchQuery ? (
            <div className="text-center py-12">
              <p className="text-text-muted text-lg">
                Geen moskeeën gevonden voor &ldquo;{searchQuery}&rdquo;
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 text-teal hover:underline"
              >
                Zoekfilter wissen
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMosques.map((mosque, index) => (
                <motion.div
                  key={mosque.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 + index * 0.03 }}
                  className="card hover:shadow-lg transition-shadow"
                >
                  {/* Header */}
                  <div className="mb-4">
                    <h3 className="font-display font-semibold text-lg text-text-primary mb-1">
                      {mosque.name}
                    </h3>
                    <div className="flex items-start gap-2 text-text-muted text-sm">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{mosque.fullAddress}</span>
                    </div>
                  </div>

                  {/* City badge */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-teal/10 text-teal text-sm font-medium rounded-full">
                      {mosque.city}
                    </span>
                  </div>

                  {/* Route button */}
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mosque.fullAddress)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal text-white text-sm font-medium rounded-full hover:bg-teal/90 transition-colors"
                  >
                    <Navigation className="w-4 h-4" />
                    Route plannen
                  </a>
                </motion.div>
              ))}
            </div>
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
