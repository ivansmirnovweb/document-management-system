import Link from "next/link";
import { SiteShell } from "@/features/navigation/site-shell";
import { AuthStatusPanel } from "@/features/auth/components/auth-status-panel";
import { Card, CardDescription, CardTitle } from "@/shared/ui/card";
import { cn } from "@/lib/cn";

export default function HomePage() {
  return (
    <SiteShell>
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card className="space-y-6 bg-zinc-950 text-white">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">Phase 9</p>
            <CardTitle className="text-3xl text-white">Frontend foundation is in place</CardTitle>
            <CardDescription className="max-w-2xl text-zinc-300">
              This shell wires the app layout, query client, API client, auth state, navigation,
              and protected UI patterns before the document screens land.
            </CardDescription>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className={cn(
                "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition",
                "bg-white text-zinc-950 hover:bg-zinc-100",
              )}
            >
              Open dashboard
            </Link>
            <Link
              href="/login"
              className={cn(
                "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition",
                "bg-zinc-800 text-white hover:bg-zinc-700",
              )}
            >
              Sign in
            </Link>
          </div>
        </Card>

        <AuthStatusPanel />
      </div>
    </SiteShell>
  );
}
