"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

// Demo sponsors - in production this would come from Sanity CMS
const sponsors = {
  gold: [
    { id: 1, name: "Gouden Sponsor 1", logo: "/assets/logos/placeholder-gold.svg" },
    { id: 2, name: "Gouden Sponsor 2", logo: "/assets/logos/placeholder-gold.svg" },
  ],
  silver: [
    { id: 3, name: "Zilveren Sponsor 1", logo: "/assets/logos/placeholder-silver.svg" },
    { id: 4, name: "Zilveren Sponsor 2", logo: "/assets/logos/placeholder-silver.svg" },
    { id: 5, name: "Zilveren Sponsor 3", logo: "/assets/logos/placeholder-silver.svg" },
  ],
  bronze: [
    { id: 6, name: "Bronzen Sponsor 1", logo: "/assets/logos/placeholder-bronze.svg" },
    { id: 7, name: "Bronzen Sponsor 2", logo: "/assets/logos/placeholder-bronze.svg" },
    { id: 8, name: "Bronzen Sponsor 3", logo: "/assets/logos/placeholder-bronze.svg" },
    { id: 9, name: "Bronzen Sponsor 4", logo: "/assets/logos/placeholder-bronze.svg" },
  ],
};

interface SponsorCardProps {
  name: string;
  logo: string;
  tier: "gold" | "silver" | "bronze";
  index: number;
}

function SponsorCard({ name, logo, tier, index }: SponsorCardProps) {
  const sizeClasses = {
    gold: "h-32 md:h-40",
    silver: "h-24 md:h-32",
    bronze: "h-20 md:h-24",
  };

  const tierClasses = {
    gold: "sponsor-gold",
    silver: "sponsor-silver",
    bronze: "sponsor-bronze",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05, y: -5 }}
      className={`lantern-card ${tierClasses[tier]} rounded-xl p-4 md:p-6 flex items-center justify-center cursor-pointer`}
    >
      <div className={`relative w-full ${sizeClasses[tier]}`}>
        {/* Placeholder for actual logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div
              className={`w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center ${
                tier === "gold"
                  ? "bg-primary/20"
                  : tier === "silver"
                  ? "bg-text-secondary/20"
                  : "bg-amber-700/20"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                className={`w-8 h-8 ${
                  tier === "gold"
                    ? "text-primary"
                    : tier === "silver"
                    ? "text-text-secondary"
                    : "text-amber-600"
                }`}
                fill="currentColor"
              >
                <path d="M12 2L14.09 8.26L21 9.27L16 14.14L17.18 21.02L12 17.77L6.82 21.02L8 14.14L3 9.27L9.91 8.26L12 2Z" />
              </svg>
            </div>
            <p className="text-text-secondary text-sm font-medium">{name}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function SponsorGrid() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="sponsors" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 stars-bg opacity-30" />

      <div ref={ref} className="section-container relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-secondary mb-4">
            Onze <span className="text-primary">Lichtbrengers</span>
          </h2>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-6" />
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">
            Mogelijk gemaakt door lokale ondernemers die geloven in de kracht van
            verbinding en gemeenschap.
          </p>
        </motion.div>

        {/* Gold sponsors */}
        {sponsors.gold.length > 0 && (
          <div className="mb-12">
            <motion.h3
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center font-serif text-xl text-primary mb-6 flex items-center justify-center gap-2"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                <path d="M12 2L14.09 8.26L21 9.27L16 14.14L17.18 21.02L12 17.77L6.82 21.02L8 14.14L3 9.27L9.91 8.26L12 2Z" />
              </svg>
              Gouden Partners
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                <path d="M12 2L14.09 8.26L21 9.27L16 14.14L17.18 21.02L12 17.77L6.82 21.02L8 14.14L3 9.27L9.91 8.26L12 2Z" />
              </svg>
            </motion.h3>
            <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {sponsors.gold.map((sponsor, index) => (
                <SponsorCard
                  key={sponsor.id}
                  name={sponsor.name}
                  logo={sponsor.logo}
                  tier="gold"
                  index={index}
                />
              ))}
            </div>
          </div>
        )}

        {/* Silver sponsors */}
        {sponsors.silver.length > 0 && (
          <div className="mb-12">
            <motion.h3
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center font-serif text-lg text-text-secondary mb-6"
            >
              Zilveren Partners
            </motion.h3>
            <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {sponsors.silver.map((sponsor, index) => (
                <SponsorCard
                  key={sponsor.id}
                  name={sponsor.name}
                  logo={sponsor.logo}
                  tier="silver"
                  index={index}
                />
              ))}
            </div>
          </div>
        )}

        {/* Bronze sponsors */}
        {sponsors.bronze.length > 0 && (
          <div className="mb-12">
            <motion.h3
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center font-serif text-lg text-text-muted mb-6"
            >
              Bronzen Partners
            </motion.h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {sponsors.bronze.map((sponsor, index) => (
                <SponsorCard
                  key={sponsor.id}
                  name={sponsor.name}
                  logo={sponsor.logo}
                  tier="bronze"
                  index={index}
                />
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-text-muted mb-4">
            Wil uw bedrijf ook schitteren als lichtbrenger?
          </p>
          <a
            href="#sponsor-form"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-hover transition-colors font-semibold"
          >
            Word Partner
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
