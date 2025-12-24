import { z } from "zod";

export const sponsorFormSchema = z.object({
  companyName: z
    .string()
    .min(2, "Bedrijfsnaam moet minimaal 2 karakters bevatten")
    .max(100, "Bedrijfsnaam mag maximaal 100 karakters bevatten"),
  vatNumber: z
    .string()
    .regex(
      /^BE[0-9]{10}$/,
      "BTW-nummer moet het formaat BE0123456789 hebben"
    ),
  contactPerson: z
    .string()
    .min(2, "Naam moet minimaal 2 karakters bevatten")
    .max(100, "Naam mag maximaal 100 karakters bevatten"),
  email: z
    .string()
    .email("Ongeldig e-mailadres"),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[+]?[0-9\s-]{9,15}$/.test(val),
      "Ongeldig telefoonnummer"
    ),
  message: z
    .string()
    .max(500, "Bericht mag maximaal 500 karakters bevatten")
    .optional(),
});

export type SponsorFormData = z.infer<typeof sponsorFormSchema>;

export const packageInfo = {
  gold: {
    name: "Goud",
    price: "€500",
    benefits: [
      "Groot logo op de website",
      "Vermelding op alle promotiematerialen",
      "Social media shout-out",
      "VIP uitnodiging voor het openingsevent",
    ],
  },
  silver: {
    name: "Zilver",
    price: "€300",
    benefits: [
      "Medium logo op de website",
      "Vermelding op promotiematerialen",
      "Social media vermelding",
    ],
  },
  bronze: {
    name: "Brons",
    price: "€150",
    benefits: [
      "Logo op de website",
      "Vermelding in de sponsorlijst",
    ],
  },
};
