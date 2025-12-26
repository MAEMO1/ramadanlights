import { z } from "zod";

export const shopPartnerFormSchema = z.object({
  // Required fields
  name: z
    .string()
    .min(2, "Naam moet minimaal 2 tekens bevatten")
    .max(200, "Naam mag maximaal 200 tekens bevatten"),
  address: z
    .string()
    .min(5, "Adres moet minimaal 5 tekens bevatten")
    .max(300, "Adres mag maximaal 300 tekens bevatten"),
  city: z
    .string()
    .min(2, "Stad moet minimaal 2 tekens bevatten")
    .max(100, "Stad mag maximaal 100 tekens bevatten")
    .default("Gent"),
  postal_code: z
    .string()
    .regex(/^[0-9]{4}$/, "Postcode moet 4 cijfers bevatten")
    .optional()
    .or(z.literal("")),
  category: z.enum([
    "decor",
    "clothing",
    "spiritual",
    "gifts",
    "beauty",
    "kids",
    "tech",
    "other",
  ]),
  contact_name: z
    .string()
    .min(2, "Naam moet minimaal 2 tekens bevatten")
    .max(100, "Naam mag maximaal 100 tekens bevatten"),
  contact_email: z.string().email("Ongeldig e-mailadres"),
  contact_phone: z
    .string()
    .regex(/^[\d\s\-+()]*$/, "Ongeldig telefoonnummer")
    .min(9, "Telefoonnummer moet minimaal 9 tekens bevatten")
    .max(20, "Telefoonnummer mag maximaal 20 tekens bevatten")
    .optional()
    .or(z.literal("")),

  // Optional fields
  description: z
    .string()
    .max(1000, "Beschrijving mag maximaal 1000 tekens bevatten")
    .optional()
    .or(z.literal("")),

  // Ramadan special (available for all, but highlighted for paid tiers)
  ramadan_special: z
    .string()
    .max(500, "Ramadan actie mag maximaal 500 tekens bevatten")
    .optional()
    .or(z.literal("")),
  ramadan_special_discount: z
    .string()
    .max(50, "Korting mag maximaal 50 tekens bevatten")
    .optional()
    .or(z.literal("")),

  // Links
  website_url: z.string().url("Ongeldige URL").optional().or(z.literal("")),
  facebook_url: z.string().url("Ongeldige URL").optional().or(z.literal("")),
  instagram_url: z.string().url("Ongeldige URL").optional().or(z.literal("")),

  // Images (URLs - upload handled separately)
  logo_url: z.string().url("Ongeldige URL").optional().or(z.literal("")),
  cover_image_url: z.string().url("Ongeldige URL").optional().or(z.literal("")),
});

export type ShopPartnerFormData = z.infer<typeof shopPartnerFormSchema>;
