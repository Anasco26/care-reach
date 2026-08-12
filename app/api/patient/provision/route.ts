import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { getSupabaseUserContext } from "@/lib/server-auth.server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { name?: string; phone?: string };
    const { userId, claims } = await getSupabaseUserContext(request);
    const email = (claims["email"] as string | undefined) ?? "";

    await supabaseAdmin
      .from("profiles")
      .upsert({ id: userId, name: body.name ?? "", email, phone: body.phone ?? "" });

    await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: userId, role: "PATIENT" }, { onConflict: "user_id,role" });

    const { data: existing } = await supabaseAdmin
      .from("patients")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (!existing) {
      await supabaseAdmin.from("patients").insert({
        user_id: userId,
        name: body.name ?? "",
        email,
        phone: body.phone ?? "",
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not provision patient account";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
