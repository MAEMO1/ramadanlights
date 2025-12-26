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

    const { data: foodPartners, error } = await supabase
      .from("food_partners")
      .select("*")
      .eq("status", "approved")
      .order("partner_tier", { ascending: false })
      .order("name", { ascending: true });

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { success: false, message: "Er is een fout opgetreden" },
        { status: 500 }
      );
    }

    // Sort by tier priority (partner_plus > partner > free)
    const tierOrder: Record<string, number> = {
      partner_plus: 0,
      partner: 1,
      free: 2,
    };

    const sortedPartners = foodPartners?.sort((a, b) => {
      const tierDiff = tierOrder[a.partner_tier] - tierOrder[b.partner_tier];
      if (tierDiff !== 0) return tierDiff;
      return a.name.localeCompare(b.name);
    });

    return NextResponse.json({
      success: true,
      data: sortedPartners || [],
    });
  } catch (error) {
    console.error("List error:", error);
    return NextResponse.json(
      { success: false, message: "Er is een fout opgetreden" },
      { status: 500 }
    );
  }
}
