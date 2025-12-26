import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

// Force dynamic - don't cache this route
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();

    // Return empty list if Supabase is not configured
    if (!supabase) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    const { data: iftarEvents, error } = await supabase
      .from("iftar_events")
      .select(
        `
        id,
        mosque_name,
        address,
        city,
        iftar_time,
        latitude,
        longitude,
        capacity,
        is_free,
        price_info,
        description,
        for_men,
        for_women,
        for_families,
        frequency,
        days_of_week,
        start_date,
        end_date,
        registration_url,
        website_url,
        facebook_url,
        instagram_url
      `
      )
      .eq("status", "approved")
      .order("mosque_name", { ascending: true });

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { success: false, message: "Er is een fout opgetreden" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: iftarEvents,
    });
  } catch (error) {
    console.error("List error:", error);
    return NextResponse.json(
      { success: false, message: "Er is een fout opgetreden" },
      { status: 500 }
    );
  }
}
