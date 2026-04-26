import {
  DocumentDeadlineState,
  DocumentStatus,
  UserRole,
  type DocumentDetails,
  type DocumentListItem,
} from "@document-flow/shared";

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(value));
}

export function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(
    new Date(value),
  );
}

export function deadlineTone(
  state: DocumentDeadlineState,
): "neutral" | "success" | "warning" | "danger" {
  switch (state) {
    case DocumentDeadlineState.ON_TIME:
      return "success";
    case DocumentDeadlineState.DUE_SOON:
      return "warning";
    case DocumentDeadlineState.OVERDUE:
      return "danger";
    case DocumentDeadlineState.COMPLETED:
      return "neutral";
  }
}

export function deadlineLabel(state: DocumentDeadlineState): string {
  switch (state) {
    case DocumentDeadlineState.ON_TIME:
      return "On time";
    case DocumentDeadlineState.DUE_SOON:
      return "Due soon";
    case DocumentDeadlineState.OVERDUE:
      return "Overdue";
    case DocumentDeadlineState.COMPLETED:
      return "Completed";
  }
}

export function statusLabel(status: DocumentStatus): string {
  return status === DocumentStatus.DONE ? "Completed" : "Active";
}

export function canEditDocument(
  user: { id: number; role: UserRole } | null,
  doc: DocumentListItem | DocumentDetails,
): boolean {
  if (!user) {
    return false;
  }

  return user.role === UserRole.ROOT || doc.ownerId === user.id;
}

export function canDeleteDocument(
  user: { id: number; role: UserRole } | null,
  doc: DocumentListItem | DocumentDetails,
): boolean {
  if (!user) {
    return false;
  }

  return user.role === UserRole.ROOT || doc.ownerId === user.id;
}

export function canCompleteDocument(
  user: { id: number; role: UserRole } | null,
  doc: DocumentListItem | DocumentDetails,
): boolean {
  if (!user) {
    return false;
  }

  return doc.status === DocumentStatus.NOT_DONE && (user.role === UserRole.ROOT || doc.ownerId === user.id);
}

export function canReopenDocument(
  user: { id: number; role: UserRole } | null,
  doc: DocumentListItem | DocumentDetails,
): boolean {
  return canCompleteDocument(user, doc) || (user?.role === UserRole.ROOT && doc.status === DocumentStatus.DONE);
}
