import { z } from "zod";

export const foodPartnerFormSchema = z.object({
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
    "restaurant",
    "bakery",
    "butcher",
    "supermarket",
    "catering",
    "cafe",
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
  cuisine_type: z
    .string()
    .max(100, "Keuken type mag maximaal 100 tekens bevatten")
    .optional()
    .or(z.literal("")),
  dish_types: z
    .array(z.enum([
      "burgers",
      "pizza",
      "kebab",
      "chicken",
      "shawarma",
      "grill",
      "pasta",
      "rice",
      "soup",
      "bread",
      "wraps",
      "fish",
      "vegetarian",
      "salads",
      "desserts",
      "snacks",
    ]))
    .optional()
    .default([]),
  is_halal_certified: z.boolean().default(false),
  halal_certification_info: z
    .string()
    .max(500, "Certificaat info mag maximaal 500 tekens bevatten")
    .optional()
    .or(z.literal("")),

  // Iftar special (available for all, but highlighted for paid tiers)
  iftar_special: z
    .string()
    .max(500, "Iftar special mag maximaal 500 tekens bevatten")
    .optional()
    .or(z.literal("")),
  iftar_special_price: z
    .string()
    .max(50, "Prijs mag maximaal 50 tekens bevatten")
    .optional()
    .or(z.literal("")),

  // Links
  website_url: z.string().url("Ongeldige URL").optional().or(z.literal("")),
  menu_url: z.string().url("Ongeldige URL").optional().or(z.literal("")),
  reservation_url: z.string().url("Ongeldige URL").optional().or(z.literal("")),
  facebook_url: z.string().url("Ongeldige URL").optional().or(z.literal("")),
  instagram_url: z.string().url("Ongeldige URL").optional().or(z.literal("")),
  uber_eats_url: z.string().url("Ongeldige URL").optional().or(z.literal("")),
  deliveroo_url: z.string().url("Ongeldige URL").optional().or(z.literal("")),
  takeaway_url: z.string().url("Ongeldige URL").optional().or(z.literal("")),

  // Images (URLs - upload handled separately)
  logo_url: z.string().url("Ongeldige URL").optional().or(z.literal("")),
  cover_image_url: z.string().url("Ongeldige URL").optional().or(z.literal("")),
});

export type FoodPartnerFormData = z.infer<typeof foodPartnerFormSchema>;
