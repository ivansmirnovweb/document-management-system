import { z } from "zod";
import { employerSchema, type Employer } from "@document-flow/shared";
import { apiRequest } from "@/lib/api";

const employersListSchema = z.array(employerSchema);

export const employersApi = {
  list(): Promise<Employer[]> {
    return apiRequest("/employers", { method: "GET" }, employersListSchema);
  },
};
