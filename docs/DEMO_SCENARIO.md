# Demo Scenario

## 1. Start the system

```bash
docker compose -f docker-compose.dev.yml up -d postgres
pnpm --filter api db:seed
pnpm dev
```

## 2. Login

Use the seeded root account:

- username: `root`
- password: `ChangeMe123!`

## 3. Show the main flows

1. Open the active documents list.
2. Filter/search by registration number or title.
3. Open a document and show edit + audit data.
4. Mark a document as completed.
5. Open the completed documents view.
6. Show the root deleted-records page.
7. Restore a soft-deleted document.
8. Show reports and export by date range.
9. Open executor statistics.

## 4. Closing line

The project is ready for submission because installation, startup, seeding, core flows, and final verification are all documented and repeatable.
