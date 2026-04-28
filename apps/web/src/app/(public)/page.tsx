import type { DocumentDetails, DocumentListItem } from "@document-flow/shared";
import { DocumentsPage } from "@/features/documents/components/documents-page";
import { documentsApi } from "@/features/documents/documents.api";
import { SiteShell } from "@/features/navigation/site-shell";

async function loadPublicInitialData(): Promise<{
  initialPublicList?: DocumentListItem[];
  initialPublicDocument?: DocumentDetails | null;
}> {
  try {
    const initialPublicList = await documentsApi.listPublic({ cache: "no-store" });
    const firstDocument = initialPublicList[0];

    if (!firstDocument) {
      return { initialPublicList, initialPublicDocument: null };
    }

    const initialPublicDocument = await documentsApi.getPublicById(firstDocument.id, { cache: "no-store" });
    return { initialPublicList, initialPublicDocument };
  } catch {
    return {};
  }
}

export default async function HomePage() {
  const { initialPublicList, initialPublicDocument } = await loadPublicInitialData();

  return (
    <SiteShell>
      <DocumentsPage
        variant="public"
        initialPublicList={initialPublicList}
        initialPublicDocument={initialPublicDocument}
      />
    </SiteShell>
  );
}
