export interface IftarLocation {
  id: string;
  mosque_name: string;
  address: string;
  city: string;
  iftar_time: string;
  latitude: number | null;
  longitude: number | null;
  capacity: number | null;
  is_free: boolean;
  price_info: string | null;
  description: string | null;
  for_men: boolean;
  for_women: boolean;
  for_families: boolean;
  frequency: "daily" | "weekly" | "specific_days" | "one_time";
  days_of_week: string[];
  start_date: string | null;
  end_date: string | null;
  // Links
  registration_url: string | null;
  website_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
}

// Helper function to format frequency for display
export function formatFrequencyDisplay(frequency: string, daysOfWeek: string[]): string {
  const dayLabels: Record<string, string> = {
    monday: "Ma",
    tuesday: "Di",
    wednesday: "Wo",
    thursday: "Do",
    friday: "Vr",
    saturday: "Za",
    sunday: "Zo",
  };

  switch (frequency) {
    case "daily":
      return "Dagelijks";
    case "weekly":
    case "specific_days":
      const days = daysOfWeek.map((d) => dayLabels[d] || d).join(", ");
      return days || "Specifieke dagen";
    case "one_time":
      return "Eenmalig";
    default:
      return frequency;
  }
}
