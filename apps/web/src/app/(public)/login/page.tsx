import { SiteShell } from "@/features/navigation/site-shell";
import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <SiteShell>
      <div className="py-8">
        <LoginForm />
      </div>
    </SiteShell>
  );
}
