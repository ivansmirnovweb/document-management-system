import { DocumentStatus, getDocumentDeadlineState, DocumentDeadlineState } from '@document-flow/shared';

describe('getDocumentDeadlineState', () => {
  const now = new Date('2026-04-20T12:00:00+02:00');

  it('returns neutral when the deadline is more than 7 days away', () => {
    expect(
      getDocumentDeadlineState(
        DocumentStatus.NOT_DONE,
        new Date('2026-04-28T09:00:00+02:00'),
        null,
        now,
      ),
    ).toBe(DocumentDeadlineState.NEUTRAL);
  });

  it('returns green for 7 to 4 days before the deadline', () => {
    expect(
      getDocumentDeadlineState(
        DocumentStatus.NOT_DONE,
        new Date('2026-04-27T09:00:00+02:00'),
        null,
        now,
      ),
    ).toBe(DocumentDeadlineState.GREEN);

    expect(
      getDocumentDeadlineState(
        DocumentStatus.NOT_DONE,
        new Date('2026-04-24T09:00:00+02:00'),
        null,
        now,
      ),
    ).toBe(DocumentDeadlineState.GREEN);
  });

  it('returns yellow for 3 to 1 days before the deadline', () => {
    expect(
      getDocumentDeadlineState(
        DocumentStatus.NOT_DONE,
        new Date('2026-04-23T09:00:00+02:00'),
        null,
        now,
      ),
    ).toBe(DocumentDeadlineState.YELLOW);

    expect(
      getDocumentDeadlineState(
        DocumentStatus.NOT_DONE,
        new Date('2026-04-21T09:00:00+02:00'),
        null,
        now,
      ),
    ).toBe(DocumentDeadlineState.YELLOW);
  });

  it('returns red on the deadline day and after it', () => {
    expect(
      getDocumentDeadlineState(
        DocumentStatus.NOT_DONE,
        new Date('2026-04-20T09:00:00+02:00'),
        null,
        now,
      ),
    ).toBe(DocumentDeadlineState.RED);

    expect(
      getDocumentDeadlineState(
        DocumentStatus.NOT_DONE,
        new Date('2026-04-19T09:00:00+02:00'),
        null,
        now,
      ),
    ).toBe(DocumentDeadlineState.RED);
  });

  it('returns completed for done documents regardless of due date', () => {
    expect(
      getDocumentDeadlineState(
        DocumentStatus.DONE,
        new Date('2026-04-19T09:00:00+02:00'),
        new Date('2026-04-19T10:00:00+02:00'),
        now,
      ),
    ).toBe(DocumentDeadlineState.COMPLETED);
  });
});
