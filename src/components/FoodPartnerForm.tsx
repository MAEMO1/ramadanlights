"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { Loader2, Send, Globe, Facebook, Instagram, MapPin, Utensils, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { foodPartnerFormSchema, FoodPartnerFormData } from "@/lib/food-partner-validations";
import { categoryLabels, FoodPartnerCategory } from "@/lib/food-partner-types";

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

export function FoodPartnerForm() {
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
  } = useForm<FoodPartnerFormData>({
    resolver: zodResolver(foodPartnerFormSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "Gent",
      postal_code: "",
      category: "restaurant",
      contact_name: "",
      contact_email: "",
      contact_phone: "",
      description: "",
      cuisine_type: "",
      is_halal_certified: false,
      halal_certification_info: "",
      iftar_special: "",
      iftar_special_price: "",
      website_url: "",
      menu_url: "",
      reservation_url: "",
      facebook_url: "",
      instagram_url: "",
      uber_eats_url: "",
      deliveroo_url: "",
      logo_url: "",
      cover_image_url: "",
    },
  });

  const isHalalCertified = watch("is_halal_certified");

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

  const onSubmit = async (data: FoodPartnerFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/food-partners/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        router.push("/bedankt-food-partner");
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
            Basisgegevens
          </h3>

          <div className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Naam etablissement *
              </label>
              <input
                type="text"
                {...register("name")}
                className="input-field w-full"
                placeholder="Restaurant De Eetzaal"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Categorie *
              </label>
              <select {...register("category")} className="input-field w-full">
                {(Object.keys(categoryLabels) as FoodPartnerCategory[]).map((cat) => (
                  <option key={cat} value={cat}>
                    {categoryLabels[cat]}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>
              )}
            </div>

            {/* Cuisine Type */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Type keuken
              </label>
              <input
                type="text"
                {...register("cuisine_type")}
                className="input-field w-full"
                placeholder="Turks, Marokkaans, Arabisch, etc."
              />
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
                  onFocus={() => addressSuggestions.length > 0 && setShowSuggestions(true)}
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

            {/* City and Postal Code */}
            <div className="grid grid-cols-2 gap-4">
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
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Postcode
                </label>
                <input
                  type="text"
                  {...register("postal_code")}
                  className="input-field w-full"
                  placeholder="9000"
                />
                {errors.postal_code && (
                  <p className="mt-1 text-sm text-red-500">{errors.postal_code.message}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Beschrijving
              </label>
              <textarea
                {...register("description")}
                className="input-field w-full min-h-[100px]"
                placeholder="Korte beschrijving van uw etablissement..."
              />
            </div>
          </div>
        </div>

        {/* Halal Information */}
        <div className="card">
          <h3 className="text-lg font-display font-semibold text-text-primary mb-6">
            Halal Informatie
          </h3>

          <div className="space-y-5">
            {/* Halal Certified Checkbox */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register("is_halal_certified")}
                className="w-5 h-5 rounded border-gray-300 text-teal focus:ring-teal"
              />
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-text-secondary">
                  Halal gecertificeerd
                </span>
              </div>
            </label>

            {/* Certification Info (shown when certified) */}
            {isHalalCertified && (
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Certificaat informatie
                </label>
                <input
                  type="text"
                  {...register("halal_certification_info")}
                  className="input-field w-full"
                  placeholder="Certificerende instantie, nummer, etc."
                />
              </div>
            )}
          </div>
        </div>

        {/* Iftar Special */}
        <div className="card">
          <h3 className="text-lg font-display font-semibold text-text-primary mb-6 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-amber-600" />
            Iftar Special
          </h3>
          <p className="text-sm text-text-muted mb-4">
            Bied je een speciaal Ramadan/iftar menu aan? Vermeld het hier!
          </p>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Iftar special beschrijving
              </label>
              <textarea
                {...register("iftar_special")}
                className="input-field w-full min-h-[80px]"
                placeholder="Iftar menu met soep, hoofdgerecht en dessert..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Prijs
              </label>
              <input
                type="text"
                {...register("iftar_special_price")}
                className="input-field w-full"
                placeholder="€15 per persoon"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="card">
          <h3 className="text-lg font-display font-semibold text-text-primary mb-6">
            Contactgegevens
          </h3>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Contactpersoon *
              </label>
              <input
                type="text"
                {...register("contact_name")}
                className="input-field w-full"
                placeholder="Voornaam Achternaam"
              />
              {errors.contact_name && (
                <p className="mt-1 text-sm text-red-500">{errors.contact_name.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  E-mailadres *
                </label>
                <input
                  type="email"
                  {...register("contact_email")}
                  className="input-field w-full"
                  placeholder="email@voorbeeld.be"
                />
                {errors.contact_email && (
                  <p className="mt-1 text-sm text-red-500">{errors.contact_email.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Telefoonnummer
                </label>
                <input
                  type="tel"
                  {...register("contact_phone")}
                  className="input-field w-full"
                  placeholder="+32 9 XXX XX XX"
                />
                {errors.contact_phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.contact_phone.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="card">
          <h3 className="text-lg font-display font-semibold text-text-primary mb-6">
            Links & Social Media
          </h3>

          <div className="space-y-5">
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
                  placeholder="https://www.voorbeeld.be"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  <Utensils className="w-4 h-4 inline mr-1" />
                  Menu URL
                </label>
                <input
                  type="url"
                  {...register("menu_url")}
                  className="input-field w-full"
                  placeholder="https://www.voorbeeld.be/menu"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Reservatie URL
              </label>
              <input
                type="url"
                {...register("reservation_url")}
                className="input-field w-full"
                placeholder="https://www.voorbeeld.be/reserveren"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              Aanvraag indienen
            </>
          )}
        </button>

        <p className="text-sm text-text-muted text-center">
          Na goedkeuring verschijnt uw etablissement op de halal gids van Ramadan Lights
          Gent.
        </p>
      </form>
    </motion.div>
  );
}
