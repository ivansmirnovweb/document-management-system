import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

type FormFieldProps = {
  label: string;
  children: ReactNode;
  className?: string;
  required?: boolean;
  optional?: boolean;
  helperText?: string;
  error?: string;
};

export function FormField({
  label,
  children,
  className,
  required = false,
  optional = false,
  helperText,
  error,
}: FormFieldProps) {
  return (
    <label className={cn("block space-y-2 text-sm font-medium text-zinc-800", className)}>
      <span className="flex flex-wrap items-center gap-1">
        <span>{label}</span>
        {required ? (
          <span className="text-red-600" aria-hidden="true">*</span>
        ) : optional ? (
          <span className="text-zinc-500">(необязательно)</span>
        ) : null}
      </span>
      {helperText ? <span className="block text-xs font-normal text-zinc-500">{helperText}</span> : null}
      {children}
      {error ? <span className="block text-xs font-normal text-red-600">{error}</span> : null}
    </label>
  );
}
