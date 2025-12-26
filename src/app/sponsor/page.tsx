"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowRight, Check, Building2, Star, Award } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sponsorFormSchema, type SponsorFormData } from "@/lib/validations";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

const packages = [
  {
    name: "Brons",
    price: "€250",
    icon: Building2,
    color: "from-amber-600 to-amber-700",
    features: [
      "Vermelding op de website",
      "Bedanking op sociale media",
      "Certificaat van deelname",
    ],
  },
  {
    name: "Zilver",
    price: "€500",
    icon: Star,
    color: "from-gray-400 to-gray-500",
    popular: false,
    features: [
      "Alles van Brons",
      "Logo op de website",
      "Vermelding in persberichten",
      "Uitnodiging openingsevent",
    ],
  },
  {
    name: "Goud",
    price: "€1000",
    icon: Award,
    color: "from-yellow-500 to-amber-500",
    popular: true,
    features: [
      "Alles van Zilver",
      "Prominente logo plaatsing",
      "Vermelding op promotiemateriaal",
      "VIP uitnodiging alle events",
      "Social media shoutout",
    ],
  },
];

export default function SponsorPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string>("");

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
        body: JSON.stringify({ ...data, package: selectedPackage }),
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
    <main className="min-h-screen bg-soft">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-dark to-dark/95">
        <div className="section-container text-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="badge mb-6 inline-block"
          >
            Partnerschappen
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6"
          >
            Word Sponsor
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/70 max-w-2xl mx-auto"
          >
            Steun Ramadan Lights Gent en versterk uw zichtbaarheid binnen de
            gemeenschap. Samen maken we Gent mooier tijdens de heilige maand.
          </motion.p>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-20 bg-white">
        <div className="section-container">
          <div className="text-center mb-16">
            <h2 className="heading-section mb-4">Sponsorpakketten</h2>
            <p className="text-body max-w-lg mx-auto">
              Kies het pakket dat bij uw organisatie past
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`relative rounded-2xl bg-white border-2 p-8 ${
                  selectedPackage === pkg.name
                    ? "border-teal shadow-xl"
                    : "border-gray-100 hover:border-teal/30"
                } transition-all cursor-pointer`}
                onClick={() => setSelectedPackage(pkg.name)}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-teal text-white text-xs font-medium px-3 py-1 rounded-full">
                      Populair
                    </span>
                  </div>
                )}

                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${pkg.color} flex items-center justify-center mb-6`}
                >
                  <pkg.icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-2xl font-display font-bold text-dark mb-2">
                  {pkg.name}
                </h3>
                <p className="text-3xl font-bold text-teal mb-6">{pkg.price}</p>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-teal flex-shrink-0 mt-0.5" />
                      <span className="text-text-muted">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setSelectedPackage(pkg.name)}
                  className={`w-full py-3 rounded-full font-medium transition-all ${
                    selectedPackage === pkg.name
                      ? "bg-teal text-white"
                      : "bg-gray-100 text-dark hover:bg-teal/10"
                  }`}
                >
                  {selectedPackage === pkg.name ? "Geselecteerd" : "Selecteer"}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="aanmelden" className="py-20 bg-soft">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="heading-section mb-4">Aanmeldformulier</h2>
            <p className="text-body max-w-lg mx-auto">
              Vul onderstaand formulier in en wij nemen contact met u op
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-xl mx-auto"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="card space-y-5">
              {selectedPackage && (
                <div className="bg-teal/10 border border-teal/20 rounded-xl p-4 mb-2">
                  <p className="text-sm text-teal font-medium">
                    Geselecteerd pakket:{" "}
                    <span className="font-bold">{selectedPackage}</span>
                  </p>
                </div>
              )}

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
                placeholder="Vragen of opmerkingen?"
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

      <Footer />
    </main>
  );
}
