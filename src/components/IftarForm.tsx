"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Loader2, Send } from "lucide-react";
import { iftarFormSchema, IftarFormData } from "@/lib/iftar-validations";

export function IftarForm() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IftarFormData>({
    resolver: zodResolver(iftarFormSchema),
    defaultValues: {
      city: "Gent",
      is_free: true,
      for_men: true,
      for_women: true,
      for_families: true,
    },
  });

  const isFree = watch("is_free");

  const onSubmit = async (data: IftarFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/iftar/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitSuccess(true);
      } else {
        alert(result.message || "Er is een fout opgetreden");
      }
    } catch (error) {
      alert("Er is een fout opgetreden bij het versturen");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <section id="iftar-form" className="bg-soft section-padding">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-teal/20 flex items-center justify-center">
              <Send className="w-10 h-10 text-teal" />
            </div>
            <h3 className="heading-section mb-4">Bedankt voor uw inzending!</h3>
            <p className="text-body">
              Uw iftar is succesvol ingezonden. U ontvangt een bevestigingsmail
              en wij nemen zo snel mogelijk contact met u op.
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="iftar-form" className="bg-soft section-padding">
      <div ref={ref} className="section-container">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <motion.span
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              className="badge mb-6 inline-block"
            >
              Iftar Toevoegen
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="heading-section mb-6"
            >
              Dien uw iftar in
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="text-body"
            >
              Organiseert uw moskee of organisatie een iftar? Voeg deze toe aan
              de Iftarkaart zodat iedereen uw locatie kan vinden.
            </motion.p>
          </div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            onSubmit={handleSubmit(onSubmit)}
            className="card space-y-6"
          >
            {/* Basis informatie */}
            <div className="space-y-4">
              <h3 className="font-display font-semibold text-text-primary">
                Basis informatie
              </h3>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Naam moskee/organisatie *
                </label>
                <input
                  {...register("mosque_name")}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.mosque_name ? "border-red-500" : "border-gray-200"
                  } focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none transition-all`}
                  placeholder="Bijv. Moskee Al-Fath"
                />
                {errors.mosque_name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.mosque_name.message}
                  </p>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Adres *
                  </label>
                  <input
                    {...register("address")}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.address ? "border-red-500" : "border-gray-200"
                    } focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none transition-all`}
                    placeholder="Straatnaam en huisnummer"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Stad *
                  </label>
                  <input
                    {...register("city")}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.city ? "border-red-500" : "border-gray-200"
                    } focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none transition-all`}
                    placeholder="Gent"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.city.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Iftar tijd *
                </label>
                <input
                  {...register("iftar_time")}
                  type="time"
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.iftar_time ? "border-red-500" : "border-gray-200"
                  } focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none transition-all`}
                />
                {errors.iftar_time && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.iftar_time.message}
                  </p>
                )}
              </div>
            </div>

            {/* Contact informatie */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="font-display font-semibold text-text-primary">
                Contactgegevens
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Contactpersoon *
                  </label>
                  <input
                    {...register("contact_name")}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.contact_name ? "border-red-500" : "border-gray-200"
                    } focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none transition-all`}
                    placeholder="Uw naam"
                  />
                  {errors.contact_name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.contact_name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    E-mailadres *
                  </label>
                  <input
                    {...register("contact_email")}
                    type="email"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.contact_email ? "border-red-500" : "border-gray-200"
                    } focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none transition-all`}
                    placeholder="email@voorbeeld.be"
                  />
                  {errors.contact_email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.contact_email.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Telefoonnummer{" "}
                  <span className="text-text-muted">(optioneel)</span>
                </label>
                <input
                  {...register("contact_phone")}
                  type="tel"
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.contact_phone ? "border-red-500" : "border-gray-200"
                  } focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none transition-all`}
                  placeholder="+32 XXX XX XX XX"
                />
                {errors.contact_phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.contact_phone.message}
                  </p>
                )}
              </div>
            </div>

            {/* Extra informatie */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="font-display font-semibold text-text-primary">
                Extra informatie{" "}
                <span className="text-text-muted font-normal">(optioneel)</span>
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Capaciteit (aantal personen)
                  </label>
                  <input
                    {...register("capacity", { valueAsNumber: true })}
                    type="number"
                    min="1"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none transition-all"
                    placeholder="Bijv. 100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Kosten
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        {...register("is_free")}
                        type="checkbox"
                        className="w-5 h-5 rounded border-gray-300 text-teal focus:ring-teal"
                      />
                      <span className="text-sm">Gratis</span>
                    </label>
                  </div>
                </div>
              </div>

              {!isFree && (
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Prijsinformatie
                  </label>
                  <input
                    {...register("price_info")}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none transition-all"
                    placeholder="Bijv. €5 per persoon"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Beschrijving
                </label>
                <textarea
                  {...register("description")}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none transition-all resize-none"
                  placeholder="Extra informatie over de iftar..."
                />
              </div>
            </div>

            {/* Toegankelijkheid */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="font-display font-semibold text-text-primary">
                Toegankelijkheid
              </h3>
              <p className="text-sm text-text-muted">
                Geef aan voor wie de iftar toegankelijk is:
              </p>

              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    {...register("for_men")}
                    type="checkbox"
                    className="w-5 h-5 rounded border-gray-300 text-teal focus:ring-teal"
                  />
                  <span className="text-sm">Mannen</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    {...register("for_women")}
                    type="checkbox"
                    className="w-5 h-5 rounded border-gray-300 text-teal focus:ring-teal"
                  />
                  <span className="text-sm">Vrouwen</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    {...register("for_families")}
                    type="checkbox"
                    className="w-5 h-5 rounded border-gray-300 text-teal focus:ring-teal"
                  />
                  <span className="text-sm">Gezinnen</span>
                </label>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Bezig met versturen...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Iftar Indienen
                </>
              )}
            </button>

            <p className="text-center text-text-muted text-xs">
              Na inzending wordt uw iftar beoordeeld. Bij goedkeuring verschijnt
              deze op de Iftarkaart.
            </p>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
