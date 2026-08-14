import { readFileSync, existsSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

// pnpm does not load .env.local for plain Node scripts, so load it when a
// variable was not already supplied by the shell/CI environment.
for (const file of [".env", ".env.local"]) {
  if (!existsSync(file)) continue;
  const contents = readFileSync(file, "utf8");
  for (const line of contents.split(/\r?\n/)) {
    const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match || process.env[match[1]]) continue;
    const value = match[2].replace(/^(['"])(.*)\1$/, "$2");
    process.env[match[1]] = value;
  }
}

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;
const doctorEmail = process.env.DOCTOR_EMAIL || "doctor@care-reach.ng";
const doctorPassword = process.env.DOCTOR_PASSWORD;

const missing = [
  ["SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL", url],
  ["SUPABASE_SERVICE_ROLE_KEY", serviceKey],
  ["ADMIN_EMAIL", adminEmail],
  ["ADMIN_PASSWORD", adminPassword],
  ["DOCTOR_PASSWORD", doctorPassword],
].filter(([, value]) => !value).map(([name]) => name);

if (missing.length) {
  throw new Error(`Seed is not configured. Add these variables to .env.local: ${missing.join(", ")}.`);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function userFor(email, password, name) {
  const created = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name },
  });
  if (!created.error) return created.data.user;

  const listed = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (listed.error) throw listed.error;
  const existing = listed.data.users.find((user) => user.email?.toLowerCase() === email.toLowerCase());
  if (!existing) throw created.error;

  const updated = await supabase.auth.admin.updateUserById(existing.id, {
    password,
    email_confirm: true,
    user_metadata: { name },
  });
  if (updated.error) throw updated.error;
  return updated.data.user;
}

async function upsertProfileAndRole(user, name, email, phone, role) {
  const profile = await supabase.from("profiles").upsert({ id: user.id, name, email, phone });
  if (profile.error) throw profile.error;

  const roleRow = await supabase
    .from("user_roles")
    .upsert({ user_id: user.id, role }, { onConflict: "user_id,role" });
  if (roleRow.error) throw roleRow.error;
}

const adminName = "CareReach Administrator";
const doctorName = process.env.DOCTOR_NAME || "Dr. Amaka Nwosu";
const doctorPhone = process.env.DOCTOR_PHONE || "+234 801 000 0001";
const specialization = process.env.DOCTOR_SPECIALIZATION || "Cardiology";

const admin = await userFor(adminEmail, adminPassword, adminName);
await upsertProfileAndRole(admin, adminName, adminEmail, "", "ADMIN");

const doctor = await userFor(doctorEmail, doctorPassword, doctorName);
await upsertProfileAndRole(doctor, doctorName, doctorEmail, doctorPhone, "DOCTOR");

const specializationRow = await supabase
  .from("specializations")
  .select("id")
  .eq("name", specialization)
  .maybeSingle();
if (specializationRow.error) throw specializationRow.error;
if (!specializationRow.data) {
  const createdSpecialization = await supabase
    .from("specializations")
    .insert({ name: specialization, description: `${specialization} care` })
    .select("id")
    .single();
  if (createdSpecialization.error) throw createdSpecialization.error;
  specializationRow.data = createdSpecialization.data;
}

const doctorRecord = {
  user_id: doctor.id,
  name: doctorName,
  email: doctorEmail,
  phone: doctorPhone,
  specialization_id: specializationRow.data.id,
  experience_years: Number(process.env.DOCTOR_EXPERIENCE_YEARS || 12),
  fee: Number(process.env.DOCTOR_FEE || 25000),
  gender: process.env.DOCTOR_GENDER || "FEMALE",
  bio: process.env.DOCTOR_BIO || "Cardiologist focused on preventive heart care and arrhythmia management.",
  available: true,
};

const existingDoctor = await supabase
  .from("doctors")
  .select("id")
  .eq("email", doctorEmail)
  .maybeSingle();
if (existingDoctor.error) throw existingDoctor.error;

const doctorResult = existingDoctor.data
  ? await supabase.from("doctors").update(doctorRecord).eq("id", existingDoctor.data.id)
  : await supabase.from("doctors").insert(doctorRecord);
if (doctorResult.error) throw doctorResult.error;

console.log(`Seeded admin ${adminEmail} and doctor ${doctorEmail}.`);
