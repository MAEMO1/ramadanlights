import { z } from "zod";

export const activityFormSchema = z.object({
  // Required fields
  title: z
    .string()
    .min(2, "Titel moet minimaal 2 tekens bevatten")
    .max(200, "Titel mag maximaal 200 tekens bevatten"),
  activity_type: z.enum([
    "lecture",
    "workshop",
    "charity",
    "community",
    "youth",
    "sports",
    "other",
  ]),
  location_name: z
    .string()
    .min(2, "Locatienaam moet minimaal 2 tekens bevatten")
    .max(200, "Locatienaam mag maximaal 200 tekens bevatten"),
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
  event_date: z
    .string()
    .min(1, "Datum is verplicht")
    .refine((val) => !isNaN(Date.parse(val)), "Ongeldige datum"),
  organizer_name: z
    .string()
    .min(2, "Naam moet minimaal 2 tekens bevatten")
    .max(100, "Naam mag maximaal 100 tekens bevatten"),
  organizer_email: z.string().email("Ongeldig e-mailadres"),

  // Optional fields
  description: z
    .string()
    .max(2000, "Beschrijving mag maximaal 2000 tekens bevatten")
    .optional()
    .or(z.literal("")),
  start_time: z
    .string()
    .regex(
      /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
      "Ongeldige tijd (gebruik HH:MM formaat)"
    )
    .optional()
    .or(z.literal("")),
  end_time: z
    .string()
    .regex(
      /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
      "Ongeldige tijd (gebruik HH:MM formaat)"
    )
    .optional()
    .or(z.literal("")),
  organizer_phone: z
    .string()
    .regex(/^[\d\s\-+()]*$/, "Ongeldig telefoonnummer")
    .max(20, "Telefoonnummer mag maximaal 20 tekens bevatten")
    .optional()
    .or(z.literal("")),

  // Recurrence
  is_recurring: z.boolean().default(false),
  recurrence_pattern: z
    .enum(["daily", "weekly", "weekdays", "weekends"])
    .optional()
    .nullable(),
  recurrence_end_date: z.string().optional().or(z.literal("")),

  // Capacity & Pricing
  capacity: z
    .union([
      z
        .number()
        .int()
        .positive("Capaciteit moet een positief getal zijn")
        .max(10000, "Capaciteit mag maximaal 10000 zijn"),
      z.nan(),
      z.literal(""),
    ])
    .optional()
    .nullable()
    .transform((val) => {
      if (
        val === "" ||
        val === null ||
        val === undefined ||
        (typeof val === "number" && isNaN(val))
      ) {
        return null;
      }
      return val;
    }),
  is_free: z.boolean().default(true),
  price: z
    .string()
    .max(50, "Prijs mag maximaal 50 tekens bevatten")
    .optional()
    .or(z.literal("")),

  // Target Audience
  for_men: z.boolean().default(true),
  for_women: z.boolean().default(true),
  for_families: z.boolean().default(true),
  for_youth: z.boolean().default(false),

  // Links
  registration_url: z.string().url("Ongeldige URL").optional().or(z.literal("")),
  website_url: z.string().url("Ongeldige URL").optional().or(z.literal("")),
  facebook_url: z.string().url("Ongeldige URL").optional().or(z.literal("")),
  instagram_url: z.string().url("Ongeldige URL").optional().or(z.literal("")),

  // Images
  cover_image_url: z.string().url("Ongeldige URL").optional().or(z.literal("")),

  // Language
  language: z
    .enum(["nl", "fr", "en", "tr", "ar", "other"])
    .optional()
    .nullable(),
});

export type ActivityFormData = z.infer<typeof activityFormSchema>;
