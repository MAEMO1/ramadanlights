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

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 bg-gradient-to-b from-[#0f2d2d] via-[#143838] to-[#1a4a4a] overflow-hidden">
        {/* Islamic geometric pattern background */}
        <div className="absolute inset-0 opacity-[0.07]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="islamicPattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M40 0L80 40L40 80L0 40Z" fill="none" stroke="#d4af37" strokeWidth="1"/>
                <circle cx="40" cy="40" r="15" fill="none" stroke="#d4af37" strokeWidth="1"/>
                <path d="M40 25L55 40L40 55L25 40Z" fill="none" stroke="#d4af37" strokeWidth="0.5"/>
                <circle cx="40" cy="0" r="5" fill="none" stroke="#d4af37" strokeWidth="0.5"/>
                <circle cx="0" cy="40" r="5" fill="none" stroke="#d4af37" strokeWidth="0.5"/>
                <circle cx="80" cy="40" r="5" fill="none" stroke="#d4af37" strokeWidth="0.5"/>
                <circle cx="40" cy="80" r="5" fill="none" stroke="#d4af37" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#islamicPattern)"/>
          </svg>
        </div>

        {/* Decorative crescent moon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="absolute top-20 right-[10%] text-gold pointer-events-none hidden lg:block"
        >
          <svg width="120" height="120" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50c8.5 0 16.5-2.1 23.5-5.9C60.3 85.5 52 71.1 52 55c0-16.1 8.3-30.5 21.5-39.1C66.5 2.1 58.5 0 50 0z"/>
          </svg>
        </motion.div>

        {/* Floating star decorations */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute top-32 left-[15%] text-gold hidden md:block"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12,0 15,9 24,9 17,14.5 19.5,24 12,18 4.5,24 7,14.5 0,9 9,9"/>
          </svg>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="absolute bottom-32 left-[8%] text-gold hidden md:block"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12,0 15,9 24,9 17,14.5 19.5,24 12,18 4.5,24 7,14.5 0,9 9,9"/>
          </svg>
        </motion.div>

        <div className="relative z-10 section-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge with crescent */}
            <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold/20 text-gold rounded-full text-sm font-medium mb-8 backdrop-blur-sm border border-gold/30">
              <span className="text-lg">☪</span>
              Ramadan 2026
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
              Iftarkaart{" "}
              <span className="text-gold relative">
                Gent
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="absolute -bottom-1 left-0 h-1 bg-gold/40 rounded-full"
                />
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10">
              Vind iftar locaties in Gent en omgeving. Moskeeën en organisaties
              kunnen hun iftar toevoegen aan de kaart.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="#iftar-map" className="btn-primary group">
                Bekijk de kaart
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#iftar-calendar"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full font-medium border-2 border-gold/50 text-gold hover:bg-gold/10 hover:border-gold transition-all"
              >
                Kalender
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

        {/* Bottom decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60V30C240 50 480 10 720 30C960 50 1200 10 1440 30V60H0Z" fill="#0f2d2d"/>
          </svg>
        </div>
      </section>

      {/* Map Section */}
      <div id="iftar-map">
        {isLoading ? (
          <section className="bg-[#0f2d2d] section-padding">
            <div className="section-container">
              <div className="h-[500px] bg-[#0a2020] rounded-2xl flex items-center justify-center">
                <div className="text-white/50">Locaties laden...</div>
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
      <section className="relative bg-gradient-to-b from-[#0f2d2d] to-[#1a4a4a] section-padding overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.05]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="ctaPattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="20" fill="none" stroke="#d4af37" strokeWidth="0.5"/>
                <circle cx="30" cy="30" r="10" fill="none" stroke="#d4af37" strokeWidth="0.5"/>
                <path d="M30 10L30 50M10 30L50 30" stroke="#d4af37" strokeWidth="0.3"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#ctaPattern)"/>
          </svg>
        </div>

        {/* Decorative crescent */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.1 }}
          viewport={{ once: true }}
          className="absolute -right-12 top-1/2 -translate-y-1/2 text-gold pointer-events-none"
        >
          <svg width="200" height="200" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50c8.5 0 16.5-2.1 23.5-5.9C60.3 85.5 52 71.1 52 55c0-16.1 8.3-30.5 21.5-39.1C66.5 2.1 58.5 0 50 0z"/>
          </svg>
        </motion.div>

        <div className="section-container text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gold/20 text-gold rounded-full text-sm font-medium mb-6 border border-gold/30">
              <span>☪</span>
              Deel de barakah
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Organiseert u een iftar?
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
              Voeg uw iftar toe aan de Iftarkaart zodat iedereen uw locatie kan vinden.
            </p>
            <Link
              href="/iftar/toevoegen"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full font-medium bg-gold text-[#0f2d2d] hover:bg-gold/90 transition-all group"
            >
              <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
              Iftar toevoegen
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
