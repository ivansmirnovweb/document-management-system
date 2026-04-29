#!/usr/bin/env node
import "dotenv/config";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const apiDir = path.resolve(__dirname, "..");
const drizzleDir = path.join(apiDir, "drizzle");
const journalPath = path.join(drizzleDir, "meta", "_journal.json");

function fatal(message) {
  console.error(`\n[db:migrate] ${message}`);
  process.exit(1);
}

function loadJournal() {
  if (!fs.existsSync(journalPath)) {
    fatal(`Missing journal file: ${journalPath}`);
  }

  const journal = JSON.parse(fs.readFileSync(journalPath, "utf8"));
  const entries = journal?.entries;
  if (!Array.isArray(entries)) {
    fatal(`Invalid journal format in ${journalPath}`);
  }

  const sqlFiles = fs
    .readdirSync(drizzleDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  const fileSet = new Set(sqlFiles);
  const expectedSet = new Set();

  entries.forEach((entry, index) => {
    if (entry.idx !== index) {
      fatal(`Journal idx mismatch at entry ${index}: got ${entry.idx}, expected ${index}`);
    }

    const fileName = `${entry.tag}.sql`;
    expectedSet.add(fileName);
    if (!fileSet.has(fileName)) {
      fatal(`Journal entry points to missing migration file: ${fileName}`);
    }
  });

  const extra = sqlFiles.filter((file) => !expectedSet.has(file));
  if (extra.length > 0) {
    fatal(
      `Found SQL files not present in journal: ${extra.join(", ")}. Run drizzle generate or sync journal before migrate.`,
    );
  }

  return entries.map((entry) => {
    const fileName = `${entry.tag}.sql`;
    const fullPath = path.join(drizzleDir, fileName);
    const sql = fs.readFileSync(fullPath, "utf8");
    return {
      ...entry,
      fileName,
      sql,
      hash: crypto.createHash("sha256").update(sql).digest("hex"),
      statements: sql.split("--> statement-breakpoint"),
    };
  });
}

async function runDiagnostic(entries) {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    fatal("DATABASE_URL is not set. Cannot run diagnostics.");
  }

  const client = new pg.Client({ connectionString: databaseUrl });

  try {
    await client.connect();

    const latest = await client.query(
      `
      select created_at
      from drizzle.__drizzle_migrations
      order by created_at desc
      limit 1
      `,
    ).catch(() => ({ rows: [] }));

    const lastCreatedAt = latest.rows[0]?.created_at ? Number(latest.rows[0].created_at) : 0;
    const pending = entries.filter((entry) => Number(entry.when) > lastCreatedAt);

    if (pending.length === 0) {
      console.error("[db:migrate] No pending migrations found for diagnostic replay.");
      return;
    }

    await client.query("BEGIN");

    for (const migration of pending) {
      for (let i = 0; i < migration.statements.length; i += 1) {
        const statement = migration.statements[i]?.trim();
        if (!statement) continue;

        try {
          await client.query(statement);
        } catch (error) {
          const snippet = statement.slice(0, 500).replace(/\s+/g, " ");
          console.error("\n[db:migrate] Diagnostic failure context:");
          console.error(`  migration: ${migration.fileName}`);
          console.error(`  journalTag: ${migration.tag}`);
          console.error(`  statementIndex: ${i + 1}/${migration.statements.length}`);
          console.error(`  statementSnippet: ${snippet}`);
          console.error(`  error: ${error.message}`);
          throw error;
        }
      }
    }
  } finally {
    try {
      await client.query("ROLLBACK");
    } catch {
      // ignore
    }
    await client.end().catch(() => undefined);
  }
}

async function main() {
  if (!process.env.DATABASE_URL) {
    fatal("DATABASE_URL is not set. Add it to apps/api/.env (see /.env.example) before running db:migrate.");
  }

  const entries = loadJournal();

  const result = spawnSync("pnpm", ["exec", "drizzle-kit", "migrate"], {
    cwd: apiDir,
    stdio: "inherit",
    env: process.env,
  });

  if (result.status === 0) {
    process.exit(0);
  }

  console.error("\n[db:migrate] drizzle-kit migrate failed. Running diagnostic replay...");

  try {
    await runDiagnostic(entries);
  } catch {
    // diagnostics already printed exact context
  }

  process.exit(result.status ?? 1);
}

main().catch((error) => fatal(error?.message ?? String(error)));
