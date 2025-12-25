"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Full-width background image */}
      <div className="absolute inset-0">
        <Image
          src="/assets/images/ramadan-lights-gent.jpg"
          alt="Ramadanverlichting in Gent"
          fill
          className="object-cover object-[85%_center]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="section-container section-padding">
          <div className="max-w-2xl">
            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6"
            >
              <span className="block text-6xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight text-white">
                Ramadan
              </span>
              <span className="block text-6xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight text-teal-light">
                Lights
              </span>
              <span className="block text-4xl md:text-5xl lg:text-6xl font-display font-light tracking-wide text-white/90 mt-2">
                Gent
              </span>
            </motion.h1>

            {/* Year badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <span className="badge">Februari - Maart 2026</span>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg text-white/80 max-w-md mb-10 leading-relaxed"
            >
              Verbindend licht in het hart van de stad. Samen maken we Gent
              nog mooier tijdens de heilige maand.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a href="#sponsor-form" className="btn-primary">
                Word Sponsor
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
              <a href="#verhaal" className="inline-flex items-center justify-center px-8 py-4 rounded-full font-medium border-2 border-white/30 text-white hover:bg-white/10 transition-all">
                Ontdek meer
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2"
        >
          <div className="w-1.5 h-3 rounded-full bg-teal-light" />
        </motion.div>
      </motion.div>
    </section>
  );
}
