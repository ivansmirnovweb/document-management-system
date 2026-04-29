"use client";

import { useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { dismissToast, getToastsSnapshot, subscribeToasts, type ToastItem } from "./toast.store";

function ToastCard({ toast }: { toast: ToastItem }) {
  const toneClasses =
    toast.variant === "error"
      ? "border-red-200 bg-red-50 text-red-950"
      : toast.variant === "success"
        ? "border-emerald-200 bg-emerald-50 text-emerald-950"
        : "border-sky-200 bg-sky-50 text-sky-950";

  return (
    <div
      role={toast.variant === "error" ? "alert" : "status"}
      aria-live={toast.variant === "error" ? "assertive" : "polite"}
      className={`pointer-events-auto rounded-2xl border px-4 py-3 shadow-lg backdrop-blur ${toneClasses}`}
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1 space-y-1">
          <div className="text-sm font-semibold">{toast.title}</div>
          <div className="text-sm leading-5 text-current/90">{toast.message}</div>
        </div>

        <button
          type="button"
          className="rounded-lg px-2 py-1 text-base leading-none opacity-70 transition hover:opacity-100"
          aria-label="Закрыть уведомление"
          onClick={() => dismissToast(toast.id)}
        >
          ×
        </button>
      </div>
    </div>
  );
}

export function ToastViewport() {
  const toasts = useSyncExternalStore(subscribeToasts, getToastsSnapshot, getToastsSnapshot);

  useEffect(() => {
    return () => {
      // Timers are owned by the store.
    };
  }, []);

  if (typeof window === "undefined" || toasts.length === 0) {
    return null;
  }

  return createPortal(
    <div className="fixed right-4 top-4 z-50 flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3">
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} />
      ))}
    </div>,
    document.body,
  );
}
