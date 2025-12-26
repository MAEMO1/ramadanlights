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
      .select("*")
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
