"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { IftarMap } from "@/components/IftarMap";
import { IftarList } from "@/components/IftarList";
import { IftarForm } from "@/components/IftarForm";
import { ArrowRight } from "lucide-react";
import type { IftarLocation } from "@/components/IftarMapComponent";

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
            <span className="badge mb-6 inline-block">Ramadan 2026</span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
              Iftarkaart{" "}
              <span className="text-gold">Gent</span>
            </h1>

            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10">
              Vind iftar locaties in Gent en omgeving. Moskeeën en organisaties
              kunnen hun iftar toevoegen aan de kaart.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="#iftar-map" className="btn-primary">
                Bekijk de kaart
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
              <a
                href="#iftar-form"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full font-medium border-2 border-white/30 text-white hover:bg-white/10 transition-all"
              >
                Iftar toevoegen
              </a>
            </div>
          </motion.div>
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

      {/* List Section */}
      {!isLoading && <IftarList locations={locations} />}

      {/* Form Section */}
      <IftarForm />

      <Footer />
    </main>
  );
}
