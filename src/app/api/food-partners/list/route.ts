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
      .select(
        `
        id,
        name,
        slug,
        description,
        address,
        city,
        postal_code,
        latitude,
        longitude,
        category,
        cuisine_type,
        is_halal_certified,
        halal_certification_info,
        partner_tier,
        tier_expires_at,
        iftar_special,
        iftar_special_price,
        contact_phone,
        website_url,
        menu_url,
        reservation_url,
        facebook_url,
        instagram_url,
        uber_eats_url,
        deliveroo_url,
        logo_url,
        cover_image_url,
        opening_hours,
        created_at
      `
      )
      .eq("status", "approved")
      .order("partner_tier", { ascending: false }) // partner_plus first, then partner, then free
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
