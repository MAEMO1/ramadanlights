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

    const { data: shopPartners, error } = await supabase
      .from("shop_partners")
      .select("id, name, slug, description, address, city, postal_code, latitude, longitude, category, partner_tier, tier_expires_at, ramadan_special, ramadan_special_discount, website_url, facebook_url, instagram_url, logo_url, cover_image_url, opening_hours")
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

    return NextResponse.json({
      success: true,
      data: shopPartners,
    });
  } catch (error) {
    console.error("List error:", error);
    return NextResponse.json(
      { success: false, message: "Er is een fout opgetreden" },
      { status: 500 }
    );
  }
}
