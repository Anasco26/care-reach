import { z } from "zod";

export const bookingSchema = z.object({
  date: z.string().min(1, "Pick a date"),
  time: z.string().min(1, "Pick a time slot"),
  reason: z
    .string()
    .trim()
    .min(5, "Please describe the reason (min 5 characters)")
    .max(500, "Keep it under 500 characters"),
});

export const cancelSchema = z.object({
  cancelReason: z
    .string()
    .trim()
    .min(5, "A reason of at least 5 characters is required")
    .max(300),
});

export const optionalCancelSchema = z.object({
  cancelReason: z.string().trim().max(300).optional(),
});

export type BookingValues = z.infer<typeof bookingSchema>;
export type CancelValues = z.infer<typeof cancelSchema>;
