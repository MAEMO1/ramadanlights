"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Check, X, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { Suspense } from "react";

function ShopPartnerGoedgekeurdContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const name = searchParams.get("name");
  const already = searchParams.get("already");

  const isApproved = status === "approved";

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="fixed inset-0 stars-bg opacity-30" />
      <div className="fixed inset-0 pattern-overlay opacity-10" />

      {/* Glow effects */}
      <motion.div
        className={`fixed top-1/4 left-1/4 w-96 h-96 ${
          isApproved ? "bg-glow-teal" : "bg-red-500/30"
        } rounded-full blur-3xl opacity-20`}
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

      <div className="relative z-10 max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-background-alt border border-border rounded-2xl p-8 md:p-12 text-center"
        >
          {/* Status icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
            className={`w-20 h-20 mx-auto mb-6 rounded-full ${
              isApproved ? "bg-teal/20" : "bg-red-500/20"
            } flex items-center justify-center`}
          >
            {isApproved ? (
              <Check className="w-10 h-10 text-teal" />
            ) : (
              <X className="w-10 h-10 text-red-500" />
            )}
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="font-serif text-3xl md:text-4xl text-text-primary mb-4"
          >
            {isApproved ? "Shop Partner Goedgekeurd!" : "Shop Partner Afgekeurd"}
          </motion.h1>

          {name && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="text-text-muted text-lg mb-4"
            >
              {name}
            </motion.p>
          )}

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-text-secondary mb-8"
          >
            {already
              ? `Deze winkel was al ${isApproved ? "goedgekeurd" : "afgekeurd"}.`
              : isApproved
              ? "De winkel is succesvol goedgekeurd en verschijnt nu op de shop gids."
              : "De winkel aanvraag is afgekeurd."}
          </motion.p>

          {/* Decorative line */}
          <div
            className={`w-24 h-0.5 bg-gradient-to-r from-transparent ${
              isApproved ? "via-teal" : "via-red-500"
            } to-transparent mx-auto mb-8`}
          />

          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Button variant="secondary" size="md">
              <a href="/wat-te-doen" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Naar Wat te doen
              </a>
            </Button>
          </motion.div>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
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
                <p className="text-text-primary font-serif text-sm">
                  Ramadan Lights Gent
                </p>
                <p className="text-text-muted text-xs">VGM</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}

export default function ShopPartnerGoedgekeurdPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-text-muted">Laden...</div>
        </div>
      }
    >
      <ShopPartnerGoedgekeurdContent />
    </Suspense>
  );
}
