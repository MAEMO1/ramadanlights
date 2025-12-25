"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { IftarMap } from "@/components/IftarMap";
import { IftarCalendar } from "@/components/IftarCalendar";
import { IftarList } from "@/components/IftarList";
import { ArrowRight, Plus } from "lucide-react";
import Link from "next/link";
import type { IftarLocation } from "@/lib/iftar-types";

export default function IftarPage() {
  const [locations, setLocations] = useState<IftarLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
          <section className="bg-off-white section-padding">
            <div className="section-container">
              <div className="h-[500px] bg-gray-100 rounded-2xl flex items-center justify-center">
                <div className="text-text-muted">Locaties laden...</div>
              </div>
            </div>
          </section>
        ) : (
          <IftarMap locations={locations} />
        )}
      </div>

      {/* Calendar Section */}
      <div id="iftar-calendar">
        {!isLoading && <IftarCalendar locations={locations} />}
      </div>

      {/* List Section */}
      {!isLoading && <IftarList locations={locations} />}

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
