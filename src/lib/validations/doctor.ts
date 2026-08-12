import { z } from "zod";
import { nigerianPhoneSchema } from "./phone";

export const doctorSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(80),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: nigerianPhoneSchema,
  specializationId: z.string().min(1, "Select a specialization"),
  experienceYears: z.coerce.number().min(0, "Must be 0 or more").max(60),
  fee: z.coerce.number().min(0, "Must be 0 or more").max(1000000),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  available: z.boolean(),
  bio: z.string().trim().max(500, "Keep the bio under 500 characters"),
});

export type DoctorValues = z.infer<typeof doctorSchema>;
