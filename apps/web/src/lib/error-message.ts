export function getErrorMessage(error: unknown, fallback = "Request failed"):
  string {
  if (typeof error === "string" && error.length > 0) {
    return error;
  }

  if (error instanceof Error && error.message.length > 0) {
    return error.message;
  }

  if (!error || typeof error !== "object") {
    return fallback;
  }

  const payload = error as {
    message?: unknown;
    error?: unknown;
    issues?: Array<{ message?: unknown; path?: unknown }>;
  };

  if (Array.isArray(payload.issues) && payload.issues.length > 0) {
    const firstIssue = payload.issues[0];
    if (typeof firstIssue.message === "string" && firstIssue.message.length > 0) {
      return firstIssue.message;
    }
    if (typeof firstIssue.path === "string" && firstIssue.path.length > 0) {
      return firstIssue.path;
    }
  }

  if (Array.isArray(payload.message) && payload.message.length > 0) {
    return String(payload.message[0]);
  }

  if (typeof payload.message === "string" && payload.message.length > 0) {
    return payload.message;
  }

  if (typeof payload.error === "string" && payload.error.length > 0) {
    return payload.error;
  }

  if (payload.error && typeof payload.error === "object") {
    const nested = payload.error as {
      message?: unknown;
      path?: unknown;
      statusCode?: unknown;
    };

    if (Array.isArray(nested.message) && nested.message.length > 0) {
      return String(nested.message[0]);
    }

    if (typeof nested.message === "string" && nested.message.length > 0) {
      return nested.message;
    }

    if (typeof nested.path === "string" && nested.path.length > 0) {
      const statusCode =
        typeof nested.statusCode === "number" ? nested.statusCode : "unknown";
      return `Request failed on ${nested.path} (status ${statusCode})`;
    }
  }

  return fallback;
}
