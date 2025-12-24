import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Server-side client with service role key (for API routes)
// Returns null if environment variables are not configured
function getSupabaseAdmin(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseServiceKey) {
    return null;
  }
  return createClient(supabaseUrl, supabaseServiceKey);
}

export const supabaseAdmin = getSupabaseAdmin();

// Type definitions for iftar_events table
export interface IftarEvent {
  id: string;
  created_at: string;
  mosque_name: string;
  address: string;
  city: string;
  iftar_time: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  latitude: number | null;
  longitude: number | null;
  capacity: number | null;
  is_free: boolean;
  price_info: string | null;
  description: string | null;
  for_men: boolean;
  for_women: boolean;
  for_families: boolean;
  status: "pending" | "approved" | "rejected";
  approval_token: string;
  approved_at: string | null;
  rejected_at: string | null;
}
