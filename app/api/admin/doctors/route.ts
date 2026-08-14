import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { getSupabaseUserContext } from "@/lib/server-auth.server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      phone?: string;
      specializationId?: string;
      experienceYears?: number;
      fee?: number;
      gender?: "MALE" | "FEMALE" | "OTHER";
      available?: boolean;
      bio?: string;
    };

    const { supabase, userId } = await getSupabaseUserContext(request);
    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "ADMIN",
    });
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const temporaryPassword = process.env.DOCTOR_PASSWORD;
    if (!temporaryPassword) throw new Error("DOCTOR_PASSWORD is not configured");
    let targetUserId: string | null = null;
    const created = await supabaseAdmin.auth.admin.createUser({
      email: body.email ?? "",
      password: temporaryPassword,
      email_confirm: true,
      user_metadata: { name: body.name ?? "" },
    });

    if (created.error) {
      const list = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
      const match = list.data?.users.find(
        (u) => u.email?.toLowerCase() === (body.email ?? "").toLowerCase(),
      );
      if (!match) throw new Error(created.error.message);
      targetUserId = match.id;
    } else {
      targetUserId = created.data.user?.id ?? null;
    }

    if (!targetUserId) throw new Error("Could not create the doctor's account");

    await supabaseAdmin
      .from("profiles")
      .upsert({
        id: targetUserId,
        name: body.name ?? "",
        email: body.email ?? "",
        phone: body.phone ?? "",
      });

    await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: targetUserId, role: "DOCTOR" }, { onConflict: "user_id,role" });

    const { data: doctor, error } = await supabaseAdmin
      .from("doctors")
      .insert({
        user_id: targetUserId,
        name: body.name ?? "",
        email: body.email ?? "",
        phone: body.phone ?? "",
        specialization_id: body.specializationId ?? "",
        experience_years: body.experienceYears ?? 0,
        fee: body.fee ?? 0,
        gender: body.gender ?? "OTHER",
        available: body.available ?? true,
        bio: body.bio ?? "",
      })
      .select("id")
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json({ id: doctor.id, email: body.email, temporaryPassword });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create doctor account";
    const status = message === "Unauthorized" ? 401 : message === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
