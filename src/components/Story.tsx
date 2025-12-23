"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Heart, Users, Sparkles, MapPin } from "lucide-react";

const features = [
  {
    icon: Heart,
    title: "Verbinding",
    description:
      "Ramadan Lights brengt mensen van alle achtergronden samen in een gedeelde ervaring van licht en warmte.",
  },
  {
    icon: Users,
    title: "Gemeenschap",
    description:
      "Een project van en voor de Gentse gemeenschap, gedragen door lokale ondernemers en bewoners.",
  },
  {
    icon: Sparkles,
    title: "Magie",
    description:
      "De betoverende sfeer van verlichte straten transformeert de stad in een plek van verwondering.",
  },
  {
    icon: MapPin,
    title: "Gent",
    description:
      "Onze geliefde stad staat bekend om haar openheid en diversiteit. Dit project eert die traditie.",
  },
];

export function Story() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="verhaal" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background-alt" />
      <div className="absolute inset-0 pattern-overlay opacity-30" />

      <div ref={ref} className="section-container relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-secondary mb-4">
            <span className="text-primary">Licht</span> in de Duisternis
          </h2>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-teal to-transparent mx-auto mb-6" />
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">
            De Ramadan is een tijd van reflectie, verbinding en gemeenschap.
            Met Ramadan Lights Gent brengen we deze waarden tot leven in onze stad.
          </p>
        </motion.div>

        {/* Story content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="font-serif text-2xl md:text-3xl text-text-primary mb-6">
              Waarom Ramadanverlichting?
            </h3>
            <div className="space-y-4 text-text-secondary">
              <p>
                De Ramadan is de heilige vastenmaand voor moslims wereldwijd.
                Het is een tijd van bezinning, solidariteit en het versterken
                van familiebanden en gemeenschapszin.
              </p>
              <p>
                Met Ramadan Lights willen we deze bijzondere periode zichtbaar
                maken in het straatbeeld van Gent. De verlichting symboliseert
                de warmte en gastvrijheid die centraal staan tijdens de Ramadan.
              </p>
              <p>
                Net zoals kerstverlichting de wintermaanden opfleurt, zorgt
                Ramadanverlichting voor een feestelijke sfeer die alle Gentenaars
                kan verbinden – ongeacht achtergrond of geloof.
              </p>
            </div>
          </motion.div>

          {/* Visual element */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative"
          >
            <div className="aspect-square relative">
              {/* Decorative background */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal/20 to-primary/20 rounded-2xl" />
              <div className="absolute inset-4 border-2 border-primary/30 rounded-xl" />
              <div className="absolute inset-8 border border-teal/30 rounded-lg" />

              {/* Center content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className="w-32 h-32 mx-auto mb-4 border-2 border-dashed border-primary/40 rounded-full flex items-center justify-center"
                  >
                    <svg
                      viewBox="0 0 100 100"
                      className="w-16 h-16 text-primary"
                      fill="currentColor"
                    >
                      <path d="M50 10c-22.1 0-40 17.9-40 40s17.9 40 40 40c8.3 0 16-2.5 22.4-6.8-6.3 3.3-13.5 5.2-21.1 5.2-24.3 0-44-19.7-44-44s19.7-44 44-44c7.6 0 14.8 1.9 21.1 5.2C66 12.5 58.3 10 50 10z" />
                    </svg>
                  </motion.div>
                  <p className="font-serif text-xl text-primary">Ramadan 2025</p>
                  <p className="text-text-muted text-sm">Maart - April</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="lantern-card rounded-xl p-6 text-center"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-serif text-lg text-text-primary mb-2">
                {feature.title}
              </h4>
              <p className="text-text-muted text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
