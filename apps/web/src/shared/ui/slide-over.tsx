"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type SlideOverProps = {
    open: boolean;
    title: string;
    description?: string;
    onClose: () => void;
    children: ReactNode;
    className?: string;
};

export function SlideOver({
    open,
    title,
    description,
    onClose,
    children,
    className,
}: SlideOverProps) {
    const titleId = useId();
    const descriptionId = useId();
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const previousActiveElementRef = useRef<HTMLElement | null>(null);
    const previousOverflowRef = useRef<string | null>(null);
    const onCloseRef = useRef(onClose);

    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        if (!open) {
            return;
        }

        previousActiveElementRef.current =
            document.activeElement instanceof HTMLElement
                ? document.activeElement
                : null;
        previousOverflowRef.current = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const raf = window.requestAnimationFrame(() => {
            closeButtonRef.current?.focus();
        });

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.preventDefault();
                onCloseRef.current();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            window.cancelAnimationFrame(raf);
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = previousOverflowRef.current ?? "";
            previousActiveElementRef.current?.focus();
        };
    }, [open]);

    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50">
            <div
                aria-hidden="true"
                className="absolute inset-0 z-0 cursor-default bg-zinc-950/40"
                onClick={onClose}
            />
            <aside
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={description ? descriptionId : undefined}
                className={cn(
                    "absolute inset-y-0 right-0 z-10 flex h-full w-full max-w-full flex-col border-l border-zinc-200 bg-white shadow-2xl outline-none sm:max-w-[42rem]",
                    className,
                )}
                role="dialog"
                tabIndex={-1}
            >
                <div className="flex items-start justify-between gap-4 border-b border-zinc-200 px-4 py-4 sm:px-6">
                    <div className="min-w-0 space-y-1">
                        <h2
                            id={titleId}
                            className="truncate text-lg font-semibold text-zinc-950"
                        >
                            {title}
                        </h2>
                        {description ? (
                            <p id={descriptionId} className="text-sm text-zinc-600">
                                {description}
                            </p>
                        ) : null}
                    </div>
                    <button
                        ref={closeButtonRef}
                        type="button"
                        aria-label="Закрыть"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
                    {children}
                </div>
            </aside>
        </div>
    );
}
