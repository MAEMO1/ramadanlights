"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ShopPartnerForm } from "@/components/ShopPartnerForm";
import { Store, Check } from "lucide-react";

export default function ShopPartnerAanmeldenPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-[#0f2d2d]">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal/20 mb-6">
              <Store className="w-8 h-8 text-teal" />
            </div>

            <h1 className="text-4xl md:text-5xl font-display font-semibold text-white mb-6 tracking-tight">
              Word Shop Partner
            </h1>

            <p className="text-xl text-white/70 mb-8 leading-relaxed">
              Meld uw winkel aan voor de Ramadan Lights Gent shop gids en bereik
              duizenden bezoekers tijdens de Ramadan.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal" />
                Gratis basisvermelding
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal" />
                Ramadan acties highlighten
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal" />
                Lokale zichtbaarheid
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 bg-background">
        <div className="section-container">
          <ShopPartnerForm />
        </div>
      </section>

      <Footer />
    </main>
  );
}
