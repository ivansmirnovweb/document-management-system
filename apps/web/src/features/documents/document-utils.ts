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
    case DocumentDeadlineState.GREEN:
      return "success";
    case DocumentDeadlineState.YELLOW:
      return "warning";
    case DocumentDeadlineState.RED:
      return "danger";
    case DocumentDeadlineState.NEUTRAL:
    case DocumentDeadlineState.COMPLETED:
      return "neutral";
  }
}

export function deadlineLabel(state: DocumentDeadlineState): string {
  switch (state) {
    case DocumentDeadlineState.GREEN:
      return "7–4 дня";
    case DocumentDeadlineState.YELLOW:
      return "3–1 дня";
    case DocumentDeadlineState.RED:
      return "Сегодня / просрочено";
    case DocumentDeadlineState.NEUTRAL:
      return "Без выделения";
    case DocumentDeadlineState.COMPLETED:
      return "Завершено";
  }
}

export function statusLabel(status: DocumentStatus): string {
  if (status === DocumentStatus.DONE) return "Завершено";
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

  return (
    user.role === UserRole.ROOT ||
    doc.ownerId === user.id ||
    doc.executorId === user.id
  );
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
