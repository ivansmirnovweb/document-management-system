"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/auth.provider";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { cn } from "@/lib/cn";

const links = [
  { href: "/", label: "Public docs" },
  { href: "/dashboard", label: "Workspace" },
  { href: "/login", label: "Login" },
];

export function MainNavigation() {
  const pathname = usePathname();
  const auth = useAuth();

  return (
    <header className="border-b border-zinc-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">Document Flow</p>
          <p className="text-lg font-semibold text-zinc-950">Phase 10 documents UI</p>
        </div>

        <nav className="flex flex-wrap items-center gap-2">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm font-medium transition",
                  active ? "bg-zinc-950 text-white" : "text-zinc-600 hover:bg-zinc-100",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {auth.user ? (
            <>
              <Badge tone={auth.user.role === "ROOT" ? "warning" : "info"}>{auth.user.role}</Badge>
              <span className="hidden text-sm text-zinc-600 sm:inline">{auth.user.displayName}</span>
              <Button variant="secondary" onClick={() => void auth.logout()}>
                Sign out
              </Button>
            </>
          ) : (
            <Link
              href="/login"
              className={cn(
                "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition",
                "bg-zinc-950 text-white hover:bg-zinc-800",
              )}
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
