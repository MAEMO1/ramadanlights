"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { Loader2, Send, Link, Globe, Facebook, Instagram, MapPin } from "lucide-react";
import { iftarFormSchema, IftarFormData } from "@/lib/iftar-validations";

interface AddressSuggestion {
  display_name: string;
  address: {
    road?: string;
    house_number?: string;
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    postcode?: string;
  };
}

export function IftarForm() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Address autocomplete state
  const [addressQuery, setAddressQuery] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<IftarFormData>({
    resolver: zodResolver(iftarFormSchema),
    defaultValues: {
      mosque_name: "",
      address: "",
      city: "Gent",
      iftar_time: "",
      contact_name: "",
      contact_email: "",
      contact_phone: "",
      is_free: true,
      for_men: true,
      for_women: true,
      for_families: true,
      frequency: "daily",
      days_of_week: [],
      start_date: "",
      end_date: "",
      capacity: undefined,
      price_info: "",
      description: "",
      registration_url: "",
      website_url: "",
      facebook_url: "",
      instagram_url: "",
    },
  });

  const isFree = watch("is_free");
  const frequency = watch("frequency");

  // Debounced address search
  const searchAddress = useCallback(async (query: string) => {
    if (query.length < 3) {
      setAddressSuggestions([]);
      return;
    }

    setIsLoadingSuggestions(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&countrycodes=be&limit=5`,
        {
          headers: {
            "User-Agent": "RamadanLightsGent/1.0",
          },
        }
      );
      const data = await response.json();
      setAddressSuggestions(data);
      setShowSuggestions(data.length > 0);
    } catch (error) {
      console.error("Address search error:", error);
      setAddressSuggestions([]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, []);

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (addressQuery) {
        searchAddress(addressQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [addressQuery, searchAddress]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        addressInputRef.current &&
        !addressInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectAddress = (suggestion: AddressSuggestion) => {
    const address = suggestion.address;
    const streetAddress = [address.road, address.house_number]
      .filter(Boolean)
      .join(" ");
    const city = address.city || address.town || address.village || address.municipality || "";

    const finalAddress = streetAddress || suggestion.display_name.split(",")[0];
    const finalCity = city || "Gent";

    setValue("address", finalAddress, { shouldValidate: true });
    setValue("city", finalCity, { shouldValidate: true });
    setAddressQuery(finalAddress);
    setShowSuggestions(false);
  };

  const onSubmit = async (data: IftarFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
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
        setSubmitError(result.message || "Er is een fout opgetreden bij het versturen.");
      }
    } catch (error) {
      console.error("Submit error:", error);
      setSubmitError("Er is een netwerkfout opgetreden. Controleer uw internetverbinding en probeer opnieuw.");
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
          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            onSubmit={handleSubmit(onSubmit)}
            className="card space-y-6"
          >
            {/* Validation errors summary */}
            {Object.keys(errors).length > 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 font-medium mb-2">
                  Vul alle verplichte velden correct in:
                </p>
                <ul className="text-red-500 text-sm list-disc list-inside">
                  {errors.mosque_name && <li>Naam moskee/organisatie is verplicht</li>}
                  {errors.address && <li>Adres is verplicht</li>}
                  {errors.city && <li>Stad is verplicht</li>}
                  {errors.iftar_time && <li>Iftar tijd: ongeldig formaat (gebruik HH:MM)</li>}
                  {errors.contact_name && <li>Contactpersoon is verplicht</li>}
                  {errors.contact_email && <li>E-mailadres is verplicht of ongeldig</li>}
                  {errors.registration_url && <li>Inschrijvingslink: ongeldige URL</li>}
                  {errors.website_url && <li>Website link: ongeldige URL</li>}
                  {errors.facebook_url && <li>Facebook link: ongeldige URL</li>}
                  {errors.instagram_url && <li>Instagram link: ongeldige URL</li>}
                </ul>
              </div>
            )}

            {/* Submit error */}
            {submitError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600">{submitError}</p>
              </div>
            )}

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
                <div className="relative">
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Adres *
                  </label>
                  <div className="relative">
                    <input
                      ref={addressInputRef}
                      value={addressQuery}
                      onChange={(e) => {
                        setAddressQuery(e.target.value);
                        setValue("address", e.target.value, { shouldValidate: true });
                      }}
                      onFocus={() => addressSuggestions.length > 0 && setShowSuggestions(true)}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.address ? "border-red-500" : "border-gray-200"
                      } focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none transition-all`}
                      placeholder="Begin met typen..."
                      autoComplete="off"
                    />
                    {/* Hidden input for form validation */}
                    <input type="hidden" {...register("address")} />
                    {isLoadingSuggestions && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Address suggestions dropdown */}
                  {showSuggestions && addressSuggestions.length > 0 && (
                    <div
                      ref={suggestionsRef}
                      className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
                    >
                      {addressSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => selectAddress(suggestion)}
                          className="w-full px-4 py-3 text-left hover:bg-teal/10 transition-colors flex items-start gap-3 border-b border-gray-100 last:border-b-0"
                        >
                          <MapPin className="w-4 h-4 text-teal mt-0.5 flex-shrink-0" />
                          <div className="min-w-0">
                            <div className="font-medium text-text-primary truncate">
                              {[suggestion.address.road, suggestion.address.house_number]
                                .filter(Boolean)
                                .join(" ") || suggestion.display_name.split(",")[0]}
                            </div>
                            <div className="text-sm text-text-muted truncate">
                              {suggestion.address.postcode} {suggestion.address.city || suggestion.address.town || suggestion.address.village || suggestion.address.municipality}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

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
                  Iftar tijd{" "}
                  <span className="text-text-muted font-normal">(optioneel)</span>
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

            {/* Frequentie */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="font-display font-semibold text-text-primary">
                Frequentie
              </h3>
              <p className="text-sm text-text-muted">
                Hoe vaak organiseert u iftar?
              </p>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Frequentie *
                </label>
                <select
                  {...register("frequency")}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none transition-all bg-white"
                >
                  <option value="daily">Dagelijks</option>
                  <option value="weekly">Wekelijks (zelfde dag elke week)</option>
                  <option value="specific_days">Specifieke dagen</option>
                  <option value="one_time">Eenmalig</option>
                </select>
              </div>

              {(frequency === "weekly" || frequency === "specific_days") && (
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Welke dagen? *
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { value: "monday", label: "Ma" },
                      { value: "tuesday", label: "Di" },
                      { value: "wednesday", label: "Wo" },
                      { value: "thursday", label: "Do" },
                      { value: "friday", label: "Vr" },
                      { value: "saturday", label: "Za" },
                      { value: "sunday", label: "Zo" },
                    ].map((day) => (
                      <label
                        key={day.value}
                        className="flex items-center gap-2 cursor-pointer bg-surface-soft px-3 py-2 rounded-lg hover:bg-surface-soft/80 transition-colors"
                      >
                        <input
                          type="checkbox"
                          value={day.value}
                          {...register("days_of_week")}
                          className="w-4 h-4 rounded border-gray-300 text-teal focus:ring-teal"
                        />
                        <span className="text-sm">{day.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Startdatum{" "}
                    <span className="text-text-muted">(optioneel)</span>
                  </label>
                  <input
                    {...register("start_date")}
                    type="date"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Einddatum{" "}
                    <span className="text-text-muted">(optioneel)</span>
                  </label>
                  <input
                    {...register("end_date")}
                    type="date"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none transition-all"
                  />
                </div>
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

            {/* Links */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="font-display font-semibold text-text-primary">
                Links{" "}
                <span className="text-text-muted font-normal">(optioneel)</span>
              </h3>
              <p className="text-sm text-text-muted">
                Voeg links toe voor inschrijving, website of social media.
              </p>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  <span className="flex items-center gap-2">
                    <Link className="w-4 h-4" />
                    Inschrijvingslink
                  </span>
                </label>
                <input
                  {...register("registration_url")}
                  type="url"
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.registration_url ? "border-red-500" : "border-gray-200"
                  } focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none transition-all`}
                  placeholder="https://forms.google.com/..."
                />
                {errors.registration_url && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.registration_url.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  <span className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Website / Event link
                  </span>
                </label>
                <input
                  {...register("website_url")}
                  type="url"
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.website_url ? "border-red-500" : "border-gray-200"
                  } focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none transition-all`}
                  placeholder="https://www.uwmoskee.be/iftar"
                />
                {errors.website_url && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.website_url.message}
                  </p>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    <span className="flex items-center gap-2">
                      <Facebook className="w-4 h-4" />
                      Facebook
                    </span>
                  </label>
                  <input
                    {...register("facebook_url")}
                    type="url"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.facebook_url ? "border-red-500" : "border-gray-200"
                    } focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none transition-all`}
                    placeholder="https://facebook.com/events/..."
                  />
                  {errors.facebook_url && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.facebook_url.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    <span className="flex items-center gap-2">
                      <Instagram className="w-4 h-4" />
                      Instagram
                    </span>
                  </label>
                  <input
                    {...register("instagram_url")}
                    type="url"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.instagram_url ? "border-red-500" : "border-gray-200"
                    } focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none transition-all`}
                    placeholder="https://instagram.com/p/..."
                  />
                  {errors.instagram_url && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.instagram_url.message}
                    </p>
                  )}
                </div>
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
