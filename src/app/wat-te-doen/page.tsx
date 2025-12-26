"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ActivityList } from "@/components/ActivityList";
import { FoodPartnerList } from "@/components/FoodPartnerList";
import { ArrowRight, Plus, Calendar, Utensils, MapPin } from "lucide-react";
import Link from "next/link";
import type { Activity } from "@/lib/activity-types";
import type { FoodPartner } from "@/lib/food-partner-types";

export default function WatTeDoenPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [foodPartners, setFoodPartners] = useState<FoodPartner[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);
  const [isLoadingPartners, setIsLoadingPartners] = useState(true);
  const [activeSection, setActiveSection] = useState<"activities" | "iftar" | "food">("activities");

  useEffect(() => {
    async function fetchActivities() {
      try {
        const response = await fetch("/api/activities/list");
        const data = await response.json();
        if (data.success) {
          setActivities(data.data);
        }
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setIsLoadingActivities(false);
      }
    }

    async function fetchFoodPartners() {
      try {
        const response = await fetch("/api/food-partners/list");
        const data = await response.json();
        if (data.success) {
          setFoodPartners(data.data);
        }
      } catch (error) {
        console.error("Error fetching food partners:", error);
      } finally {
        setIsLoadingPartners(false);
      }
    }

    fetchActivities();
    fetchFoodPartners();
  }, []);

  const sections = [
    {
      id: "activities" as const,
      label: "Activiteiten",
      icon: Calendar,
      count: activities.length,
      color: "teal",
    },
    {
      id: "iftar" as const,
      label: "Iftar",
      icon: MapPin,
      count: null,
      color: "amber",
      href: "/iftar",
    },
    {
      id: "food" as const,
      label: "Eten & Drinken",
      icon: Utensils,
      count: foodPartners.length,
      color: "rose",
    },
  ];

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-[#0f2d2d]">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <p className="text-teal-400 font-medium mb-4 tracking-wide uppercase text-sm">
              Ramadan 2026
            </p>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-white mb-6 tracking-tight">
              Wat te doen
            </h1>

            <p className="text-xl text-white/70 mb-10 leading-relaxed max-w-2xl">
              Ontdek activiteiten, iftar locaties en halal eten & drinken in Gent
              tijdens Ramadan.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section Tabs */}
      <section className="bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="section-container py-0">
          <div className="flex gap-1 overflow-x-auto pb-px -mb-px">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;

              if (section.href) {
                return (
                  <Link
                    key={section.id}
                    href={section.href}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                      isActive
                        ? `border-${section.color}-500 text-${section.color}-600`
                        : "border-transparent text-text-muted hover:text-text-primary hover:border-gray-200"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {section.label}
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                );
              }

              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                    isActive
                      ? "border-teal text-teal"
                      : "border-transparent text-text-muted hover:text-text-primary hover:border-gray-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {section.label}
                  {section.count !== null && (
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        isActive ? "bg-teal/10 text-teal" : "bg-gray-100 text-text-muted"
                      }`}
                    >
                      {section.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="bg-[#f8fafa]">
        {/* Activities Section */}
        {activeSection === "activities" && (
          <section className="section-padding">
            <div className="section-container">
              {/* Header with Add Button */}
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
                <div>
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl md:text-3xl font-display font-semibold text-text-primary"
                  >
                    Activiteiten
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-text-muted mt-1"
                  >
                    Lezingen, workshops, en community evenementen
                  </motion.p>
                </div>

                <Link
                  href="/wat-te-doen/activiteit-toevoegen"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full font-medium border-2 border-teal text-teal hover:bg-teal hover:text-white transition-all"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Activiteit toevoegen
                </Link>
              </div>

              {isLoadingActivities ? (
                <div className="flex justify-center py-12">
                  <div className="w-12 h-12 border-2 border-teal/30 border-t-teal rounded-full animate-spin" />
                </div>
              ) : (
                <ActivityList activities={activities} embedded />
              )}
            </div>
          </section>
        )}

        {/* Food Partners Section */}
        {activeSection === "food" && (
          <section id="eten-drinken" className="section-padding">
            <div className="section-container">
              {/* Header with Partner CTA */}
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
                <div>
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl md:text-3xl font-display font-semibold text-text-primary"
                  >
                    Halal Eten & Drinken
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-text-muted mt-1"
                  >
                    Restaurants, bakkerijen, slagerijen en meer in Gent
                  </motion.p>
                </div>

                <Link
                  href="/word-food-partner"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full font-medium bg-gold text-gray-900 hover:bg-gold/90 transition-all"
                >
                  Word Food Partner
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>

              {isLoadingPartners ? (
                <div className="flex justify-center py-12">
                  <div className="w-12 h-12 border-2 border-teal/30 border-t-teal rounded-full animate-spin" />
                </div>
              ) : (
                <FoodPartnerList partners={foodPartners} embedded />
              )}
            </div>
          </section>
        )}
      </div>

      {/* CTA Section */}
      <section className="bg-[#0f2d2d] section-padding">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-white mb-4">
              Heeft u iets toe te voegen?
            </h2>
            <p className="text-lg text-white/70 mb-8">
              Voeg uw activiteit of etablissement toe aan Ramadan Lights Gent.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/wat-te-doen/activiteit-toevoegen"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full font-medium bg-white text-[#0f2d2d] hover:bg-white/90 transition-all"
              >
                <Plus className="w-5 h-5 mr-2" />
                Activiteit toevoegen
              </Link>
              <Link
                href="/word-food-partner"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full font-medium border-2 border-gold text-gold hover:bg-gold hover:text-gray-900 transition-all"
              >
                Word Food Partner
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
