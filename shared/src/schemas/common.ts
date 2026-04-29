import { z } from "zod";

export function requiredText(label: string) {
  return z.string().trim().min(1, `${label} — обязательное поле`);
}

export const isoDateStringSchema = z
  .string()
  .refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "Укажите корректную дату",
  });
