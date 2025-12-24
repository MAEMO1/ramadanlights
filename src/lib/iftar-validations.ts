import { z } from "zod";

export const iftarFormSchema = z.object({
  // Verplichte velden
  mosque_name: z
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
  iftar_time: z
    .string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Ongeldige tijd (gebruik HH:MM formaat)"),
  contact_name: z
    .string()
    .min(2, "Naam moet minimaal 2 tekens bevatten")
    .max(100, "Naam mag maximaal 100 tekens bevatten"),
  contact_email: z
    .string()
    .email("Ongeldig e-mailadres"),

  // Optionele velden
  contact_phone: z
    .string()
    .regex(/^[\d\s\-+()]*$/, "Ongeldig telefoonnummer")
    .max(20, "Telefoonnummer mag maximaal 20 tekens bevatten")
    .optional()
    .or(z.literal("")),
  capacity: z
    .number()
    .int()
    .positive("Capaciteit moet een positief getal zijn")
    .max(10000, "Capaciteit mag maximaal 10000 zijn")
    .optional()
    .nullable(),
  is_free: z.boolean().default(true),
  price_info: z
    .string()
    .max(200, "Prijsinformatie mag maximaal 200 tekens bevatten")
    .optional()
    .or(z.literal("")),
  description: z
    .string()
    .max(1000, "Beschrijving mag maximaal 1000 tekens bevatten")
    .optional()
    .or(z.literal("")),

  // Toegankelijkheid
  for_men: z.boolean().default(true),
  for_women: z.boolean().default(true),
  for_families: z.boolean().default(true),
});

export type IftarFormData = z.infer<typeof iftarFormSchema>;
