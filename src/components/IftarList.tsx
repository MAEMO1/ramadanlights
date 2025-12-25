"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Clock, MapPin, Users, Check, Calendar, ExternalLink, Globe, Facebook, Instagram } from "lucide-react";
import { type IftarLocation, formatFrequencyDisplay } from "@/lib/iftar-types";

interface IftarListProps {
  locations: IftarLocation[];
}

export function IftarList({ locations }: IftarListProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  if (locations.length === 0) {
    return null;
  }

  return (
    <section className="bg-white section-padding">
      <div ref={ref} className="section-container">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="heading-section mb-4"
          >
            Alle iftar locaties
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-body"
          >
            {locations.length} iftar{locations.length !== 1 ? "s" : ""}{" "}
            beschikbaar
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((location, index) => (
            <motion.div
              key={location.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="card hover:shadow-lg transition-shadow"
            >
              {/* Header */}
              <div className="mb-4">
                <h3 className="font-display font-semibold text-lg text-text-primary mb-1">
                  {location.mosque_name}
                </h3>
                <div className="flex items-start gap-2 text-text-muted text-sm">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>
                    {location.address}, {location.city}
                  </span>
                </div>
              </div>

              {/* Time & Frequency */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 p-3 bg-teal/10 rounded-xl">
                  <Clock className="w-5 h-5 text-teal" />
                  <span className="font-semibold text-teal">
                    Iftar: {location.iftar_time}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-xl">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-700">
                    {formatFrequencyDisplay(location.frequency, location.days_of_week || [])}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm">
                {location.capacity && (
                  <div className="flex items-center gap-2 text-text-muted">
                    <Users className="w-4 h-4" />
                    <span>Capaciteit: {location.capacity} personen</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Check
                    className={`w-4 h-4 ${
                      location.is_free ? "text-green-500" : "text-text-muted"
                    }`}
                  />
                  <span
                    className={
                      location.is_free
                        ? "text-green-600 font-medium"
                        : "text-text-muted"
                    }
                  >
                    {location.is_free
                      ? "Gratis"
                      : location.price_info || "Betaald"}
                  </span>
                </div>
              </div>

              {/* Accessibility tags */}
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                {location.for_men && (
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                    Mannen
                  </span>
                )}
                {location.for_women && (
                  <span className="px-2 py-1 bg-pink-50 text-pink-700 text-xs rounded-full">
                    Vrouwen
                  </span>
                )}
                {location.for_families && (
                  <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full">
                    Gezinnen
                  </span>
                )}
              </div>

              {/* Description */}
              {location.description && (
                <p className="mt-4 text-sm text-text-muted line-clamp-2">
                  {location.description}
                </p>
              )}

              {/* Links */}
              {(location.registration_url || location.website_url || location.facebook_url || location.instagram_url) && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                  {location.registration_url && (
                    <a
                      href={location.registration_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal text-white text-xs rounded-full hover:bg-teal/90 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Inschrijven
                    </a>
                  )}
                  {location.website_url && (
                    <a
                      href={location.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <Globe className="w-3 h-3" />
                      Website
                    </a>
                  )}
                  {location.facebook_url && (
                    <a
                      href={location.facebook_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 text-xs rounded-full hover:bg-blue-200 transition-colors"
                    >
                      <Facebook className="w-3 h-3" />
                      Facebook
                    </a>
                  )}
                  {location.instagram_url && (
                    <a
                      href={location.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-pink-100 text-pink-700 text-xs rounded-full hover:bg-pink-200 transition-colors"
                    >
                      <Instagram className="w-3 h-3" />
                      Instagram
                    </a>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
