"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/auth.provider";
import { getVisibleMainNavigationLinks } from "./navigation-links";
import { UserRole } from "@document-flow/shared";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { cn } from "@/lib/cn";

export function MainNavigation() {
    const pathname = usePathname();
    const auth = useAuth();

    const links = getVisibleMainNavigationLinks(auth.user);

    return (
        <header className="border-b border-zinc-200 bg-white/90 backdrop-blur">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
                        Документооборот
                    </p>
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
                                    active
                                        ? "bg-blue-600 text-white"
                                        : "text-zinc-700 hover:bg-zinc-100",
                                )}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                    {!auth.user ? (
                        <Link
                            href="/login"
                            className={cn(
                                "rounded-xl px-3 py-2 text-sm font-medium transition",
                                pathname === "/login"
                                    ? "bg-blue-600 text-white"
                                    : "text-zinc-700 hover:bg-zinc-100",
                            )}
                        >
                            Войти
                        </Link>
                    ) : null}
                </nav>

                <div className="flex items-center gap-3">
                    {auth.user ? (
                        <>
                            <Badge
                                tone={
                                    auth.user.role === UserRole.ROOT
                                        ? "warning"
                                        : "info"
                                }
                            >
                                {auth.user.role}
                            </Badge>
                            <span className="hidden text-sm text-zinc-600 sm:inline">
                                {auth.user.displayName}
                            </span>
                            <Button
                                variant="secondary"
                                onClick={() => void auth.logout()}
                            >
                                Выйти
                            </Button>
                        </>
                    ) : null}
                </div>
            </div>
        </header>
    );
}
