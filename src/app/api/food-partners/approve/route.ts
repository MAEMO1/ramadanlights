import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");
  const action = searchParams.get("action");

  if (!token || !action) {
    return NextResponse.redirect(
      new URL("/wat-te-doen?error=invalid", request.url)
    );
  }

  if (action !== "approve" && action !== "reject") {
    return NextResponse.redirect(
      new URL("/wat-te-doen?error=invalid", request.url)
    );
  }

  const supabase = getSupabaseAdmin();

    if (!supabase) {
    return NextResponse.redirect(
      new URL("/wat-te-doen?error=config", request.url)
    );
  }

  try {
    // Find the food partner by approval token
    const { data: foodPartner, error: findError } = await supabase
      .from("food_partners")
      .select("*")
      .eq("approval_token", token)
      .single();

    if (findError || !foodPartner) {
      return NextResponse.redirect(
        new URL("/wat-te-doen?error=notfound", request.url)
      );
    }

    // Check if already processed
    if (foodPartner.status !== "pending") {
      return NextResponse.redirect(
        new URL(
          `/food-partner-goedgekeurd?status=${foodPartner.status}&already=true`,
          request.url
        )
      );
    }

    // Update status
    const updateData =
      action === "approve"
        ? { status: "approved", approved_at: new Date().toISOString() }
        : { status: "rejected", rejected_at: new Date().toISOString() };

    const { error: updateError } = await supabase
      .from("food_partners")
      .update(updateData)
      .eq("id", foodPartner.id);

    if (updateError) {
      console.error("Update error:", updateError);
      return NextResponse.redirect(
        new URL("/wat-te-doen?error=update", request.url)
      );
    }

    // Redirect to confirmation page
    return NextResponse.redirect(
      new URL(
        `/food-partner-goedgekeurd?status=${action === "approve" ? "approved" : "rejected"}&name=${encodeURIComponent(foodPartner.name)}`,
        request.url
      )
    );
  } catch (error) {
    console.error("Approve error:", error);
    return NextResponse.redirect(
      new URL("/wat-te-doen?error=unknown", request.url)
    );
  }
}
