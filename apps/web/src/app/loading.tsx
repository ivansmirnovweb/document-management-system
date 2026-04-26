import { StateCard } from "@/shared/ui/state-card";

export default function Loading() {
  return (
    <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4">
      <StateCard
        title="Loading app"
        description="Preparing the frontend foundation and session state."
        icon="⏳"
      />
    </div>
  );
}
