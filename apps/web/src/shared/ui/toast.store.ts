import { getErrorMessage } from "@/lib/error-message";

export type ToastVariant = "error" | "success" | "info";

export type ToastInput = {
  title: string;
  message?: string;
  variant?: ToastVariant;
  durationMs?: number;
};

export type ToastItem = Required<Pick<ToastInput, "title" | "variant">> & {
  id: string;
  message: string;
  createdAt: number;
};

const listeners = new Set<() => void>();
const toasts = new Map<string, ToastItem>();
const timers = new Map<string, ReturnType<typeof setTimeout>>();
const recentFingerprints = new Map<string, number>();
let snapshotCache: ToastItem[] = [];
let snapshotDirty = true;

let nextId = 0;

function emit() {
  snapshotDirty = true;
  listeners.forEach((listener) => listener());
}

function cleanupRecentFingerprints(now = Date.now()) {
  for (const [fingerprint, timestamp] of recentFingerprints) {
    if (now - timestamp > 2_500) {
      recentFingerprints.delete(fingerprint);
    }
  }
}

export function subscribeToasts(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getToastsSnapshot(): ToastItem[] {
  if (!snapshotDirty) {
    return snapshotCache;
  }

  snapshotCache = Array.from(toasts.values()).sort((left, right) => left.createdAt - right.createdAt);
  snapshotDirty = false;
  return snapshotCache;
}

export function dismissToast(id: string) {
  const timer = timers.get(id);
  if (timer) {
    clearTimeout(timer);
    timers.delete(id);
  }

  if (!toasts.delete(id)) {
    return;
  }

  emit();
}

export function clearToasts() {
  for (const id of Array.from(toasts.keys())) {
    dismissToast(id);
  }
}

export function showToast(input: ToastInput): string {
  const now = Date.now();
  cleanupRecentFingerprints(now);

  const variant = input.variant ?? "info";
  const message = input.message?.trim() || input.title;
  const fingerprint = `${variant}:${input.title}:${message}`;
  const lastShown = recentFingerprints.get(fingerprint);

  if (lastShown && now - lastShown < 1_500) {
    return "";
  }

  const id = `toast-${++nextId}`;
  const durationMs = input.durationMs ?? (variant === "error" ? 6_500 : 4_000);
  const toast: ToastItem = {
    id,
    title: input.title,
    message,
    variant,
    createdAt: now,
  };

  recentFingerprints.set(fingerprint, now);
  toasts.set(id, toast);
  emit();

  const timer = setTimeout(() => dismissToast(id), durationMs);
  timers.set(id, timer);

  return id;
}

export function showErrorToast(
  error: unknown,
  title = "Не удалось выполнить действие",
  fallback = "Проверьте сообщение об ошибке ниже.",
) {
  return showToast({
    title,
    message: getErrorMessage(error, fallback),
    variant: "error",
  });
}

export function showSuccessToast(message: string, title = "Готово") {
  return showToast({ title, message, variant: "success" });
}

export function showInfoToast(message: string, title = "Информация") {
  return showToast({ title, message, variant: "info" });
}
