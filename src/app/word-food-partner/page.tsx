"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowRight, Check, Users, Sparkles, Utensils, MapPin, HelpCircle } from "lucide-react";
import Link from "next/link";
import { getPaidTiers, salesPageConfig } from "@/lib/partner-config";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  users: Users,
  sparkles: Sparkles,
  utensils: Utensils,
  "map-pin": MapPin,
};

export default function WordFoodPartnerPage() {
  const paidTiers = getPaidTiers();

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-[#0f2d2d] to-[#1a3f3f]">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <p className="text-gold font-medium mb-4 tracking-wide uppercase text-sm">
              {salesPageConfig.hero.subtitle}
            </p>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-white mb-6 tracking-tight">
              {salesPageConfig.hero.title}
            </h1>

            <p className="text-xl text-white/70 mb-10 leading-relaxed">
              {salesPageConfig.hero.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/word-food-partner/aanmelden"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full font-medium bg-gold text-gray-900 hover:bg-gold/90 transition-all"
              >
                Aanmelden
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <a
                href="#pakketten"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full font-medium border-2 border-white/30 text-white hover:bg-white/10 transition-all"
              >
                Bekijk pakketten
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white section-padding">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-text-primary mb-4">
              Waarom meedoen?
            </h2>
            <p className="text-lg text-text-muted max-w-2xl mx-auto">
              Word onderdeel van het grootste Ramadan project in Gent
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {salesPageConfig.benefits.map((benefit, index) => {
              const Icon = iconMap[benefit.icon] || Users;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card text-center"
                >
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-teal/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-teal" />
                  </div>
                  <h3 className="font-display font-semibold text-text-primary mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-text-muted">{benefit.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pakketten" className="bg-[#f8fafa] section-padding">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-text-primary mb-4">
              Kies je pakket
            </h2>
            <p className="text-lg text-text-muted max-w-2xl mx-auto">
              Selecteer het pakket dat het beste bij jouw etablissement past
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {paidTiers.map(({ tier, config }, index) => (
              <motion.div
                key={tier}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-2xl overflow-hidden ${config.cardStyle} ${
                  tier === "premium" ? "md:scale-105 md:shadow-xl" : ""
                }`}
              >
                {/* Header */}
                <div className="p-6 pb-4">
                  {config.badge && (
                    <span
                      className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wide rounded-full mb-4 ${config.badgeColor}`}
                    >
                      {config.badge}
                    </span>
                  )}
                  {!config.badge && <div className="h-8 mb-4" />}
                  <h3 className="text-xl font-display font-semibold text-text-primary">
                    {config.name}
                  </h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-text-primary">
                      {config.price}
                    </span>
                    <span className="text-text-muted text-sm ml-2">+ btw</span>
                  </div>
                  <p className="text-xs text-text-muted mt-1">
                    Voor de hele Ramadan periode
                  </p>
                </div>

                {/* Features */}
                <div className="p-6 pt-2">
                  <ul className="space-y-2">
                    {config.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-text-secondary">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/word-food-partner/aanmelden"
                    className={`mt-6 w-full inline-flex items-center justify-center px-6 py-3 rounded-full font-medium transition-all text-sm ${
                      tier === "premium"
                        ? "bg-gold text-gray-900 hover:bg-gold/90"
                        : tier === "partner_plus"
                        ? "bg-gray-900 text-white hover:bg-gray-800"
                        : "bg-teal text-white hover:bg-teal/90"
                    }`}
                  >
                    Aanmelden
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Free Option Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <p className="text-text-muted">
              Wil je eerst gratis geregistreerd worden?{" "}
              <Link href="/word-food-partner/aanmelden" className="text-teal hover:underline">
                Meld je aan als gratis vermelding
              </Link>
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white section-padding">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-text-primary mb-4">
              Veelgestelde vragen
            </h2>
          </motion.div>

          <div className="max-w-2xl mx-auto space-y-4">
            {salesPageConfig.faq.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="card"
              >
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-teal flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-text-primary mb-2">
                      {item.question}
                    </h3>
                    <p className="text-sm text-text-muted">{item.answer}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#0f2d2d] section-padding">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-white mb-4">
              Klaar om te beginnen?
            </h2>
            <p className="text-lg text-white/70 mb-8">
              Meld je vandaag nog aan en bereik duizenden bezoekers tijdens Ramadan.
            </p>
            <Link
              href="/word-food-partner/aanmelden"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full font-medium bg-gold text-gray-900 hover:bg-gold/90 transition-all"
            >
              Nu aanmelden
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>

            <p className="text-sm text-white/50 mt-6">
              Vragen? Mail naar{" "}
              <a
                href={`mailto:${salesPageConfig.contact.email}`}
                className="text-white/70 hover:text-white"
              >
                {salesPageConfig.contact.email}
              </a>
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
