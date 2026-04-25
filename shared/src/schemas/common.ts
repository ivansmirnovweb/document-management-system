import { z } from "zod";

export const isoDateStringSchema = z
  .string()
  .refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "Expected ISO date string",
  });
