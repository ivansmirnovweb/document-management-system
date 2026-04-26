import { z } from "zod";

export class ApiError extends Error {
  status: number;
  details: unknown;

  constructor(message: string, status: number, details: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

function envelopeSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z
    .object({
      success: z.literal(true),
      data: dataSchema,
    })
    .strict();
}

function getApiUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:4000";
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${baseUrl}${normalizedPath}`;
}

async function readBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text.length > 0 ? text : null;
}

function getErrorMessage(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== "object") {
    return fallback;
  }

  const maybeError = payload as { message?: unknown; error?: unknown };

  if (Array.isArray(maybeError.message) && maybeError.message.length > 0) {
    return String(maybeError.message[0]);
  }

  if (typeof maybeError.message === "string" && maybeError.message.length > 0) {
    return maybeError.message;
  }

  if (typeof maybeError.error === "string" && maybeError.error.length > 0) {
    return maybeError.error;
  }

  return fallback;
}

export type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export async function apiFetch(path: string, options: ApiRequestOptions = {}): Promise<Response> {
  return fetch(getApiUrl(path), {
    ...options,
    credentials: "include",
    headers: {
      ...(options.body ? { "content-type": "application/json" } : {}),
      ...(options.headers ?? {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
}

export async function apiRequest<T extends z.ZodTypeAny>(
  path: string,
  options: ApiRequestOptions,
  dataSchema: T,
): Promise<z.infer<T>> {
  const response = await apiFetch(path, options);

  const payload = await readBody(response);

  if (!response.ok) {
    throw new ApiError(
      getErrorMessage(payload, `Request failed with status ${response.status}`),
      response.status,
      payload,
    );
  }

  const parsed = envelopeSchema(dataSchema).parse(payload) as { data: z.infer<T> };
  return parsed.data;
}

export function apiNoContent() {
  return z.null();
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
