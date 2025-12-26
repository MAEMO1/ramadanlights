"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { Loader2, Send, Globe, Facebook, Instagram, MapPin, Tag, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { shopPartnerFormSchema, ShopPartnerFormData } from "@/lib/shop-partner-validations";
import { shopCategoryLabels, shopCategoryEmojis, ShopCategory } from "@/lib/shop-partner-types";
import { ImageUpload } from "./ImageUpload";

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

export function ShopPartnerForm() {
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
    setValue,
    watch,
    formState: { errors },
  } = useForm<ShopPartnerFormData>({
    resolver: zodResolver(shopPartnerFormSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "Gent",
      postal_code: "",
      category: "decor",
      contact_name: "",
      contact_email: "",
      contact_phone: "",
      description: "",
      ramadan_special: "",
      ramadan_special_discount: "",
      website_url: "",
      facebook_url: "",
      instagram_url: "",
      logo_url: "",
      cover_image_url: "",
    },
  });

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

  const onSubmit = async (data: ShopPartnerFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/shop-partners/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        router.push("/bedankt-shop-partner");
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
                Naam winkel *
              </label>
              <input
                type="text"
                {...register("name")}
                className="input-field w-full"
                placeholder="Mijn Winkel"
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
                {(Object.keys(shopCategoryLabels) as ShopCategory[]).map((cat) => (
                  <option key={cat} value={cat}>
                    {shopCategoryEmojis[cat]} {shopCategoryLabels[cat]}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>
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
                placeholder="Korte beschrijving van uw winkel..."
              />
            </div>
          </div>
        </div>

        {/* Ramadan Special */}
        <div className="card">
          <h3 className="text-lg font-display font-semibold text-text-primary mb-6 flex items-center gap-2">
            <Tag className="w-5 h-5 text-amber-600" />
            Ramadan Actie
          </h3>
          <p className="text-sm text-text-muted mb-4">
            Bied je een speciale Ramadan actie of korting aan? Vermeld het hier!
          </p>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Actie beschrijving
              </label>
              <textarea
                {...register("ramadan_special")}
                className="input-field w-full min-h-[80px]"
                placeholder="Speciaal Ramadan aanbod, kortingsactie, cadeauservice..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Korting / Aanbieding
              </label>
              <input
                type="text"
                {...register("ramadan_special_discount")}
                className="input-field w-full"
                placeholder="20% korting, Gratis inpakservice, etc."
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
                  placeholder="+32 9 123 45 67"
                />
                {errors.contact_phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.contact_phone.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Links & Social Media */}
        <div className="card">
          <h3 className="text-lg font-display font-semibold text-text-primary mb-6">
            Links & Social Media
          </h3>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                <Globe className="w-4 h-4 inline mr-2" />
                Website
              </label>
              <input
                type="url"
                {...register("website_url")}
                className="input-field w-full"
                placeholder="https://www.mijnwinkel.be"
              />
              {errors.website_url && (
                <p className="mt-1 text-sm text-red-500">{errors.website_url.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  <Facebook className="w-4 h-4 inline mr-2" />
                  Facebook
                </label>
                <input
                  type="url"
                  {...register("facebook_url")}
                  className="input-field w-full"
                  placeholder="https://facebook.com/mijnwinkel"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  <Instagram className="w-4 h-4 inline mr-2" />
                  Instagram
                </label>
                <input
                  type="url"
                  {...register("instagram_url")}
                  className="input-field w-full"
                  placeholder="https://instagram.com/mijnwinkel"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="card">
          <h3 className="text-lg font-display font-semibold text-text-primary mb-6 flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Afbeeldingen
          </h3>
          <p className="text-sm text-text-muted mb-6">
            Upload een logo en/of omslagfoto voor uw winkel.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Logo (vierkant)
              </label>
              <ImageUpload
                value={watch("logo_url") || ""}
                onChange={(url) => setValue("logo_url", url)}
                folder="shop-logos"
                aspectRatio="square"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Omslagfoto (16:9)
              </label>
              <ImageUpload
                value={watch("cover_image_url") || ""}
                onChange={(url) => setValue("cover_image_url", url)}
                folder="shop-covers"
                aspectRatio="wide"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col items-center gap-4">
          {submitError && (
            <p className="text-red-500 text-sm">{submitError}</p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full md:w-auto px-8 py-3 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Versturen...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Aanvraag versturen
              </>
            )}
          </button>
          <p className="text-xs text-text-muted text-center max-w-md">
            Na het versturen wordt uw aanvraag beoordeeld. Bij goedkeuring verschijnt uw winkel op de Ramadan Lights Gent website.
          </p>
        </div>
      </form>
    </motion.div>
  );
}
