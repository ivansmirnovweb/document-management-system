import { SiteShell } from "@/features/navigation/site-shell";
import { RegisterForm } from "@/features/auth/components/register-form";

export default function RegisterPage() {
  return (
    <SiteShell>
      <div className="py-8">
        <RegisterForm />
      </div>
    </SiteShell>
  );
}
