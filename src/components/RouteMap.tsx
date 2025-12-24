"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Calendar, MapPin } from "lucide-react";
import dynamic from "next/dynamic";

type LocationKey = "wondelgemstraat" | "bevrijdingslaan";

const locations: { id: LocationKey; name: string; subtitle: string; center: [number, number]; zoom: number }[] = [
  {
    id: "wondelgemstraat",
    name: "WONDELGEMSTRAAT",
    subtitle: "Rabotwijk",
    center: [51.0635, 3.7095],
    zoom: 16,
  },
  {
    id: "bevrijdingslaan",
    name: "BEVRIJDINGSLAAN",
    subtitle: "& Phoenixstraat",
    center: [51.0605, 3.7015],
    zoom: 15,
  },
];

// Real coordinates from OpenStreetMap
const routes = {
  wondelgemstraat: [
    [51.065315, 3.7091596], [51.0652518, 3.7091844], [51.0651888, 3.7092075],
    [51.0646444, 3.7093865], [51.0645619, 3.7094108], [51.0641119, 3.7095433],
    [51.0640764, 3.7095529], [51.0640287, 3.7095657], [51.0639635, 3.7095847],
    [51.0637095, 3.709659], [51.0631598, 3.7098197], [51.0630933, 3.7098391],
    [51.0629157, 3.7098973], [51.0628625, 3.7099147], [51.0628113, 3.7099319],
    [51.0626315, 3.7099923], [51.0625436, 3.7100195], [51.0616656, 3.71028],
    [51.0615748, 3.7102994]
  ] as [number, number][],
  // Bevrijdingslaan & Phoenixstraat combined as one continuous route
  bevrijdingslaanPhoenix: [
    // Phoenixstraat (south to north)
    [51.0577376, 3.7071108], [51.0577646, 3.7069207], [51.0578048, 3.7067926],
    [51.0580774, 3.7060366], [51.0583278, 3.7053053], [51.0585255, 3.7048679],
    [51.0589024, 3.7043079],
    // Connection point to Bevrijdingslaan
    [51.05925, 3.7038],
    // Bevrijdingslaan (continuing northwest)
    [51.05955, 3.7033782], [51.0605, 3.702], [51.0615, 3.7005],
    [51.0625, 3.699], [51.0634869, 3.6959922]
  ] as [number, number][],
};

// Map component loaded dynamically to avoid SSR issues with Leaflet
const MapComponent = dynamic(
  () => import("./MapComponent"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-[#0a2020] flex items-center justify-center">
        <div className="text-white/50">Kaart laden...</div>
      </div>
    )
  }
);

export function RouteMap() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeLocation, setActiveLocation] = useState<LocationKey>("wondelgemstraat");

  const currentLocation = locations.find(l => l.id === activeLocation)!;
  const currentRoutes = activeLocation === "wondelgemstraat"
    ? [routes.wondelgemstraat]
    : [routes.bevrijdingslaanPhoenix];

  return (
    <section id="route" className="bg-[#0f2d2d] section-padding overflow-hidden">
      <div ref={ref} className="section-container">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-white/80 text-lg max-w-2xl mx-auto"
          >
            Drie straten in het hart van Gent worden verlicht met betoverende Ramadanverlichting.
          </motion.p>
        </div>

        {/* Location selector tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-4 mb-8"
        >
          {locations.map((location) => (
            <button
              key={location.id}
              onClick={() => setActiveLocation(location.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                activeLocation === location.id
                  ? "bg-teal text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              {location.id === "wondelgemstraat" ? "Zone 1" : "Zone 2"}
            </button>
          ))}
        </motion.div>

        {/* Map Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="relative max-w-4xl mx-auto"
        >
          <div className="relative aspect-[16/9] rounded-3xl overflow-hidden">
            {/* Real Map with Leaflet */}
            <MapComponent
              center={currentLocation.center}
              zoom={currentLocation.zoom}
              routes={currentRoutes}
              activeLocation={activeLocation}
            />

            {/* Info Callout Card */}
            <motion.div
              key={activeLocation}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-[500]"
            >
              <div className="relative">
                <div className="bg-[#1a4a4a]/95 backdrop-blur-sm rounded-2xl px-8 py-5 text-center shadow-2xl">
                  <p className="text-teal-light text-[10px] font-medium tracking-[0.2em] mb-2 uppercase">
                    Ramadan Lights Gent
                  </p>
                  <h3 className="text-white text-2xl md:text-3xl font-display font-bold tracking-wide mb-1">
                    {currentLocation.name}
                  </h3>
                  <p className="text-white/50 text-sm mb-3">
                    {currentLocation.subtitle}
                  </p>
                  <div className="flex items-center justify-center gap-2 text-white/70">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium tracking-wide">FEBRUARI - MAART 2026</span>
                  </div>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-3 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-[#1a4a4a]/95" />
              </div>
            </motion.div>
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row justify-center gap-4 mt-8"
          >
            <a
              href={activeLocation === "wondelgemstraat"
                ? "https://www.google.com/maps/dir//Wondelgemstraat,+9000+Gent"
                : "https://www.google.com/maps/dir//Bevrijdingslaan,+9000+Gent"
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-[#0f2d2d] rounded-full font-semibold uppercase tracking-wide text-sm hover:bg-white/90 transition-all shadow-lg"
            >
              <MapPin className="w-5 h-5" />
              Routebeschrijving
            </a>
            <a
              href="#sponsor-form"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-[#0f2d2d] rounded-full font-semibold uppercase tracking-wide text-sm hover:bg-white/90 transition-all shadow-lg"
            >
              <Calendar className="w-5 h-5" />
              Word Sponsor
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
