import type { ReactNode } from "react";
import { SiteShell } from "@/features/navigation/site-shell";
import { ProtectedView } from "@/features/navigation/protected-view";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <SiteShell>
      <ProtectedView>{children}</ProtectedView>
    </SiteShell>
  );
}
