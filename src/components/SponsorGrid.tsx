"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

// Voorlopig lege arrays - vul aan met echte sponsors wanneer beschikbaar
// Voorbeeld: { name: "Bedrijfsnaam", logo: "/assets/logos/sponsors/bedrijf.png" }
const sponsors = {
  gold: [] as { name: string; logo?: string }[],
  silver: [] as { name: string; logo?: string }[],
  bronze: [] as { name: string; logo?: string }[],
};

const hasSponsors = sponsors.gold.length > 0 || sponsors.silver.length > 0 || sponsors.bronze.length > 0;

export function SponsorGrid() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="sponsors" className="bg-white section-padding">
      <div ref={ref} className="section-container">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            className="badge-outline mb-6 inline-block"
          >
            Partners
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="heading-section mb-6"
          >
            Onze Sponsors
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-body max-w-lg mx-auto"
          >
            Mogelijk gemaakt door lokale ondernemers die geloven in verbinding.
          </motion.p>
        </div>

        {hasSponsors ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="space-y-12"
          >
            {/* Hier komen de sponsor logo's */}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="text-center py-16"
          >
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-teal-50 flex items-center justify-center">
                <svg className="w-10 h-10 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="heading-card mb-3">Uw logo hier?</h3>
              <p className="text-body mb-8">
                Word sponsor van Ramadan Lights Gent en versterk uw zichtbaarheid in de gemeenschap.
              </p>
              <a href="#sponsor-form" className="btn-primary">
                Word Partner
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
