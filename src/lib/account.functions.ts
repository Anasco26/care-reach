import { supabase } from "@/integrations/supabase/client";

type ProvisionPatientInput = {
  name: string;
  phone: string;
};

async function getAccessToken() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error(error.message);
  const token = data.session?.access_token;
  if (!token) throw new Error("You must be signed in to complete this action");
  return token;
}

export async function provisionPatientAccount(input: ProvisionPatientInput) {
  const token = await getAccessToken();
  const response = await fetch("/api/patient/provision", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });

  const payload = (await response.json().catch(() => null)) as
    | { error?: string }
    | null;

  if (!response.ok) {
    throw new Error(payload?.error ?? "Could not provision patient account");
  }

  return payload ?? { ok: true };
}
