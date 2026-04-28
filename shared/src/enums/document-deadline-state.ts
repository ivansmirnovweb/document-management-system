import { DocumentStatus } from "./document-status";

export enum DocumentDeadlineState {
  NEUTRAL = "NEUTRAL",
  GREEN = "GREEN",
  YELLOW = "YELLOW",
  RED = "RED",
  COMPLETED = "COMPLETED",
}

const AMSTERDAM_DAY_FORMATTER = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Amsterdam",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function amsterdamDayNumber(date: Date): number {
  const parts = AMSTERDAM_DAY_FORMATTER.formatToParts(date);
  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  const day = Number(parts.find((part) => part.type === "day")?.value);

  return Date.UTC(year, month - 1, day);
}

export function getDocumentDeadlineState(
  status: DocumentStatus,
  dueDate: Date,
  completedAt: Date | null,
  now: Date = new Date(),
): DocumentDeadlineState {
  if (
    status === DocumentStatus.DONE ||
    completedAt
  ) {
    return DocumentDeadlineState.COMPLETED;
  }

  const daysUntilDue = Math.round(
    (amsterdamDayNumber(dueDate) - amsterdamDayNumber(now)) / 86_400_000,
  );

  if (daysUntilDue >= 4 && daysUntilDue <= 7) {
    return DocumentDeadlineState.GREEN;
  }

  if (daysUntilDue >= 1 && daysUntilDue <= 3) {
    return DocumentDeadlineState.YELLOW;
  }

  if (daysUntilDue <= 0) {
    return DocumentDeadlineState.RED;
  }

  return DocumentDeadlineState.NEUTRAL;
}
