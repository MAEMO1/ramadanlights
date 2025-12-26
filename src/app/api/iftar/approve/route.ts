import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");
  const action = searchParams.get("action");

  if (!token || !action) {
    return NextResponse.redirect(new URL("/iftar?error=invalid", request.url));
  }

  if (action !== "approve" && action !== "reject") {
    return NextResponse.redirect(new URL("/iftar?error=invalid", request.url));
  }

  const supabase = getSupabaseAdmin();

    if (!supabase) {
    return NextResponse.redirect(new URL("/iftar?error=config", request.url));
  }

  try {
    // Find the iftar event by approval token
    const { data: iftarEvent, error: findError } = await supabase
      .from("iftar_events")
      .select("*")
      .eq("approval_token", token)
      .single();

    if (findError || !iftarEvent) {
      return NextResponse.redirect(new URL("/iftar?error=notfound", request.url));
    }

    // Check if already processed
    if (iftarEvent.status !== "pending") {
      return NextResponse.redirect(
        new URL(`/iftar-goedgekeurd?status=${iftarEvent.status}&already=true`, request.url)
      );
    }

    // Update status
    const updateData =
      action === "approve"
        ? { status: "approved", approved_at: new Date().toISOString() }
        : { status: "rejected", rejected_at: new Date().toISOString() };

    const { error: updateError } = await supabase
      .from("iftar_events")
      .update(updateData)
      .eq("id", iftarEvent.id);

    if (updateError) {
      console.error("Update error:", updateError);
      return NextResponse.redirect(new URL("/iftar?error=update", request.url));
    }

    // Redirect to confirmation page
    return NextResponse.redirect(
      new URL(`/iftar-goedgekeurd?status=${action === "approve" ? "approved" : "rejected"}&name=${encodeURIComponent(iftarEvent.mosque_name)}`, request.url)
    );
  } catch (error) {
    console.error("Approve error:", error);
    return NextResponse.redirect(new URL("/iftar?error=unknown", request.url));
  }
}
