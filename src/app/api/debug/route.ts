import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;

  const supabase = getSupabaseAdmin();

  let dbResult = null;
  let dbError = null;

  if (supabase) {
    const { data, error } = await supabase
      .from("iftar_events")
      .select("id, mosque_name, status")
      .limit(5);

    dbResult = data;
    dbError = error;
  }

  return NextResponse.json({
    env: {
      supabaseUrl: supabaseUrl || "NOT SET",
      hasServiceKey,
    },
    supabaseClientCreated: !!supabase,
    dbResult,
    dbError,
  });
}
