import { z } from "zod";

export function requiredText(label: string) {
  return z.string().trim().min(1, `${label} is required`);
}

export const isoDateStringSchema = z
  .string()
  .refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "Enter a valid date",
  });
