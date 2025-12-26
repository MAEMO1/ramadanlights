// Activity type categories
export type ActivityType =
  | "lecture"
  | "workshop"
  | "charity"
  | "community"
  | "youth"
  | "sports"
  | "other";

// Recurrence pattern types
export type RecurrencePattern = "daily" | "weekly" | "weekdays" | "weekends";

// Status types
export type ActivityStatus = "pending" | "approved" | "rejected";

// Main Activity interface
export interface Activity {
  id: string;
  created_at: string;
  updated_at: string;

  // Basic Information
  title: string;
  description: string | null;
  activity_type: ActivityType;

  // Location
  location_name: string;
  address: string;
  city: string;
  postal_code: string | null;
  latitude: number | null;
  longitude: number | null;

  // Date & Time
  event_date: string;
  start_time: string | null;
  end_time: string | null;

  // Recurrence
  is_recurring: boolean;
  recurrence_pattern: RecurrencePattern | null;
  recurrence_end_date: string | null;

  // Capacity & Pricing
  capacity: number | null;
  is_free: boolean;
  price: string | null;

  // Target Audience
  for_men: boolean;
  for_women: boolean;
  for_families: boolean;
  for_youth: boolean;

  // Organizer Information
  organizer_name: string;
  organizer_email: string;
  organizer_phone: string | null;

  // Links
  registration_url: string | null;
  website_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;

  // Images
  cover_image_url: string | null;

  // Status
  status: ActivityStatus;
  approval_token: string;
  approved_at: string | null;
  rejected_at: string | null;
  rejection_reason: string | null;
}

// Labels for activity types (Dutch)
export const activityTypeLabels: Record<ActivityType, string> = {
  lecture: "Lezing",
  workshop: "Workshop",
  charity: "Liefdadigheid",
  community: "Community",
  youth: "Jeugd",
  sports: "Sport",
  other: "Overig",
};

// Labels for recurrence patterns (Dutch)
export const recurrenceLabels: Record<RecurrencePattern, string> = {
  daily: "Dagelijks",
  weekly: "Wekelijks",
  weekdays: "Weekdagen",
  weekends: "Weekenden",
};

// Helper function to format date for display
export function formatActivityDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString("nl-BE", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

// Helper function to format time for display
export function formatActivityTime(
  startTime: string | null,
  endTime: string | null
): string {
  if (!startTime) return "";
  if (!endTime) return startTime.slice(0, 5);
  return `${startTime.slice(0, 5)} - ${endTime.slice(0, 5)}`;
}

// Helper function to check if activity is upcoming
export function isUpcomingActivity(eventDate: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const activityDate = new Date(eventDate);
  return activityDate >= today;
}

// Helper function to check if activity is today
export function isActivityToday(eventDate: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const activityDate = new Date(eventDate);
  activityDate.setHours(0, 0, 0, 0);
  return activityDate.getTime() === today.getTime();
}

// Helper function to check if activity is this weekend
export function isActivityThisWeekend(eventDate: string): boolean {
  const today = new Date();
  const activityDate = new Date(eventDate);
  const dayOfWeek = today.getDay();

  // Calculate days until Saturday
  const daysUntilSaturday = (6 - dayOfWeek + 7) % 7;
  const saturday = new Date(today);
  saturday.setDate(today.getDate() + daysUntilSaturday);
  saturday.setHours(0, 0, 0, 0);

  // Calculate Sunday
  const sunday = new Date(saturday);
  sunday.setDate(saturday.getDate() + 1);
  sunday.setHours(23, 59, 59, 999);

  return activityDate >= saturday && activityDate <= sunday;
}
