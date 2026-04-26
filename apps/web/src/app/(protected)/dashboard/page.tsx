import { AuthStatusPanel } from "@/features/auth/components/auth-status-panel";
import { Card, CardDescription, CardTitle } from "@/shared/ui/card";

export default function DashboardPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <Card className="space-y-4">
        <CardTitle>Protected workspace</CardTitle>
        <CardDescription>
          This route is wired for authenticated users and will host the document workflow UI in
          the next phase.
        </CardDescription>
        <ul className="list-disc space-y-2 pl-5 text-sm text-zinc-600">
          <li>App layout and navigation</li>
          <li>TanStack Query session state</li>
          <li>API client with cookie auth</li>
          <li>Protected UI gate</li>
        </ul>
      </Card>

      <AuthStatusPanel />
    </div>
  );
}
