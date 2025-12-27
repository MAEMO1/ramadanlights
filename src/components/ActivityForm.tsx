"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { Loader2, Send, Globe, Facebook, Instagram, MapPin, Calendar, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { activityFormSchema, ActivityFormData } from "@/lib/activity-validations";
import { activityTypeLabels, ActivityType, recurrenceLabels, RecurrencePattern, languageLabels, ActivityLanguage } from "@/lib/activity-types";
import { Languages } from "lucide-react";

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

export function ActivityForm() {
  const router = useRouter();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  } = useForm<ActivityFormData>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: {
      title: "",
      activity_type: "lecture",
      location_name: "",
      address: "",
      city: "Gent",
      postal_code: "",
      event_date: "",
      start_time: "",
      end_time: "",
      organizer_name: "",
      organizer_email: "",
      organizer_phone: "",
      description: "",
      is_recurring: false,
      recurrence_pattern: undefined,
      recurrence_end_date: "",
      capacity: undefined,
      is_free: true,
      price: "",
      for_men: true,
      for_women: true,
      for_families: true,
      for_youth: false,
      registration_url: "",
      website_url: "",
      facebook_url: "",
      instagram_url: "",
      cover_image_url: "",
      language: undefined,
    },
  });

  const isFree = watch("is_free");
  const isRecurring = watch("is_recurring");
  const activityType = watch("activity_type");

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
    const city =
      address.city || address.town || address.village || address.municipality || "";
    const postalCode = address.postcode || "";

    const finalAddress = streetAddress || suggestion.display_name.split(",")[0];
    const finalCity = city || "Gent";

    setValue("address", finalAddress, { shouldValidate: true });
    setValue("city", finalCity, { shouldValidate: true });
    if (postalCode) {
      setValue("postal_code", postalCode, { shouldValidate: true });
    }
    setAddressQuery(finalAddress);
    setShowSuggestions(false);
  };

  const onSubmit = async (data: ActivityFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/activities/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        router.push("/bedankt-activiteit");
      } else {
        setSubmitError(result.message || "Er is iets misgegaan");
      }
    } catch (error) {
      setSubmitError("Er is een fout opgetreden. Probeer het opnieuw.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      className="max-w-2xl mx-auto"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div className="card">
          <h3 className="text-lg font-display font-semibold text-text-primary mb-6">
            Activiteit Details
          </h3>

          <div className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Titel *
              </label>
              <input
                type="text"
                {...register("title")}
                className="input-field w-full"
                placeholder="Ramadan Lezing: De Deugden van Vasten"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* Activity Type */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Type activiteit *
              </label>
              <select {...register("activity_type")} className="input-field w-full">
                {(Object.keys(activityTypeLabels) as ActivityType[]).map((type) => (
                  <option key={type} value={type}>
                    {activityTypeLabels[type]}
                  </option>
                ))}
              </select>
            </div>

            {/* Language - only for lectures */}
            {activityType === "lecture" && (
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                  <Languages className="w-4 h-4" />
                  Taal van de lezing
                </label>
                <select {...register("language")} className="input-field w-full">
                  <option value="">Selecteer taal...</option>
                  {(Object.keys(languageLabels) as ActivityLanguage[]).map((lang) => (
                    <option key={lang} value={lang}>
                      {languageLabels[lang]}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Beschrijving
              </label>
              <textarea
                {...register("description")}
                className="input-field w-full min-h-[100px]"
                placeholder="Beschrijf uw activiteit..."
              />
            </div>
          </div>
        </div>

        {/* Date & Time */}
        <div className="card">
          <h3 className="text-lg font-display font-semibold text-text-primary mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal" />
            Datum & Tijd
          </h3>

          <div className="space-y-5">
            {/* Event Date */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Datum *
              </label>
              <input
                type="date"
                {...register("event_date")}
                className="input-field w-full"
              />
              {errors.event_date && (
                <p className="mt-1 text-sm text-red-500">{errors.event_date.message}</p>
              )}
            </div>

            {/* Start & End Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Starttijd
                </label>
                <input
                  type="time"
                  {...register("start_time")}
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Eindtijd
                </label>
                <input
                  type="time"
                  {...register("end_time")}
                  className="input-field w-full"
                />
              </div>
            </div>

            {/* Recurring Checkbox */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register("is_recurring")}
                className="w-5 h-5 rounded border-gray-300 text-teal focus:ring-teal"
              />
              <span className="text-sm font-medium text-text-secondary">
                Dit is een terugkerende activiteit
              </span>
            </label>

            {/* Recurrence Options (shown when recurring) */}
            {isRecurring && (
              <div className="space-y-4 pl-8 border-l-2 border-teal/20">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Herhalingspatroon
                  </label>
                  <select
                    {...register("recurrence_pattern")}
                    className="input-field w-full"
                  >
                    <option value="">Selecteer...</option>
                    {(Object.keys(recurrenceLabels) as RecurrencePattern[]).map(
                      (pattern) => (
                        <option key={pattern} value={pattern}>
                          {recurrenceLabels[pattern]}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Einddatum herhaling
                  </label>
                  <input
                    type="date"
                    {...register("recurrence_end_date")}
                    className="input-field w-full"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="card">
          <h3 className="text-lg font-display font-semibold text-text-primary mb-6 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-teal" />
            Locatie
          </h3>

          <div className="space-y-5">
            {/* Location Name */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Locatienaam *
              </label>
              <input
                type="text"
                {...register("location_name")}
                className="input-field w-full"
                placeholder="Fatih Moskee"
              />
              {errors.location_name && (
                <p className="mt-1 text-sm text-red-500">{errors.location_name.message}</p>
              )}
            </div>

            {/* Address with autocomplete */}
            <div className="relative">
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Adres *
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  ref={addressInputRef}
                  type="text"
                  value={addressQuery}
                  onChange={(e) => {
                    setAddressQuery(e.target.value);
                    setValue("address", e.target.value);
                  }}
                  onFocus={() =>
                    addressSuggestions.length > 0 && setShowSuggestions(true)
                  }
                  className="input-field w-full pl-12"
                  placeholder="Begin met typen..."
                />
                {isLoadingSuggestions && (
                  <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted animate-spin" />
                )}
              </div>

              {/* Suggestions dropdown */}
              {showSuggestions && addressSuggestions.length > 0 && (
                <div
                  ref={suggestionsRef}
                  className="absolute z-20 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 max-h-60 overflow-y-auto"
                >
                  {addressSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => selectAddress(suggestion)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-start gap-3 border-b border-gray-50 last:border-0"
                    >
                      <MapPin className="w-4 h-4 text-text-muted mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-text-primary line-clamp-2">
                        {suggestion.display_name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
              {errors.address && (
                <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>
              )}
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Stad *
              </label>
              <input
                type="text"
                {...register("city")}
                className="input-field w-full"
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Capacity & Pricing */}
        <div className="card">
          <h3 className="text-lg font-display font-semibold text-text-primary mb-6">
            Capaciteit & Prijs
          </h3>

          <div className="space-y-5">
            {/* Capacity */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Capaciteit (optioneel)
              </label>
              <input
                type="number"
                {...register("capacity", { valueAsNumber: true })}
                className="input-field w-full"
                placeholder="100"
              />
            </div>

            {/* Is Free Checkbox */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register("is_free")}
                className="w-5 h-5 rounded border-gray-300 text-teal focus:ring-teal"
              />
              <span className="text-sm font-medium text-text-secondary">
                Gratis toegang
              </span>
            </label>

            {/* Price (shown when not free) */}
            {!isFree && (
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Prijs
                </label>
                <input
                  type="text"
                  {...register("price")}
                  className="input-field w-full"
                  placeholder="€10 per persoon"
                />
              </div>
            )}
          </div>
        </div>

        {/* Target Audience */}
        <div className="card">
          <h3 className="text-lg font-display font-semibold text-text-primary mb-6">
            Doelgroep
          </h3>

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register("for_men")}
                className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-sm text-text-secondary">Mannen</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register("for_women")}
                className="w-5 h-5 rounded border-gray-300 text-pink-500 focus:ring-pink-500"
              />
              <span className="text-sm text-text-secondary">Vrouwen</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register("for_families")}
                className="w-5 h-5 rounded border-gray-300 text-purple-500 focus:ring-purple-500"
              />
              <span className="text-sm text-text-secondary">Gezinnen</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register("for_youth")}
                className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              />
              <span className="text-sm text-text-secondary">Jeugd</span>
            </label>
          </div>
        </div>

        {/* Organizer Information */}
        <div className="card">
          <h3 className="text-lg font-display font-semibold text-text-primary mb-6">
            Organisator
          </h3>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Naam organisator *
              </label>
              <input
                type="text"
                {...register("organizer_name")}
                className="input-field w-full"
                placeholder="Voornaam Achternaam of Organisatienaam"
              />
              {errors.organizer_name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.organizer_name.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  E-mailadres *
                </label>
                <input
                  type="email"
                  {...register("organizer_email")}
                  className="input-field w-full"
                  placeholder="email@voorbeeld.be"
                />
                {errors.organizer_email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.organizer_email.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Telefoonnummer
                </label>
                <input
                  type="tel"
                  {...register("organizer_phone")}
                  className="input-field w-full"
                  placeholder="+32 9 XXX XX XX"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="card">
          <h3 className="text-lg font-display font-semibold text-text-primary mb-6">
            Links
          </h3>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Inschrijvingslink
              </label>
              <input
                type="url"
                {...register("registration_url")}
                className="input-field w-full"
                placeholder="https://..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  <Globe className="w-4 h-4 inline mr-1" />
                  Website
                </label>
                <input
                  type="url"
                  {...register("website_url")}
                  className="input-field w-full"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  <Facebook className="w-4 h-4 inline mr-1" />
                  Facebook
                </label>
                <input
                  type="url"
                  {...register("facebook_url")}
                  className="input-field w-full"
                  placeholder="https://facebook.com/..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                <Instagram className="w-4 h-4 inline mr-1" />
                Instagram
              </label>
              <input
                type="url"
                {...register("instagram_url")}
                className="input-field w-full"
                placeholder="https://instagram.com/..."
              />
            </div>
          </div>
        </div>

        {/* Submit Error */}
        {submitError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-600">{submitError}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Indienen...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Activiteit indienen
            </>
          )}
        </button>

        <p className="text-sm text-text-muted text-center">
          Na goedkeuring verschijnt uw activiteit op de &quot;Wat te doen&quot; pagina van
          Ramadan Lights Gent.
        </p>
      </form>
    </motion.div>
  );
}
