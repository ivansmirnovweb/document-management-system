import { Global, Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { AppConfigModule } from '../config/app-config.module';
import { AppConfigService } from '../config/app-config.service';
import { DATABASE_CONNECTION, DATABASE_POOL } from './db.constants';
import { DbService } from './db.service';

@Global()
@Module({
  imports: [AppConfigModule],
  providers: [
    DbService,
    {
      provide: DATABASE_POOL,
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => {
        return new Pool({ connectionString: config.databaseUrl });
      },
    },
    {
      provide: DATABASE_CONNECTION,
      inject: [DATABASE_POOL],
      useFactory: (pool: Pool) => drizzle(pool),
    },
  ],
  exports: [DbService, DATABASE_POOL, DATABASE_CONNECTION],
})
export class DbModule {}
