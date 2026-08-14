export type Role = "ADMIN" | "DOCTOR" | "PATIENT";

export type AppointmentStatus =
  | "PENDING"
  | "APPROVED"
  | "COMPLETED"
  | "CANCELLED";

export type Gender = "MALE" | "FEMALE" | "OTHER";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  phone?: string | undefined;
  createdAt: string;
}

export interface Specialization {
  id: string;
  name: string;
  description: string;
}

export interface Doctor {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  specializationId: string;
  specializationName: string;
  experienceYears: number;
  fee: number;
  bio: string;
  available: boolean;
  gender: Gender;
  availableSlots: string[];
  createdAt: string;
}

export interface Patient {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  gender: Gender;
  dateOfBirth: string;
  address: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  patientId: string;
  patientName: string;
  specializationName: string;
  date: string; // yyyy-MM-dd
  time: string; // HH:mm
  reason: string;
  status: AppointmentStatus;
  cancelReason?: string | undefined;
  createdAt: string;
}

export interface PatientReview {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  patientName: string;
  doctorName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface DashboardStats {
  totalDoctors: number;
  totalPatients: number;
  totalAppointments: number;
  pending: number;
  approved: number;
  completed: number;
  cancelled: number;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  profileId: string;
}
