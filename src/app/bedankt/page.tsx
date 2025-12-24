"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Check, Copy, ArrowLeft, Mail, Phone } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

const paymentDetails = {
  iban: "BE93 0018 0728 1667",
  beneficiary: "VGM",
  reference: "Sponsoring Ramadan Lights + [Uw bedrijfsnaam]",
};

export default function BedanktPage() {
  const [copied, setCopied] = useState(false);

  const copyIban = () => {
    navigator.clipboard.writeText(paymentDetails.iban.replace(/\s/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="fixed inset-0 stars-bg opacity-30" />
      <div className="fixed inset-0 pattern-overlay opacity-10" />

      {/* Glow effects */}
      <motion.div
        className="fixed top-1/4 left-1/4 w-96 h-96 bg-glow-gold rounded-full blur-3xl opacity-20"
        animate={{
          opacity: [0.15, 0.25, 0.15],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="fixed bottom-1/4 right-1/4 w-72 h-72 bg-glow-teal rounded-full blur-3xl opacity-15"
        animate={{
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <div className="relative z-10 max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-background-alt border border-border rounded-2xl p-8 md:p-12 text-center"
        >
          {/* Success icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-teal/20 flex items-center justify-center"
          >
            <Check className="w-10 h-10 text-teal" />
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="font-serif text-3xl md:text-4xl text-text-primary mb-4"
          >
            Bedankt voor uw aanvraag!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-text-secondary mb-8"
          >
            Uw sponsoraanvraag is succesvol ontvangen. U ontvangt binnenkort een
            bevestiging per e-mail met verdere instructies.
          </motion.p>

          {/* Decorative line */}
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-8" />

          {/* Payment instructions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-background rounded-xl p-6 mb-8 text-left"
          >
            <h2 className="font-serif text-xl text-text-primary mb-4 text-center">
              Betaalinstructies
            </h2>

            <p className="text-text-secondary text-sm mb-4 text-center">
              Gelieve het bedrag over te schrijven naar onderstaande rekening:
            </p>

            <div className="space-y-4">
              {/* IBAN */}
              <div className="flex items-center justify-between p-4 bg-background-alt rounded-lg border border-border">
                <div>
                  <p className="text-text-muted text-xs mb-1">Rekeningnummer (IBAN)</p>
                  <p className="text-text-primary font-mono text-lg">{paymentDetails.iban}</p>
                </div>
                <button
                  onClick={copyIban}
                  className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                  aria-label="Kopieer IBAN"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-teal" />
                  ) : (
                    <Copy className="w-5 h-5 text-text-muted hover:text-primary" />
                  )}
                </button>
              </div>

              {/* Beneficiary */}
              <div className="p-4 bg-background-alt rounded-lg border border-border">
                <p className="text-text-muted text-xs mb-1">Begunstigde</p>
                <p className="text-text-primary font-medium">{paymentDetails.beneficiary}</p>
              </div>

              {/* Reference */}
              <div className="p-4 bg-background-alt rounded-lg border border-border">
                <p className="text-text-muted text-xs mb-1">Mededeling</p>
                <p className="text-text-primary text-sm">{paymentDetails.reference}</p>
              </div>
            </div>

            {/* Important note */}
            <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-primary text-sm font-medium mb-1">Belangrijk</p>
              <p className="text-text-secondary text-xs">
                Vermeld altijd uw bedrijfsnaam bij de mededeling zodat we uw
                betaling correct kunnen verwerken. U ontvangt een bevestiging
                zodra uw betaling is ontvangen.
              </p>
            </div>
          </motion.div>

          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center gap-4 mb-8"
          >
            <a
              href="mailto:info@vgm.be"
              className="flex items-center justify-center gap-2 text-text-muted hover:text-primary transition-colors text-sm"
            >
              <Mail className="w-4 h-4" />
              info@vgm.be
            </a>
            <a
              href="tel:+32XXXXXXXX"
              className="flex items-center justify-center gap-2 text-text-muted hover:text-primary transition-colors text-sm"
            >
              <Phone className="w-4 h-4" />
              +32 XXX XX XX XX
            </a>
          </motion.div>

          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Button variant="secondary" size="md">
              <a href="/" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Terug naar home
              </a>
            </Button>
          </motion.div>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-8 pt-8 border-t border-border"
          >
            <div className="flex items-center justify-center gap-3">
              <div className="relative w-10 h-10">
                <Image
                  src="/assets/logos/vgm-logo.png"
                  alt="VGM Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="text-left">
                <p className="text-text-primary font-serif text-sm">Ramadan Lights Gent</p>
                <p className="text-text-muted text-xs">VGM</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
