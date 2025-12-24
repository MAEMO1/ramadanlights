"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Heart, Users, Sparkles, MapPin } from "lucide-react";

const features = [
  {
    icon: Heart,
    title: "Verbinding",
    description: "Mensen van alle achtergronden samen brengen.",
  },
  {
    icon: Users,
    title: "Gemeenschap",
    description: "Gedragen door lokale ondernemers en bewoners.",
  },
  {
    icon: Sparkles,
    title: "Sfeer",
    description: "Betoverende verlichting in de straten van Gent.",
  },
  {
    icon: MapPin,
    title: "Gent",
    description: "Een stad bekend om openheid en diversiteit.",
  },
];

export function Story() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="verhaal" className="bg-soft section-padding">
      <div ref={ref} className="section-container">
        {/* Header */}
        <div className="max-w-2xl mb-20">
          <motion.span
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            className="badge-outline mb-6 inline-block"
          >
            Over het project
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="heading-section mb-6"
          >
            Licht dat verbindt
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-body"
          >
            De Ramadan is een tijd van reflectie en verbinding.
            Met Ramadan Lights Gent brengen we deze waarden tot leven in de
            straten van onze stad.
          </motion.p>
        </div>

        {/* Content grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-start mb-20">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            <h3 className="heading-card mb-6">
              Waarom Ramadanverlichting?
            </h3>
            <div className="space-y-5 text-body">
              <p>
                De Ramadan is de heilige vastenmaand voor moslims wereldwijd.
                Het is een tijd van bezinning, solidariteit en gemeenschapszin.
              </p>
              <p>
                Met Ramadan Lights willen we deze periode zichtbaar maken in
                Gent. De verlichting symboliseert warmte en gastvrijheid.
              </p>
              <p>
                Net zoals kerstverlichting de winter opfleurt, zorgt
                Ramadanverlichting voor sfeer die alle Gentenaars verbindt.
              </p>
            </div>
          </motion.div>

          {/* Stats card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="card"
          >
            <div className="mb-8">
              <span className="badge mb-4 inline-block">Ramadan 2026</span>
              <h4 className="heading-card">Februari - Maart</h4>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="card-soft text-center">
                <p className="text-4xl font-display font-bold text-teal mb-2">3</p>
                <p className="text-small">Straten verlicht</p>
              </div>
              <div className="card-soft text-center">
                <p className="text-4xl font-display font-bold text-gold mb-2">30</p>
                <p className="text-small">Dagen feest</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="card text-center"
            >
              <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-teal-50 flex items-center justify-center">
                <feature.icon className="w-6 h-6 text-teal" />
              </div>
              <h4 className="font-display font-semibold text-text-primary mb-2">{feature.title}</h4>
              <p className="text-small">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
