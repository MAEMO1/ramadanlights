"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { IftarMap } from "@/components/IftarMap";
import { IftarCalendar } from "@/components/IftarCalendar";
import { IftarList } from "@/components/IftarList";
import { ArrowRight, Plus, Calendar, LayoutGrid } from "lucide-react";
import Link from "next/link";
import type { IftarLocation } from "@/lib/iftar-types";
import { mosques } from "@/lib/mosques-data";

export default function IftarPage() {
  const [locations, setLocations] = useState<IftarLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [contentView, setContentView] = useState<"calendar" | "list">("calendar");

  // Create a set of mosque addresses for quick lookup
  const mosqueAddresses = new Set(
    mosques.map(m => `${m.address} ${m.houseNumber}`.toLowerCase())
  );

  useEffect(() => {
    async function fetchLocations() {
      try {
        const response = await fetch("/api/iftar/list");
        const data = await response.json();
        if (data.success) {
          setLocations(data.data);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLocations();
  }, []);

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section - Dark & Professional */}
      <section className="pt-32 pb-24 bg-[#0f2d2d]">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <p className="text-teal-400 font-medium mb-4 tracking-wide uppercase text-sm">Ramadan 2026</p>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-white mb-6 tracking-tight">
              Iftarkaart Gent
            </h1>

            <p className="text-xl text-white/70 mb-10 leading-relaxed max-w-2xl">
              Vind iftar locaties in Gent en omgeving. Moskeeën en organisaties kunnen hun iftar toevoegen aan de kaart.
            </p>

            <div className="flex flex-wrap gap-4">
              <a href="#iftar-map" className="inline-flex items-center justify-center px-8 py-4 rounded-full font-medium bg-white text-[#0f2d2d] hover:bg-white/90 transition-all">
                Bekijk de kaart
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
              <Link
                href="/iftar/toevoegen"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full font-medium border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all"
              >
                <Plus className="w-4 h-4 mr-2" />
                Iftar toevoegen
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      <div id="iftar-map">
        {isLoading ? (
          <section className="bg-[#0f2d2d] section-padding">
            <div className="section-container">
              <div className="h-[600px] bg-[#1d3d3d] rounded-2xl flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 border-2 border-teal-500/30 border-t-teal-500 rounded-full animate-spin mb-4" />
                  <div className="text-white/50">Locaties laden...</div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <IftarMap locations={locations} />
        )}
      </div>

      {/* Calendar / List Section with Toggle */}
      <div id="iftar-content">
        {!isLoading && (
          <section className="bg-[#f8fafa] section-padding">
            <div className="section-container">
              {/* Header with toggle */}
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
                <div>
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl md:text-3xl font-display font-semibold text-text-primary"
                  >
                    {contentView === "calendar" ? "Iftar planning" : "Alle iftar locaties"}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-text-muted mt-1"
                  >
                    {contentView === "calendar"
                      ? "Bekijk welke iftars beschikbaar zijn per dag"
                      : `${locations.length} iftar${locations.length !== 1 ? "s" : ""} beschikbaar`
                    }
                  </motion.p>
                </div>

                {/* Segmented Control */}
                <div className="inline-flex p-1 bg-gray-100 rounded-lg">
                  <button
                    onClick={() => setContentView("calendar")}
                    className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      contentView === "calendar"
                        ? "text-white"
                        : "text-text-muted hover:text-text-secondary"
                    }`}
                  >
                    {contentView === "calendar" && (
                      <motion.div
                        layoutId="contentTab"
                        className="absolute inset-0 bg-teal rounded-md"
                        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                      />
                    )}
                    <Calendar className="w-4 h-4 relative z-10" />
                    <span className="relative z-10">Kalender</span>
                  </button>
                  <button
                    onClick={() => setContentView("list")}
                    className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      contentView === "list"
                        ? "text-white"
                        : "text-text-muted hover:text-text-secondary"
                    }`}
                  >
                    {contentView === "list" && (
                      <motion.div
                        layoutId="contentTab"
                        className="absolute inset-0 bg-teal rounded-md"
                        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                      />
                    )}
                    <LayoutGrid className="w-4 h-4 relative z-10" />
                    <span className="relative z-10">Lijst</span>
                  </button>
                </div>
              </div>

              {/* Content */}
              <AnimatePresence mode="wait">
                {contentView === "calendar" && (
                  <motion.div
                    key="calendar"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <IftarCalendar locations={locations} embedded />
                  </motion.div>
                )}
                {contentView === "list" && (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <IftarList locations={locations} mosqueAddresses={mosqueAddresses} embedded />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>
        )}
      </div>

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
              Organiseert u een iftar?
            </h2>
            <p className="text-lg text-white/70 mb-8">
              Voeg uw iftar toe aan de Iftarkaart zodat iedereen uw locatie kan vinden.
            </p>
            <Link
              href="/iftar/toevoegen"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full font-medium bg-white text-[#0f2d2d] hover:bg-white/90 transition-all"
            >
              <Plus className="w-5 h-5 mr-2" />
              Iftar toevoegen
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
