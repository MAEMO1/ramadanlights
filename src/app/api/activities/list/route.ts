import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

// Force dynamic - don't cache this route
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Return empty list if Supabase is not configured
    const supabase = getSupabaseAdmin();

    if (!supabase) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    // Get today's date for filtering
    const today = new Date().toISOString().split("T")[0];

    const { data: activities, error } = await supabase
      .from("activities")
      .select("id, title, description, activity_type, location_name, address, city, postal_code, latitude, longitude, event_date, start_time, end_time, is_recurring, recurrence_pattern, recurrence_end_date, capacity, is_free, price, for_men, for_women, for_families, for_youth, organizer_name, registration_url, website_url, facebook_url, instagram_url, cover_image_url, created_at")
      .eq("status", "approved")
      .gte("event_date", today)
      .order("event_date", { ascending: true });

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { success: false, message: "Er is een fout opgetreden" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: activities || [],
    });
  } catch (error) {
    console.error("List error:", error);
    return NextResponse.json(
      { success: false, message: "Er is een fout opgetreden" },
      { status: 500 }
    );
  }
}
