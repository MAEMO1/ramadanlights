"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Clock, Calendar } from "lucide-react";

const routeInfo = [
  {
    icon: MapPin,
    title: "Locatie",
    description: "Rabotwijk & Omgeving, Gent",
  },
  {
    icon: Calendar,
    title: "Periode",
    description: "Tijdens de Ramadan 2025 (Maart - April)",
  },
  {
    icon: Clock,
    title: "Beste tijd",
    description: "Na zonsondergang voor de mooiste sfeer",
  },
];

export function RouteMap() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="route" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background-alt" />
      <div className="absolute inset-0 pattern-overlay opacity-20" />

      <div ref={ref} className="section-container relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-secondary mb-4">
            Ontdek de <span className="text-teal">Route</span>
          </h2>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-teal to-transparent mx-auto mb-6" />
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">
            Wandel door de verlichte straten van Gent en ervaar de magie van
            Ramadan Lights.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Map placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-border">
              {/* Placeholder for Google Maps - styled dark mode */}
              <div className="absolute inset-0 bg-background-card flex items-center justify-center">
                <div className="text-center p-8">
                  {/* Stylized map placeholder */}
                  <div className="relative w-full h-64 mb-4">
                    {/* Background grid */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
                        {Array.from({ length: 64 }).map((_, i) => (
                          <div key={i} className="border border-border/30" />
                        ))}
                      </div>
                    </div>

                    {/* Stylized route */}
                    <svg
                      viewBox="0 0 300 200"
                      className="absolute inset-0 w-full h-full"
                    >
                      {/* Route path */}
                      <motion.path
                        d="M50,150 Q100,100 150,120 T250,80"
                        fill="none"
                        stroke="#d4a853"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray="10,5"
                        initial={{ pathLength: 0 }}
                        animate={isInView ? { pathLength: 1 } : {}}
                        transition={{ duration: 2, delay: 0.5 }}
                      />

                      {/* Location markers */}
                      <motion.g
                        initial={{ scale: 0 }}
                        animate={isInView ? { scale: 1 } : {}}
                        transition={{ delay: 1 }}
                      >
                        <circle cx="50" cy="150" r="8" fill="#2d9596" />
                        <text
                          x="50"
                          y="175"
                          textAnchor="middle"
                          fill="#a0a0b0"
                          fontSize="10"
                        >
                          Start
                        </text>
                      </motion.g>

                      <motion.g
                        initial={{ scale: 0 }}
                        animate={isInView ? { scale: 1 } : {}}
                        transition={{ delay: 1.5 }}
                      >
                        <circle cx="150" cy="120" r="6" fill="#d4a853" />
                      </motion.g>

                      <motion.g
                        initial={{ scale: 0 }}
                        animate={isInView ? { scale: 1 } : {}}
                        transition={{ delay: 2 }}
                      >
                        <circle cx="250" cy="80" r="8" fill="#2d9596" />
                        <text
                          x="250"
                          y="105"
                          textAnchor="middle"
                          fill="#a0a0b0"
                          fontSize="10"
                        >
                          Einde
                        </text>
                      </motion.g>
                    </svg>

                    {/* Glow effects */}
                    <motion.div
                      className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-primary"
                      animate={{
                        boxShadow: [
                          "0 0 10px rgba(212, 168, 83, 0.5)",
                          "0 0 20px rgba(212, 168, 83, 0.8)",
                          "0 0 10px rgba(212, 168, 83, 0.5)",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>

                  <p className="text-text-muted text-sm">
                    Interactieve kaart beschikbaar tijdens het evenement
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative corner elements */}
            <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-primary rounded-tl-lg" />
            <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr-lg" />
            <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-primary rounded-bl-lg" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-primary rounded-br-lg" />
          </motion.div>

          {/* Route information */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8"
          >
            <div>
              <h3 className="font-serif text-2xl text-text-primary mb-4">
                Beleef de Magie
              </h3>
              <p className="text-text-secondary mb-6">
                De verlichte route voert je langs de mooiste plekjes van de wijk.
                Elke lantaarn vertelt een verhaal van hoop, gemeenschap en
                samenhorigheid.
              </p>
            </div>

            {/* Info cards */}
            <div className="space-y-4">
              {routeInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-background/50 border border-border"
                >
                  <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center flex-shrink-0">
                    <info.icon className="w-5 h-5 text-teal" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-1">
                      {info.title}
                    </h4>
                    <p className="text-text-muted text-sm">{info.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Download route PDF button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 1 }}
            >
              <a
                href="#"
                className="inline-flex items-center gap-2 text-teal hover:text-teal-light transition-colors font-medium"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download routekaart (PDF)
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
