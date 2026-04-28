import { z } from "zod";
import {
  createDocumentInputSchema,
  documentDetailsSchema,
  documentListItemSchema,
  updateDocumentInputSchema,
  createResolutionInputSchema,
  updateResolutionInputSchema,
  type CreateDocumentInput,
  type CreateResolutionInput,
  type DocumentDetails,
  type DocumentListItem,
  type DocumentStatus,
  type UpdateDocumentInput,
  type UpdateResolutionInput,
} from "@document-flow/shared";
import { apiNoContent, apiRequest, type ApiRequestOptions } from "@/lib/api";

const documentListSchema = z.array(documentListItemSchema);

function buildQuery(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "") {
      continue;
    }

    search.set(key, String(value));
  }

  const query = search.toString();
  return query.length > 0 ? `?${query}` : "";
}

export const documentsApi = {
  listPublic(options?: ApiRequestOptions): Promise<DocumentListItem[]> {
    return apiRequest("/documents/public", { method: "GET", ...(options ?? {}) }, documentListSchema);
  },

  list(status?: DocumentStatus): Promise<DocumentListItem[]> {
    return apiRequest(
      `/documents${buildQuery({ status })}`,
      { method: "GET" },
      documentListSchema,
    );
  },

  listDeleted(): Promise<DocumentListItem[]> {
    return apiRequest("/documents/deleted", { method: "GET" }, documentListSchema);
  },

  search(params: { q?: string; status?: DocumentStatus }): Promise<DocumentListItem[]> {
    return apiRequest(
      `/documents/search${buildQuery({ q: params.q?.trim(), status: params.status })}`,
      { method: "GET" },
      documentListSchema,
    );
  },

  getPublicById(id: number, options?: ApiRequestOptions): Promise<DocumentDetails> {
    return apiRequest(`/documents/public/${id}`, { method: "GET", ...(options ?? {}) }, documentDetailsSchema);
  },

  getById(id: number): Promise<DocumentDetails> {
    return apiRequest(`/documents/${id}`, { method: "GET" }, documentDetailsSchema);
  },

  create(input: CreateDocumentInput): Promise<DocumentDetails> {
    const payload = createDocumentInputSchema.parse(input);
    return apiRequest("/documents", { method: "POST", body: payload }, documentDetailsSchema);
  },

  update(id: number, input: UpdateDocumentInput): Promise<DocumentDetails> {
    const payload = updateDocumentInputSchema.parse(input);
    return apiRequest(`/documents/${id}`, { method: "PATCH", body: payload }, documentDetailsSchema);
  },

  reassignOwner(id: number, ownerId: number): Promise<DocumentDetails> {
    return apiRequest(`/documents/${id}/reassign`, { method: "PATCH", body: { ownerId } }, documentDetailsSchema);
  },

  restore(id: number): Promise<DocumentDetails> {
    return apiRequest(`/documents/${id}/restore`, { method: "PATCH" }, documentDetailsSchema);
  },

  changeStatus(id: number, status: DocumentStatus): Promise<DocumentDetails> {
    return apiRequest(
      `/documents/${id}/status`,
      { method: "PATCH", body: { status } },
      documentDetailsSchema,
    );
  },

  remove(id: number): Promise<null> {
    return apiRequest(`/documents/${id}`, { method: "DELETE" }, apiNoContent());
  },

  hardDelete(id: number): Promise<null> {
    return apiRequest(`/documents/${id}/hard`, { method: "DELETE" }, apiNoContent());
  },

  createResolution(documentId: number, input: CreateResolutionInput): Promise<DocumentDetails> {
    const payload = createResolutionInputSchema.parse(input);
    return apiRequest(`/documents/${documentId}/resolutions`, { method: "POST", body: payload }, documentDetailsSchema);
  },

  updateResolution(documentId: number, resolutionId: number, input: UpdateResolutionInput): Promise<DocumentDetails> {
    const payload = updateResolutionInputSchema.parse(input);
    return apiRequest(`/documents/${documentId}/resolutions/${resolutionId}`, { method: "PATCH", body: payload }, documentDetailsSchema);
  },

  deleteResolution(documentId: number, resolutionId: number): Promise<DocumentDetails> {
    return apiRequest(`/documents/${documentId}/resolutions/${resolutionId}`, { method: "DELETE" }, documentDetailsSchema);
  },
};
