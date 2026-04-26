import { Inject, Injectable, OnApplicationShutdown } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { Pool } from 'pg';
import { DATABASE_CONNECTION, DATABASE_POOL } from './db.constants';

@Injectable()
export class DbService implements OnApplicationShutdown {
  constructor(
    @Inject(DATABASE_POOL) public readonly pool: Pool,
    @Inject(DATABASE_CONNECTION) public readonly db: NodePgDatabase,
  ) {}

  async ping(): Promise<void> {
    await this.db.execute(sql`select 1 as ok`);
  }

  async onApplicationShutdown(): Promise<void> {
    await this.pool.end();
  }
}
