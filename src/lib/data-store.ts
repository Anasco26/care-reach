import { supabase } from "@/integrations/supabase/client";
import type {
  Appointment,
  AppointmentStatus,
  DashboardStats,
  Doctor,
  Gender,
  Patient,
  PatientReview,
  Specialization,
} from "@/types";

/* ---------- helpers ---------- */

type Row = Record<string, unknown>;

function assertOk(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

function mapSpecialization(r: Row): Specialization {
  return {
    id: r["id"] as string,
    name: r["name"] as string,
    description: (r["description"] as string) ?? "",
  };
}

function mapDoctor(r: Row): Doctor {
  const spec = r["specializations"] as { id: string; name: string } | null;
  return {
    id: r["id"] as string,
    userId: (r["user_id"] as string) ?? "",
    name: r["name"] as string,
    email: r["email"] as string,
    phone: (r["phone"] as string) ?? "",
    specializationId: (r["specialization_id"] as string) ?? "",
    specializationName: spec?.name ?? "General",
    experienceYears: Number(r["experience_years"] ?? 0),
    fee: Number(r["fee"] ?? 0),
    bio: (r["bio"] as string) ?? "",
    available: Boolean(r["available"]),
    gender: (r["gender"] as Gender) ?? "OTHER",
    availableSlots: ((r["available_slots"] as string[]) ?? []).map((t) =>
      t.slice(0, 5),
    ),
    createdAt: (r["created_at"] as string) ?? "",
  };
}

function mapPatient(r: Row): Patient {
  return {
    id: r["id"] as string,
    userId: (r["user_id"] as string) ?? "",
    name: r["name"] as string,
    email: r["email"] as string,
    phone: (r["phone"] as string) ?? "",
    gender: (r["gender"] as Gender) ?? "OTHER",
    dateOfBirth: (r["date_of_birth"] as string) ?? "",
    address: (r["address"] as string) ?? "",
    createdAt: (r["created_at"] as string) ?? "",
  };
}

function mapAppointment(r: Row): Appointment {
  const doctor = r["doctors"] as
    | { name: string; specializations: { name: string } | null }
    | null;
  const patient = r["patients"] as { name: string } | null;
  return {
    id: r["id"] as string,
    doctorId: r["doctor_id"] as string,
    doctorName: doctor?.name ?? "Doctor",
    patientId: r["patient_id"] as string,
    patientName: patient?.name ?? "Patient",
    specializationName: doctor?.specializations?.name ?? "General",
    date: r["date"] as string,
    time: (r["time"] as string).slice(0, 5),
    reason: (r["reason"] as string) ?? "",
    status: r["status"] as AppointmentStatus,
    cancelReason: (r["cancel_reason"] as string) ?? undefined,
    createdAt: (r["created_at"] as string) ?? "",
  };
}

const DOCTOR_SELECT = "*, specializations(id, name)";
const APPOINTMENT_SELECT =
  "*, doctors(name, specializations(name)), patients(name)";

/* ---------- specializations ---------- */
export async function getSpecializations(): Promise<Specialization[]> {
  const { data, error } = await supabase
    .from("specializations")
    .select("*")
    .order("name");
  assertOk(error);
  return (data ?? []).map(mapSpecialization);
}

/* ---------- doctors ---------- */
export async function listDoctors(): Promise<Doctor[]> {
  const { data, error } = await supabase
    .from("doctors")
    .select(DOCTOR_SELECT)
    .order("created_at");
  assertOk(error);
  return (data ?? []).map(mapDoctor);
}

export async function getDoctor(id: string): Promise<Doctor | null> {
  if (!id) return null;
  const { data, error } = await supabase
    .from("doctors")
    .select(DOCTOR_SELECT)
    .eq("id", id)
    .maybeSingle();
  assertOk(error);
  return data ? mapDoctor(data) : null;
}

export async function getDoctorByUserId(userId: string): Promise<Doctor | null> {
  const { data, error } = await supabase
    .from("doctors")
    .select(DOCTOR_SELECT)
    .eq("user_id", userId)
    .maybeSingle();
  assertOk(error);
  return data ? mapDoctor(data) : null;
}

export type DoctorInput = Omit<
  Doctor,
  "id" | "userId" | "createdAt" | "specializationName" | "availableSlots"
> & { availableSlots?: string[] };

function doctorPayload(input: Partial<DoctorInput>) {
  const payload: Row = {};
  if (input.name !== undefined) payload["name"] = input.name;
  if (input.email !== undefined) payload["email"] = input.email;
  if (input.phone !== undefined) payload["phone"] = input.phone;
  if (input.specializationId !== undefined)
    payload["specialization_id"] = input.specializationId;
  if (input.experienceYears !== undefined)
    payload["experience_years"] = input.experienceYears;
  if (input.fee !== undefined) payload["fee"] = input.fee;
  if (input.bio !== undefined) payload["bio"] = input.bio;
  if (input.available !== undefined) payload["available"] = input.available;
  if (input.gender !== undefined) payload["gender"] = input.gender;
  if (input.availableSlots !== undefined)
    payload["available_slots"] = input.availableSlots;
  return payload;
}

export async function createDoctor(input: DoctorInput): Promise<Doctor> {
  const { data, error } = await supabase
    .from("doctors")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .insert(doctorPayload(input) as any)
    .select(DOCTOR_SELECT)
    .single();
  assertOk(error);
  return mapDoctor(data as Row);
}

export async function updateDoctor(id: string, input: Partial<DoctorInput>) {
  const { data, error } = await supabase
    .from("doctors")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .update(doctorPayload(input) as any)
    .eq("id", id)
    .select(DOCTOR_SELECT)
    .single();
  assertOk(error);
  return mapDoctor(data as Row);
}

export async function deleteDoctor(id: string) {
  const { error } = await supabase.from("doctors").delete().eq("id", id);
  assertOk(error);
}

/* ---------- patients ---------- */
export async function listPatients(): Promise<Patient[]> {
  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .order("created_at", { ascending: false });
  assertOk(error);
  return (data ?? []).map(mapPatient);
}

export async function getPatient(id: string): Promise<Patient | null> {
  if (!id) return null;
  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  assertOk(error);
  return data ? mapPatient(data) : null;
}

export async function getPatientByUserId(userId: string): Promise<Patient | null> {
  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  assertOk(error);
  return data ? mapPatient(data) : null;
}

export async function updatePatient(id: string, input: Partial<Patient>) {
  const payload: Row = {};
  if (input.name !== undefined) payload["name"] = input.name;
  if (input.phone !== undefined) payload["phone"] = input.phone;
  if (input.gender !== undefined) payload["gender"] = input.gender;
  if (input.address !== undefined) payload["address"] = input.address;
  if (input.dateOfBirth !== undefined)
    payload["date_of_birth"] = input.dateOfBirth === "" ? null : input.dateOfBirth;
  const { data, error } = await supabase
    .from("patients")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .update(payload as any)
    .eq("id", id)
    .select("*")
    .single();
  assertOk(error);
  return mapPatient(data as Row);
}

/* ---------- appointments ---------- */
export async function listAppointments(): Promise<Appointment[]> {
  const { data, error } = await supabase
    .from("appointments")
    .select(APPOINTMENT_SELECT)
    .order("date", { ascending: false })
    .order("time", { ascending: false });
  assertOk(error);
  return (data ?? []).map(mapAppointment);
}

export async function listAppointmentsByDoctor(doctorId: string) {
  if (!doctorId) return [];
  const { data, error } = await supabase
    .from("appointments")
    .select(APPOINTMENT_SELECT)
    .eq("doctor_id", doctorId)
    .order("date", { ascending: false })
    .order("time", { ascending: false });
  assertOk(error);
  return (data ?? []).map(mapAppointment);
}

export async function listAppointmentsByPatient(patientId: string) {
  if (!patientId) return [];
  const { data, error } = await supabase
    .from("appointments")
    .select(APPOINTMENT_SELECT)
    .eq("patient_id", patientId)
    .order("date", { ascending: false })
    .order("time", { ascending: false });
  assertOk(error);
  return (data ?? []).map(mapAppointment);
}

export async function getBookedSlots(
  doctorId: string,
  date: string,
): Promise<string[]> {
  if (!doctorId || !date) return [];
  const { data, error } = await supabase.rpc("booked_slots", {
    _doctor_id: doctorId,
    _date: date,
  });
  assertOk(error);
  return (data ?? []).map((r) => (r.slot ?? "").slice(0, 5)).filter(Boolean);
}

export interface BookingInput {
  doctorId: string;
  patientId: string;
  date: string;
  time: string;
  reason: string;
}

export async function createAppointment(input: BookingInput) {
  const { data, error } = await supabase
    .from("appointments")
    .insert({
      doctor_id: input.doctorId,
      patient_id: input.patientId,
      date: input.date,
      time: input.time,
      reason: input.reason,
      status: "PENDING",
    })
    .select(APPOINTMENT_SELECT)
    .single();
  if (error) {
    if (error.code === "23505")
      throw new Error("That time slot is already booked. Please pick another.");
    throw new Error(error.message);
  }
  return mapAppointment(data as Row);
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus,
  cancelReason?: string,
) {
  const payload: Row = { status };
  if (cancelReason !== undefined) payload["cancel_reason"] = cancelReason;
  const { data, error } = await supabase
    .from("appointments")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .update(payload as any)
    .eq("id", id)
    .select(APPOINTMENT_SELECT)
    .single();
  assertOk(error);
  return mapAppointment(data as Row);
}

export async function deleteAppointment(id: string) {
  const { error } = await supabase.from("appointments").delete().eq("id", id);
  assertOk(error);
}

/* ---------- patient reviews ---------- */
const REVIEW_SELECT = "*, patients(name), doctors(name)";

function mapReview(r: Row): PatientReview {
  const patient = r["patients"] as { name: string } | null;
  const doctor = r["doctors"] as { name: string } | null;
  return {
    id: r["id"] as string,
    appointmentId: r["appointment_id"] as string,
    patientId: r["patient_id"] as string,
    doctorId: r["doctor_id"] as string,
    patientName: patient?.name ?? "Patient",
    doctorName: doctor?.name ?? "Doctor",
    rating: Number(r["rating"]),
    comment: r["comment"] as string,
    createdAt: r["created_at"] as string,
  };
}

export async function listReviews(patientId?: string): Promise<PatientReview[]> {
  let query = supabase.from("patient_reviews").select(REVIEW_SELECT).order("created_at", { ascending: false });
  if (patientId) query = query.eq("patient_id", patientId);
  const { data, error } = await query;
  assertOk(error);
  return (data ?? []).map(mapReview);
}

export async function createReview(input: {
  appointmentId: string;
  patientId: string;
  doctorId: string;
  rating: number;
  comment: string;
}) {
  const { data, error } = await supabase.from("patient_reviews").insert({
    appointment_id: input.appointmentId,
    patient_id: input.patientId,
    doctor_id: input.doctorId,
    rating: input.rating,
    comment: input.comment.trim(),
  }).select(REVIEW_SELECT).single();
  assertOk(error);
  return mapReview(data as Row);
}

/* ---------- dashboard aggregation ---------- */
export interface DashboardData {
  stats: DashboardStats;
  monthly: { month: string; appointments: number }[];
  status: { name: string; value: number; key: AppointmentStatus }[];
  gender: { name: string; value: number }[];
  specialization: { name: string; doctors: number; appointments: number }[];
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export async function getDashboardData(): Promise<DashboardData> {
  const [doctors, patients, appointments, specs] = await Promise.all([
    listDoctors(),
    listPatients(),
    listAppointments(),
    getSpecializations(),
  ]);

  const by = (s: AppointmentStatus) =>
    appointments.filter((a) => a.status === s).length;

  const stats: DashboardStats = {
    totalDoctors: doctors.length,
    totalPatients: patients.length,
    totalAppointments: appointments.length,
    pending: by("PENDING"),
    approved: by("APPROVED"),
    completed: by("COMPLETED"),
    cancelled: by("CANCELLED"),
  };

  const monthly: { month: string; appointments: number }[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const prefix = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthly.push({
      month: MONTHS[d.getMonth()] ?? "",
      appointments: appointments.filter((a) => a.date.startsWith(prefix)).length,
    });
  }

  const countGender = (g: Gender) =>
    patients.filter((p) => p.gender === g).length;

  return {
    stats,
    monthly,
    status: [
      { name: "Pending", value: stats.pending, key: "PENDING" },
      { name: "Approved", value: stats.approved, key: "APPROVED" },
      { name: "Completed", value: stats.completed, key: "COMPLETED" },
      { name: "Cancelled", value: stats.cancelled, key: "CANCELLED" },
    ],
    gender: [
      { name: "Female", value: countGender("FEMALE") },
      { name: "Male", value: countGender("MALE") },
      { name: "Other", value: countGender("OTHER") },
    ],
    specialization: specs.map((s) => ({
      name: s.name,
      doctors: doctors.filter((d) => d.specializationId === s.id).length,
      appointments: appointments.filter((a) => a.specializationName === s.name)
        .length,
    })),
  };
}
