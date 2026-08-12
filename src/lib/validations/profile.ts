import { z } from "zod";
import { nigerianPhoneSchema } from "./phone";

export const patientProfileSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(80),
  phone: nigerianPhoneSchema,
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  dateOfBirth: z.string().trim().max(20).optional().or(z.literal("")),
  address: z.string().trim().max(200).optional().or(z.literal("")),
});

export const doctorProfileSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(80),
  phone: nigerianPhoneSchema,
  experienceYears: z.coerce.number().min(0).max(60),
  fee: z.coerce.number().min(0).max(1000000),
  available: z.boolean(),
  availableSlots: z
    .array(z.string())
    .min(1, "Select at least one available time slot"),
  bio: z.string().trim().max(500),
});

export type PatientProfileValues = z.infer<typeof patientProfileSchema>;
export type DoctorProfileValues = z.infer<typeof doctorProfileSchema>;
