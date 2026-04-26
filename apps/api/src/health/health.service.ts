import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class HealthService {
  constructor(private readonly dbService: DbService) {}

  async check() {
    try {
      await this.dbService.ping();

      return {
        status: 'ok',
        database: 'up',
      };
    } catch {
      throw new ServiceUnavailableException('Database is unavailable');
    }
  }
}
