"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowRight, Users, Eye, Heart, Building2, HelpCircle, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sponsorFormSchema, type SponsorFormData } from "@/lib/validations";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

const benefits = [
  {
    title: "Bereik de gemeenschap",
    description: "Vergroot uw zichtbaarheid bij duizenden bezoekers tijdens de Ramadan periode in Gent",
    icon: Users,
  },
  {
    title: "Positieve associatie",
    description: "Verbind uw merk aan een verbindend en positief initiatief in de stad",
    icon: Heart,
  },
  {
    title: "Logo op de website",
    description: "Uw bedrijfslogo wordt prominent getoond op onze website en promotiematerialen",
    icon: Eye,
  },
  {
    title: "Lokale impact",
    description: "Steun een lokaal project dat gemeenschappen samenbrengt en de stad verfraait",
    icon: Building2,
  },
];

const faq = [
  {
    question: "Wat krijg ik als sponsor?",
    answer: "Als sponsor wordt uw logo getoond op onze website, krijgt u vermeldingen op sociale media, en ontvangt u een uitnodiging voor het openingsevent. De exacte voordelen bespreken we graag persoonlijk.",
  },
  {
    question: "Hoeveel kost het om sponsor te worden?",
    answer: "We bieden verschillende mogelijkheden aan, afhankelijk van uw wensen en budget. Neem contact met ons op voor een vrijblijvend gesprek over de mogelijkheden.",
  },
  {
    question: "Wanneer vindt Ramadan Lights plaats?",
    answer: "Ramadan Lights Gent vindt plaats tijdens de Ramadan periode in 2026 (februari-maart). De verlichting blijft de hele maand zichtbaar.",
  },
  {
    question: "Kan ik ook op een andere manier bijdragen?",
    answer: "Zeker! Naast financiële sponsoring zijn er ook mogelijkheden voor sponsoring in natura of samenwerkingen. Neem contact op om de mogelijkheden te bespreken.",
  },
];

export default function SponsorPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SponsorFormData>({
    resolver: zodResolver(sponsorFormSchema),
  });

  const onSubmit = async (data: SponsorFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/sponsor-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        window.location.href = "/bedankt";
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Er is een fout opgetreden. Probeer het later opnieuw.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
              Ramadan Lights Gent 2026
            </p>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-white mb-6 tracking-tight">
              Word Sponsor
            </h1>

            <p className="text-xl text-white/70 mb-10 leading-relaxed">
              Steun Ramadan Lights Gent en maak deel uit van dit verbindende initiatief.
              Samen maken we Gent mooier tijdens de heilige maand.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#aanmelden"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full font-medium bg-gold text-gray-900 hover:bg-gold/90 transition-all"
              >
                Word sponsor
                <ArrowRight className="w-5 h-5 ml-2" />
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
              Waarom sponsor worden?
            </h2>
            <p className="text-lg text-text-muted max-w-2xl mx-auto">
              Versterk uw zichtbaarheid en maak impact in de gemeenschap
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

      {/* How it works */}
      <section className="bg-[#f8fafa] section-padding">
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
              { step: 1, title: "Vul het formulier in", description: "Laat uw gegevens achter via het aanmeldformulier hieronder" },
              { step: 2, title: "Persoonlijk contact", description: "We nemen contact op om de mogelijkheden te bespreken" },
              { step: 3, title: "Word zichtbaar", description: "Uw logo verschijnt op de website en promotiematerialen" },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-teal text-white flex items-center justify-center font-bold text-lg">
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

      {/* Form Section */}
      <section id="aanmelden" className="bg-white section-padding">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-text-primary mb-4">
              Aanmelden als sponsor
            </h2>
            <p className="text-lg text-text-muted max-w-2xl mx-auto">
              Vul onderstaand formulier in en wij nemen zo snel mogelijk contact met u op
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-xl mx-auto"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="card space-y-5">
              <Input
                id="companyName"
                label="Bedrijfsnaam *"
                placeholder="Uw bedrijfsnaam"
                error={errors.companyName?.message}
                {...register("companyName")}
              />

              <Input
                id="vatNumber"
                label="BTW-nummer *"
                placeholder="BE0123456789"
                error={errors.vatNumber?.message}
                {...register("vatNumber")}
              />

              <Input
                id="contactPerson"
                label="Contactpersoon *"
                placeholder="Voor- en achternaam"
                error={errors.contactPerson?.message}
                {...register("contactPerson")}
              />

              <Input
                id="email"
                type="email"
                label="E-mailadres *"
                placeholder="email@bedrijf.be"
                error={errors.email?.message}
                {...register("email")}
              />

              <Input
                id="phone"
                type="tel"
                label="Telefoonnummer *"
                placeholder="+32 XXX XX XX XX"
                error={errors.phone?.message}
                {...register("phone")}
              />

              <Textarea
                id="message"
                label="Bericht (optioneel)"
                placeholder="Heeft u vragen of opmerkingen? Laat het ons weten."
                error={errors.message?.message}
                {...register("message")}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full btn-primary"
                isLoading={isSubmitting}
              >
                Verstuur aanvraag
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <p className="text-xs text-text-muted text-center">
                U ontvangt een bevestiging per e-mail.
              </p>
            </form>
          </motion.div>
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
              Vragen?
            </h2>
            <p className="text-lg text-white/70 mb-8">
              Neem gerust contact met ons op voor meer informatie over sponsormogelijkheden.
            </p>
            <a
              href="mailto:vzwvgm@gmail.com?subject=Sponsoring%20informatie"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full font-medium bg-gold text-gray-900 hover:bg-gold/90 transition-all"
            >
              <Mail className="w-5 h-5 mr-2" />
              vzwvgm@gmail.com
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
