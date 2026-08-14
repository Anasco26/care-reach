import { createClient } from "@supabase/supabase-js";
import { execFileSync } from "node:child_process";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const dbUrl = process.env.SUPABASE_DB_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;
const doctorPassword = process.env.DOCTOR_PASSWORD;
const missing = [
  ["NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL", url],
  ["SUPABASE_DB_URL", dbUrl],
  ["SUPABASE_SERVICE_ROLE_KEY", serviceKey],
  ["ADMIN_EMAIL", adminEmail],
  ["ADMIN_PASSWORD", adminPassword],
  ["DOCTOR_PASSWORD", doctorPassword],
].filter(([, value]) => !value).map(([name]) => name);
if (missing.length) {
  throw new Error(`Production seed is not configured. Add these server-side deployment secrets: ${missing.join(", ")}.`);
}

console.log("Applying pending Supabase migrations...");
execFileSync("pnpm", ["dlx", "supabase@latest", "db", "push", "--db-url", dbUrl, "--yes"], { stdio: "inherit" });

const supabase = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
const doctors = [
  ["Dr. Amaka Nwosu", "amaka.nwosu@care-reach.ng", "+234 801 000 0001", "Cardiology", 12, 25000, "FEMALE", "Cardiologist focused on preventive heart care and arrhythmia management."],
  ["Dr. Tunde Adeyemi", "tunde.adeyemi@care-reach.ng", "+234 801 000 0002", "Dermatology", 8, 15000, "MALE", "Dermatologist specialising in medical and cosmetic skin treatments."],
  ["Dr. Nadia Okafor", "nadia.okafor@care-reach.ng", "+234 801 000 0003", "Pediatrics", 15, 18000, "FEMALE", "Paediatrician focused on childhood development and vaccination care."],
  ["Dr. Chinedu Eze", "chinedu.eze@care-reach.ng", "+234 801 000 0004", "Orthopedics", 10, 30000, "MALE", "Orthopedic surgeon treating sports injuries and joint replacement."],
  ["Dr. Aisha Bello", "aisha.bello@care-reach.ng", "+234 801 000 0005", "Neurology", 6, 28000, "FEMALE", "Neurologist with expertise in migraine, epilepsy and movement disorders."],
];
async function userFor(email, password, name) {
  const created = await supabase.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { name } });
  if (!created.error) return created.data.user;
  const listed = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (listed.error) throw listed.error;
  const existing = listed.data.users.find((user) => user.email?.toLowerCase() === email.toLowerCase());
  if (!existing) throw created.error;
  const updated = await supabase.auth.admin.updateUserById(existing.id, { password, user_metadata: { name } });
  if (updated.error) throw updated.error;
  return updated.data.user;
}
async function upsertIdentity(user, name, email, phone, role) {
  const { error: profileError } = await supabase.from("profiles").upsert({ id: user.id, name, email, phone });
  if (profileError) throw profileError;
  const { error: roleError } = await supabase.from("user_roles").upsert({ user_id: user.id, role }, { onConflict: "user_id,role" });
  if (roleError) throw roleError;
}
const admin = await userFor(adminEmail, adminPassword, "CareReach Administrator");
await upsertIdentity(admin, "CareReach Administrator", adminEmail, "", "ADMIN");
const { data: adminRoles } = await supabase.from("user_roles").select("user_id").eq("role", "ADMIN").neq("user_id", admin.id);
for (const row of adminRoles ?? []) await supabase.from("user_roles").delete().eq("user_id", row.user_id).eq("role", "ADMIN");
for (const [name, email, phone, specialization, experience, fee, gender, bio] of doctors) {
  const user = await userFor(email, doctorPassword, name);
  await upsertIdentity(user, name, email, phone, "DOCTOR");
  const { data: spec, error: specError } = await supabase.from("specializations").select("id").eq("name", specialization).single();
  if (specError) throw specError;
  const { data: existing } = await supabase.from("doctors").select("id").eq("email", email).maybeSingle();
  const record = { user_id: user.id, name, email, phone, specialization_id: spec.id, experience_years: experience, fee, gender, bio, available: true };
  const result = existing ? await supabase.from("doctors").update(record).eq("id", existing.id) : await supabase.from("doctors").insert(record);
  if (result.error) throw result.error;
}
console.log(`Seeded one admin (${adminEmail}) and ${doctors.length} Nigerian doctor accounts.`);
