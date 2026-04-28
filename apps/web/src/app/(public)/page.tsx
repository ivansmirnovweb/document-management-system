import type { DocumentListItem } from "@document-flow/shared";
import { DocumentsPage } from "@/features/documents/components/documents-page";
import { documentsApi } from "@/features/documents/documents.api";
import { SiteShell } from "@/features/navigation/site-shell";

async function loadPublicInitialData(): Promise<{
  initialPublicList?: DocumentListItem[];
}> {
  try {
    const initialPublicList = await documentsApi.listPublic({ cache: "no-store" });
    return { initialPublicList };
  } catch {
    return {};
  }
}

export default async function HomePage() {
  const { initialPublicList } = await loadPublicInitialData();

  return (
    <SiteShell>
      <DocumentsPage
        variant="public"
        initialPublicList={initialPublicList}
      />
    </SiteShell>
  );
}
