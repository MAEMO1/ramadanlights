"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const images = [
  {
    src: "/assets/images/ramadan_verlichting_final.jpg",
    alt: "Ramadanverlichting Sleepstraat Gent",
  },
];

export function Gallery() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="sfeerbeelden" className="bg-white section-padding">
      <div ref={ref} className="section-container">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            className="badge mb-6 inline-block"
          >
            Sfeerbeelden
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="heading-section mb-6"
          >
            Een blik op de verlichting
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-body max-w-lg mx-auto"
          >
            Ontdek hoe de Ramadan Lights de straten van Gent zullen verlichten.
          </motion.p>
        </div>

        {/* Gallery Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="grid gap-6"
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-lg"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
          className="text-center text-text-muted text-sm mt-6"
        >
          Meer sfeerbeelden volgen binnenkort.
        </motion.p>
      </div>
    </section>
  );
}
