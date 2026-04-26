import { SiteShell } from "@/features/navigation/site-shell";
import { DocumentsPage } from "@/features/documents/components/documents-page";

export default function HomePage() {
  return (
    <SiteShell>
      <DocumentsPage variant="public" />
    </SiteShell>
  );
}
