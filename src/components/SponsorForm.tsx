"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sponsorFormSchema, type SponsorFormData } from "@/lib/validations";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Textarea } from "./ui/Textarea";
import { ArrowRight } from "lucide-react";

export function SponsorForm() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
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
    <section id="sponsor-form" className="bg-soft section-padding">
      <div ref={ref} className="section-container">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            className="badge mb-6 inline-block"
          >
            Sponsoren
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="heading-section mb-6"
          >
            Word Partner
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-body max-w-lg mx-auto"
          >
            Steun Ramadan Lights Gent en maak deel uit van dit verbindende initiatief.
          </motion.p>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
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
              label="Telefoonnummer"
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
  );
}
