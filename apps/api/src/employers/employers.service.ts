import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, asc, eq, isNull } from 'drizzle-orm';
import type {
  CreateEmployerInput,
  Employer,
  UpdateEmployerInput,
} from '@document-flow/shared';
import { DbService } from '../db/db.service';
import { employers } from '../db/schema/employers';

@Injectable()
export class EmployersService {
  constructor(private readonly db: DbService) {}

  async list(): Promise<Employer[]> {
    const rows = await this.db.db
      .select()
      .from(employers)
      .where(isNull(employers.deletedAt))
      .orderBy(
        asc(employers.fullName),
        asc(employers.shortName),
        asc(employers.id),
      );

    return rows.map((row) => this.toEmployer(row));
  }

  async getById(id: number): Promise<Employer> {
    const employer = await this.findActiveEmployerById(id);
    if (!employer) {
      throw new NotFoundException('Employer not found');
    }

    return this.toEmployer(employer);
  }

  async create(dto: CreateEmployerInput): Promise<Employer> {
    const [created] = await this.db.db
      .insert(employers)
      .values({
        fullName: dto.fullName,
        shortName: dto.shortName,
        legalAddress: dto.legalAddress,
        actualAddress: dto.actualAddress,
      })
      .returning();

    if (!created) {
      throw new BadRequestException('Failed to create employer');
    }

    return this.toEmployer(created);
  }

  async update(id: number, dto: UpdateEmployerInput): Promise<Employer> {
    const current = await this.findActiveEmployerById(id);
    if (!current) {
      throw new NotFoundException('Employer not found');
    }

    const [updated] = await this.db.db
      .update(employers)
      .set({
        ...(dto.fullName !== undefined ? { fullName: dto.fullName } : {}),
        ...(dto.shortName !== undefined ? { shortName: dto.shortName } : {}),
        ...(dto.legalAddress !== undefined
          ? { legalAddress: dto.legalAddress }
          : {}),
        ...(dto.actualAddress !== undefined
          ? { actualAddress: dto.actualAddress }
          : {}),
        updatedAt: new Date(),
      })
      .where(and(eq(employers.id, id), isNull(employers.deletedAt)))
      .returning();

    if (!updated) {
      throw new NotFoundException('Employer not found');
    }

    return this.toEmployer(updated);
  }

  async remove(id: number): Promise<void> {
    const current = await this.findActiveEmployerById(id);
    if (!current) {
      throw new NotFoundException('Employer not found');
    }

    const now = new Date();
    await this.db.db
      .update(employers)
      .set({
        deletedAt: now,
        updatedAt: now,
      })
      .where(and(eq(employers.id, id), isNull(employers.deletedAt)));
  }

  private async findActiveEmployerById(id: number) {
    const [employer] = await this.db.db
      .select()
      .from(employers)
      .where(and(eq(employers.id, id), isNull(employers.deletedAt)))
      .limit(1);

    return employer ?? null;
  }

  private toEmployer(row: {
    id: number;
    fullName: string;
    shortName: string;
    legalAddress: string;
    actualAddress: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  }): Employer {
    return {
      id: row.id,
      fullName: row.fullName,
      shortName: row.shortName,
      legalAddress: row.legalAddress,
      actualAddress: row.actualAddress,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      deletedAt: row.deletedAt?.toISOString() ?? null,
    };
  }
}
