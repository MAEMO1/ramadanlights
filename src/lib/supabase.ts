import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Server-side client with service role key (for API routes)
// Creates a new client on each call to ensure env vars are available at runtime
export function getSupabaseAdmin(): SupabaseClient | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Supabase not configured:", { url: !!supabaseUrl, key: !!supabaseServiceKey });
    return null;
  }
  return createClient(supabaseUrl, supabaseServiceKey);
}

// Legacy export for backwards compatibility - creates client at runtime
export const supabaseAdmin = null as SupabaseClient | null;

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
