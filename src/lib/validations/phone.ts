import { z } from "zod";

export const NG_PHONE_PLACEHOLDER = "0803 123 4567";

const NG_PHONE_RE = /^(?:\+?234|0)[789][01]\d{8}$/;

/** Formats a Nigerian number to the local display form: 0803 123 4567 */
export function formatNigerianPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  const local = digits.startsWith("234")
    ? `0${digits.slice(3)}`
    : digits.startsWith("0")
      ? digits
      : digits.length === 10
        ? `0${digits}`
        : digits;
  if (local.length !== 11) return value;
  return `${local.slice(0, 4)} ${local.slice(4, 7)} ${local.slice(7)}`;
}

/** Normalises any accepted Nigerian format to +2348031234567 */
export function toInternationalNigerianPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("234")) return `+${digits}`;
  if (digits.startsWith("0")) return `+234${digits.slice(1)}`;
  return `+234${digits}`;
}

export const nigerianPhoneSchema = z
  .string()
  .trim()
  .min(1, "Phone is required")
  .transform((v) => v.replace(/[\s()-]/g, ""))
  .refine((v) => NG_PHONE_RE.test(v), {
    message: "Enter a valid Nigerian number, e.g. 0803 123 4567",
  })
  .transform(toInternationalNigerianPhone);
