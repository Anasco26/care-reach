import type { Appointment, AppointmentStatus } from "@/types";

export const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
];

export function toDateKey(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function isSlotTaken(
  appointments: Appointment[],
  doctorId: string,
  date: string,
  time: string,
) {
  return appointments.some(
    (a) =>
      a.doctorId === doctorId &&
      a.date === date &&
      a.time === time &&
      a.status !== "CANCELLED",
  );
}

export function availableSlots(
  appointments: Appointment[],
  doctorId: string,
  date: string,
) {
  return TIME_SLOTS.filter((t) => !isSlotTaken(appointments, doctorId, date, t));
}

export const statusLabel: Record<AppointmentStatus, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export function formatDate(date: string) {
  const [y, m, d] = date.split("-").map(Number) as [number, number, number];
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(time: string) {
  const [h, m] = time.split(":").map(Number) as [number, number];
  const suffix = h >= 12 ? "PM" : "AM";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:${String(m).padStart(2, "0")} ${suffix}`;
}

export function isUpcoming(a: Appointment) {
  return a.status === "PENDING" || a.status === "APPROVED";
}

export function initials(name: string) {
  return name
    .replace(/^Dr\.?\s+/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export function appointmentDateTime(a: Pick<Appointment, "date" | "time">) {
  const [y, m, d] = a.date.split("-").map(Number) as [number, number, number];
  const [h, min] = a.time.split(":").map(Number) as [number, number];
  return new Date(y, m - 1, d, h, min, 0, 0);
}

/** True once the appointment's scheduled start time has been reached. */
export function hasStarted(a: Pick<Appointment, "date" | "time">, now: Date = new Date()) {
  return appointmentDateTime(a).getTime() <= now.getTime();
}
