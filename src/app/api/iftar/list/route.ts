import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

// Force dynamic - don't cache this route
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log("Iftar list API called");
    console.log("NEXT_PUBLIC_SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "SET" : "NOT SET");
    console.log("SUPABASE_SERVICE_ROLE_KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "SET" : "NOT SET");

    const supabase = getSupabaseAdmin();

    // Return empty list if Supabase is not configured
    if (!supabase) {
      console.log("Supabase client is null - returning empty array");
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    console.log("Supabase client created successfully");

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

    console.log("Query result - error:", error);
    console.log("Query result - count:", iftarEvents?.length ?? 0);

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { success: false, message: "Er is een fout opgetreden" },
        { status: 500 }
      );
    }

    console.log("Returning", iftarEvents?.length ?? 0, "iftars");

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
