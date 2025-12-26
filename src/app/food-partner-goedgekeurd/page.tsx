"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function GoedgekeurdContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const name = searchParams.get("name");
  const already = searchParams.get("already") === "true";

  const isApproved = status === "approved";
  const isRejected = status === "rejected";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className={`w-20 h-20 mx-auto mb-8 rounded-full flex items-center justify-center ${
          isApproved
            ? "bg-green-500"
            : isRejected
              ? "bg-red-500"
              : "bg-amber-500"
        }`}
      >
        {isApproved ? (
          <CheckCircle className="w-10 h-10 text-white" />
        ) : isRejected ? (
          <XCircle className="w-10 h-10 text-white" />
        ) : (
          <AlertCircle className="w-10 h-10 text-white" />
        )}
      </motion.div>

      <h1 className="text-4xl md:text-5xl font-display font-semibold text-white mb-6 tracking-tight">
        {isApproved
          ? "Food Partner Goedgekeurd!"
          : isRejected
            ? "Food Partner Afgekeurd"
            : "Status Onbekend"}
      </h1>

      {name && (
        <p className="text-2xl text-teal-400 font-medium mb-4">{name}</p>
      )}

      <p className="text-xl text-white/70 mb-8 leading-relaxed">
        {already
          ? "Deze aanvraag was al eerder verwerkt."
          : isApproved
            ? "De food partner is succesvol goedgekeurd en is nu zichtbaar op de halal gids."
            : isRejected
              ? "De food partner aanvraag is afgekeurd."
              : "Er is een probleem opgetreden bij het verwerken van deze aanvraag."}
      </p>

      <Link
        href="/wat-te-doen#eten-drinken"
        className="inline-flex items-center justify-center px-8 py-4 rounded-full font-medium bg-white text-[#0f2d2d] hover:bg-white/90 transition-all"
      >
        Bekijk halal gids
      </Link>
    </motion.div>
  );
}

export default function FoodPartnerGoedgekeurdPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-24 bg-[#0f2d2d] min-h-[80vh] flex items-center">
        <div className="section-container">
          <Suspense
            fallback={
              <div className="flex justify-center">
                <div className="w-12 h-12 border-2 border-teal/30 border-t-teal rounded-full animate-spin" />
              </div>
            }
          >
            <GoedgekeurdContent />
          </Suspense>
        </div>
      </section>

      <Footer />
    </main>
  );
}
