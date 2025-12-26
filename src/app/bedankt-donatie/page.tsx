"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Heart, ArrowLeft, Mail } from "lucide-react";
import Image from "next/image";

export default function BedanktDonatiePage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="fixed inset-0 stars-bg opacity-30" />
      <div className="fixed inset-0 pattern-overlay opacity-10" />

      {/* Glow effects */}
      <motion.div
        className="fixed top-1/4 left-1/4 w-96 h-96 bg-glow-gold rounded-full blur-3xl opacity-20"
        animate={{
          opacity: [0.15, 0.25, 0.15],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="fixed bottom-1/4 right-1/4 w-72 h-72 bg-glow-teal rounded-full blur-3xl opacity-15"
        animate={{
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <div className="relative z-10 max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-background-alt border border-border rounded-2xl p-8 md:p-12 text-center"
        >
          {/* Success icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold/20 flex items-center justify-center"
          >
            <Heart className="w-10 h-10 text-gold" />
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="font-serif text-3xl md:text-4xl text-text-primary mb-4"
          >
            Hartelijk dank voor uw donatie!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-text-secondary mb-8"
          >
            Uw genereuze bijdrage helpt ons om de straten van Gent te verlichten
            tijdens de Ramadan. Samen maken we onze stad nog mooier!
          </motion.p>

          {/* Decorative line */}
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-8" />

          {/* Thank you message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-background rounded-xl p-6 mb-8"
          >
            <p className="text-text-secondary">
              Uw donatie is succesvol verwerkt. Dankzij mensen zoals u kunnen we
              dit mooie project realiseren en de verbinding in onze gemeenschap
              versterken.
            </p>
          </motion.div>

          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex justify-center mb-8"
          >
            <a
              href="mailto:vzwvgm@gmail.com"
              className="flex items-center justify-center gap-2 text-text-muted hover:text-primary transition-colors text-sm"
            >
              <Mail className="w-4 h-4" />
              vzwvgm@gmail.com
            </a>
          </motion.div>

          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Button variant="secondary" size="md">
              <a href="/" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Terug naar home
              </a>
            </Button>
          </motion.div>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-8 pt-8 border-t border-border"
          >
            <div className="flex items-center justify-center gap-3">
              <div className="relative w-10 h-10">
                <Image
                  src="/assets/logos/vgm-logo.png"
                  alt="VGM Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="text-left">
                <p className="text-text-primary font-serif text-sm">Ramadan Lights Gent</p>
                <p className="text-text-muted text-xs">VGM</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
