import { cn } from "@/lib/cn";

type LoadingSpinnerProps = {
  className?: string;
};

export function LoadingSpinner({ className }: LoadingSpinnerProps) {
  return (
    <span
      className={cn(
        "inline-block h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-blue-600",
        className,
      )}
      aria-hidden="true"
    />
  );
}

