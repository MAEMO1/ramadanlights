"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { IftarForm } from "@/components/IftarForm";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function IftarToevoegenPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-12 bg-gradient-to-b from-[#0f2d2d] to-[#1a4a4a] overflow-hidden">
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
            <Link
              href="/iftar"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Terug naar Iftarkaart
            </Link>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
              Iftar{" "}
              <span className="text-gold">toevoegen</span>
            </h1>

            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Organiseert uw moskee of organisatie een iftar? Voeg deze toe aan
              de Iftarkaart zodat iedereen uw locatie kan vinden.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <IftarForm />

      <Footer />
    </main>
  );
}
