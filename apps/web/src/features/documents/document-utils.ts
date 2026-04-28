import {
  DocumentDeadlineState,
  DocumentKind,
  DocumentStatus,
  UserRole,
  type DocumentDetails,
  type DocumentListItem,
} from "@document-flow/shared";

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium" }).format(new Date(value));
}

export function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium", timeStyle: "short" }).format(
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
      return "В срок";
    case DocumentDeadlineState.DUE_SOON:
      return "Скоро срок";
    case DocumentDeadlineState.OVERDUE:
      return "Просрочено";
    case DocumentDeadlineState.COMPLETED:
      return "Завершено";
  }
}

export function statusLabel(status: DocumentStatus): string {
  if (status === DocumentStatus.DONE) return "Завершено";
  if (status === DocumentStatus.WRITTEN_OFF) return "Списано в дело";
  return "Активно";
}

export function kindLabel(kind: DocumentKind): string {
  switch (kind) {
    case "INCOMING":
      return "Входящий";
    case "OUTGOING":
      return "Исходящий";
    case "INTERNAL":
      return "Внутренний";
    default:
      return "Неизвестно";
  }
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

  return doc.ownerId === user.id;
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
  if (!user) {
    return false;
  }

  return user.role === UserRole.ROOT || doc.ownerId === user.id;
}

export function canWriteOffDocument(
  user: { id: number; role: UserRole } | null,
  doc: DocumentListItem | DocumentDetails,
): boolean {
  if (!user) return false;
  return doc.status === DocumentStatus.DONE && (user.role === UserRole.ROOT || doc.ownerId === user.id);
}
