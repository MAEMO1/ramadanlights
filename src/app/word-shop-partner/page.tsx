"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowRight, Users, Sparkles, Store, MapPin, HelpCircle, Mail, Phone, ShoppingBag, Star, Eye, TrendingUp } from "lucide-react";
import Link from "next/link";

const benefits = [
  {
    title: "Bereik de Gentse moslimgemeenschap",
    description: "Duizenden bezoekers uit de moslimgemeenschap ontdekken jouw winkel tijdens Ramadan",
    icon: Users,
  },
  {
    title: "Zichtbaarheid op de kaart",
    description: "Jouw winkel wordt getoond op onze interactieve kaart met alle Ramadan-vriendelijke locaties",
    icon: MapPin,
  },
  {
    title: "Gratis vermelding mogelijk",
    description: "Start met een gratis basisvermelding en upgrade later indien gewenst",
    icon: Star,
  },
  {
    title: "Seizoensgebonden traffic",
    description: "Profiteer van het verhoogde winkelverkeer tijdens de Ramadan periode",
    icon: TrendingUp,
  },
];

const shopTypes = [
  "Kledingwinkels",
  "Parfumerieën",
  "Boekhandels (Islamitische literatuur)",
  "Cadeauwinkels",
  "Juweliers",
  "Woondecoratie",
  "Speelgoedwinkels",
  "Elektronica",
  "En meer...",
];

const faq = [
  {
    question: "Welke winkels kunnen meedoen?",
    answer: "Alle winkels die relevant zijn voor de Ramadan periode zijn welkom. Denk aan kledingwinkels, cadeauwinkels, boekhandels, parfumerieën en meer.",
  },
  {
    question: "Is het gratis om mee te doen?",
    answer: "Ja, een basisvermelding is gratis. We bieden ook mogelijkheden voor uitgebreide vermeldingen met extra zichtbaarheid.",
  },
  {
    question: "Hoe lang duurt de vermelding?",
    answer: "Je vermelding is actief tijdens de hele Ramadan periode (1 maand) en blijft daarna zichtbaar in ons archief.",
  },
  {
    question: "Kan ik mijn vermelding aanpassen?",
    answer: "Ja, na goedkeuring kun je wijzigingen doorgeven via e-mail. We updaten je vermelding zo snel mogelijk.",
  },
];

export default function WordShopPartnerPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-[#2d1f4e] to-[#3f2d5e]">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <p className="text-pink-300 font-medium mb-4 tracking-wide uppercase text-sm">
              Ramadan Lights Gent 2026
            </p>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-white mb-6 tracking-tight">
              Word Shop Partner
            </h1>

            <p className="text-xl text-white/70 mb-10 leading-relaxed">
              Laat jouw winkel ontdekken door duizenden bezoekers tijdens Ramadan.
              Word onderdeel van het Ramadan Lights project in Gent.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:vzwvgm@gmail.com?subject=Shop%20Partner%20aanmelding"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full font-medium bg-pink-500 text-white hover:bg-pink-600 transition-all"
              >
                <Mail className="w-5 h-5 mr-2" />
                Neem contact op
              </a>
              <a
                href="#voordelen"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full font-medium border-2 border-white/30 text-white hover:bg-white/10 transition-all"
              >
                Bekijk voordelen
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="voordelen" className="bg-white section-padding">
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
              Profiteer van extra zichtbaarheid tijdens de drukste winkelperiode
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card text-center"
                >
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-pink-100 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-pink-600" />
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

      {/* Shop Types Section */}
      <section className="bg-[#f8fafa] section-padding">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-text-primary mb-4">
              Welke winkels zijn welkom?
            </h2>
            <p className="text-lg text-text-muted max-w-2xl mx-auto">
              Alle winkels die relevant zijn voor de Ramadan periode
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {shopTypes.map((type, index) => (
              <motion.div
                key={type}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100"
              >
                <Store className="w-4 h-4 text-pink-500" />
                <span className="text-sm text-text-secondary">{type}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white section-padding">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-text-primary mb-4">
              Hoe werkt het?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: 1, title: "Neem contact op", description: "Stuur ons een e-mail met je winkelgegevens en we nemen snel contact op" },
              { step: 2, title: "Bespreek je wensen", description: "We bespreken de mogelijkheden en kijken wat het beste bij jouw winkel past" },
              { step: 3, title: "Word zichtbaar", description: "Na goedkeuring verschijnt jouw winkel op Ramadan Lights" },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-lg">
                  {item.step}
                </div>
                <h3 className="font-display font-semibold text-text-primary mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-text-muted">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-[#f8fafa] section-padding">
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
            {faq.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="card"
              >
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-pink-500 flex-shrink-0 mt-0.5" />
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
      <section className="bg-[#2d1f4e] section-padding">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-white mb-4">
              Interesse?
            </h2>
            <p className="text-lg text-white/70 mb-8">
              Neem vandaag nog contact met ons op voor meer informatie over de mogelijkheden.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:vzwvgm@gmail.com?subject=Shop%20Partner%20aanmelding"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full font-medium bg-pink-500 text-white hover:bg-pink-600 transition-all"
              >
                <Mail className="w-5 h-5 mr-2" />
                vzwvgm@gmail.com
              </a>
            </div>

            <p className="text-sm text-white/50 mt-6">
              Of bel ons op{" "}
              <a
                href="tel:+32123456789"
                className="text-white/70 hover:text-white"
              >
                +32 123 45 67 89
              </a>
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
