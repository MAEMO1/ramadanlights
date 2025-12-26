"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function BedanktFoodPartnerPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-24 bg-[#0f2d2d] min-h-[80vh] flex items-center">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 mx-auto mb-8 rounded-full bg-green-500 flex items-center justify-center"
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-display font-semibold text-white mb-6 tracking-tight">
              Bedankt voor uw aanmelding!
            </h1>

            <p className="text-xl text-white/70 mb-8 leading-relaxed">
              Uw aanvraag is succesvol ontvangen. We zullen uw aanmelding zo snel
              mogelijk beoordelen. U ontvangt een e-mail zodra uw etablissement is
              goedgekeurd.
            </p>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white/90">Wat gebeurt er nu?</h3>
              <ul className="text-left max-w-md mx-auto space-y-3">
                <li className="flex items-start gap-3 text-white/70">
                  <span className="w-6 h-6 rounded-full bg-teal/20 text-teal flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    1
                  </span>
                  <span>Wij beoordelen uw aanvraag binnen 24-48 uur</span>
                </li>
                <li className="flex items-start gap-3 text-white/70">
                  <span className="w-6 h-6 rounded-full bg-teal/20 text-teal flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    2
                  </span>
                  <span>U ontvangt een bevestigingsmail bij goedkeuring</span>
                </li>
                <li className="flex items-start gap-3 text-white/70">
                  <span className="w-6 h-6 rounded-full bg-teal/20 text-teal flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    3
                  </span>
                  <span>Uw etablissement verschijnt op de halal gids</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Link
                href="/wat-te-doen"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full font-medium bg-white text-[#0f2d2d] hover:bg-white/90 transition-all"
              >
                Bekijk Wat te doen
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full font-medium border-2 border-white/30 text-white hover:bg-white/10 transition-all"
              >
                Terug naar home
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
