"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FoodPartnerForm } from "@/components/FoodPartnerForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function FoodPartnerAanmeldenPage() {
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
            className="max-w-3xl"
          >
            <Link
              href="/word-food-partner"
              className="inline-flex items-center text-white/70 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Terug naar overzicht
            </Link>

            <h1 className="text-4xl md:text-5xl font-display font-semibold text-white mb-6 tracking-tight">
              Food Partner aanmelden
            </h1>

            <p className="text-xl text-white/70 leading-relaxed max-w-2xl">
              Vul het formulier in om uw etablissement aan te melden voor de halal
              gids van Ramadan Lights Gent.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="bg-[#f8fafa] section-padding">
        <div className="section-container">
          <FoodPartnerForm />
        </div>
      </section>

      <Footer />
    </main>
  );
}
