import { supabase } from "@/integrations/supabase/client";

type CreateDoctorInput = {
  name: string;
  email: string;
  phone: string;
  specializationId: string;
  experienceYears: number;
  fee: number;
  gender: "MALE" | "FEMALE" | "OTHER";
  available: boolean;
  bio?: string;
};

async function getAccessToken() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error(error.message);
  const token = data.session?.access_token;
  if (!token) throw new Error("You must be signed in to complete this action");
  return token;
}

export async function createDoctorAccount(input: CreateDoctorInput) {
  const token = await getAccessToken();
  const response = await fetch("/api/admin/doctors", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });

  const payload = (await response.json().catch(() => null)) as
    | { error?: string; id?: string; email?: string; temporaryPassword?: string }
    | null;

  if (!response.ok) {
    throw new Error(payload?.error ?? "Could not create doctor account");
  }

  return payload;
}
