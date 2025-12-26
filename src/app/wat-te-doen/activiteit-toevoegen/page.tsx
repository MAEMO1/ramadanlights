"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ActivityForm } from "@/components/ActivityForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ActiviteitToevoegenPage() {
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
              href="/wat-te-doen"
              className="inline-flex items-center text-white/70 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Terug naar Wat te doen
            </Link>

            <h1 className="text-4xl md:text-5xl font-display font-semibold text-white mb-6 tracking-tight">
              Activiteit toevoegen
            </h1>

            <p className="text-xl text-white/70 leading-relaxed max-w-2xl">
              Voeg uw lezing, workshop of community evenement toe aan de Ramadan
              Lights kalender.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="bg-[#f8fafa] section-padding">
        <div className="section-container">
          <ActivityForm />
        </div>
      </section>

      <Footer />
    </main>
  );
}
