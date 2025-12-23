"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sponsorFormSchema, type SponsorFormData, packageInfo } from "@/lib/validations";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";
import { Textarea } from "./ui/Textarea";
import { Check, Star, Download } from "lucide-react";

const packageOptions = [
  { value: "gold", label: `Goud - ${packageInfo.gold.price}` },
  { value: "silver", label: `Zilver - ${packageInfo.silver.price}` },
  { value: "bronze", label: `Brons - ${packageInfo.bronze.price}` },
];

export function SponsorForm() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<keyof typeof packageInfo | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SponsorFormData>({
    resolver: zodResolver(sponsorFormSchema),
  });

  const watchedPackage = watch("package");

  const onSubmit = async (data: SponsorFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/sponsor-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        // Redirect to thank you page
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
    <section id="sponsor-form" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 pattern-overlay opacity-20" />

      {/* Glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-glow-gold rounded-full blur-3xl opacity-20" />

      <div ref={ref} className="section-container relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-secondary mb-4">
            Word <span className="text-primary">Partner</span>
          </h2>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-6" />
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">
            Steun dit prachtige initiatief en laat uw bedrijf schitteren als
            lichtbrenger voor de Gentse gemeenschap.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Package info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="font-serif text-2xl text-text-primary mb-6">
              Sponsorpakketten
            </h3>

            {Object.entries(packageInfo).map(([key, pkg]) => (
              <motion.div
                key={key}
                whileHover={{ scale: 1.02 }}
                className={`p-6 rounded-xl border transition-all cursor-pointer ${
                  watchedPackage === key
                    ? key === "gold"
                      ? "border-primary bg-primary/10 shadow-glow-sm"
                      : key === "silver"
                      ? "border-text-secondary bg-text-secondary/10"
                      : "border-amber-600 bg-amber-600/10"
                    : "border-border bg-background-alt hover:border-border-light"
                }`}
                onClick={() => setSelectedPackage(key as keyof typeof packageInfo)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        key === "gold"
                          ? "bg-primary/20"
                          : key === "silver"
                          ? "bg-text-secondary/20"
                          : "bg-amber-600/20"
                      }`}
                    >
                      <Star
                        className={`w-5 h-5 ${
                          key === "gold"
                            ? "text-primary"
                            : key === "silver"
                            ? "text-text-secondary"
                            : "text-amber-600"
                        }`}
                      />
                    </div>
                    <span className="font-serif text-xl text-text-primary">
                      {pkg.name}
                    </span>
                  </div>
                  <span
                    className={`text-2xl font-bold ${
                      key === "gold"
                        ? "text-primary"
                        : key === "silver"
                        ? "text-text-secondary"
                        : "text-amber-600"
                    }`}
                  >
                    {pkg.price}
                  </span>
                </div>
                <ul className="space-y-2">
                  {pkg.benefits.map((benefit, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-text-muted text-sm"
                    >
                      <Check className="w-4 h-4 text-teal flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}

            {/* Download contract */}
            <div className="pt-4">
              <a
                href="/contract.pdf"
                download
                className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors"
              >
                <Download className="w-5 h-5" />
                Download sponsorovereenkomst (PDF)
              </a>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6 p-8 rounded-2xl bg-background-alt border border-border"
            >
              <h3 className="font-serif text-xl text-text-primary mb-6">
                Aanmeldformulier
              </h3>

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
                label="Telefoonnummer"
                placeholder="+32 XXX XX XX XX"
                error={errors.phone?.message}
                {...register("phone")}
              />

              <Select
                id="package"
                label="Sponsorpakket *"
                options={packageOptions}
                error={errors.package?.message}
                {...register("package")}
              />

              <Textarea
                id="message"
                label="Bericht (optioneel)"
                placeholder="Heeft u nog vragen of opmerkingen?"
                error={errors.message?.message}
                {...register("message")}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isSubmitting}
              >
                Verstuur Aanvraag
              </Button>

              <p className="text-text-muted text-xs text-center">
                Door dit formulier te versturen gaat u akkoord met onze
                sponsoringvoorwaarden. U ontvangt een bevestiging per e-mail.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
