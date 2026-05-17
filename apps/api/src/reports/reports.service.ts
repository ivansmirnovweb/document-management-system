import { BadRequestException, Injectable } from '@nestjs/common';
import { and, asc, eq, gte, inArray, isNull, lte } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import {
  DocumentStatus,
  type ExecutorStatistics,
  type ReportFilterInput,
  UserRole,
} from '@document-flow/shared';
import { DbService } from '../db/db.service';
import { documents } from '../db/schema/documents';
import { employers } from '../db/schema/employers';
import { users } from '../db/schema/users';
import type { ReportFilterDto } from './dto/report-filter.dto';

const reportOwnerUsers = alias(users, 'report_owner_users');
const reportExecutorUsers = alias(users, 'report_executor_users');

@Injectable()
export class ReportsService {
  constructor(private readonly db: DbService) {}

  async exportDocuments(filter: ReportFilterDto): Promise<string> {
    const rows = await this.findReportRows(filter);
    return this.toCsv(rows);
  }

  async getExecutorStatistics(
    filter: ReportFilterDto,
  ): Promise<ExecutorStatistics[]> {
    const rows = await this.findReportRows(filter);
    const byExecutor = new Map<number, ExecutorStatistics>();
    const now = Date.now();

    for (const row of rows) {
      const status = row.status as DocumentStatus;
      const executor = {
        id: row.executorIdFromJoin,
        username: row.executorUsername,
        displayName: row.executorDisplayName,
        unit: row.executorUnit,
        role: row.executorRole as UserRole,
        passwordChangedAt: row.executorPasswordChangedAt?.toISOString() ?? null,
        createdAt: row.executorCreatedAt.toISOString(),
        updatedAt: row.executorUpdatedAt.toISOString(),
      };

      if (!byExecutor.has(row.executorIdFromJoin)) {
        byExecutor.set(row.executorIdFromJoin, {
          executor,
          totalDocuments: 0,
          completedOnTime: 0,
          completedLate: 0,
          overdueCount: 0,
          overduePercentage: 0,
        });
      }

      const target = byExecutor.get(row.executorIdFromJoin)!;
      target.totalDocuments += 1;

      if (status === DocumentStatus.DONE && row.completedAt) {
        if (row.completedAt.getTime() <= row.dueDate.getTime()) {
          target.completedOnTime += 1;
        } else {
          target.completedLate += 1;
        }
      }

      if (status === DocumentStatus.NOT_DONE && row.dueDate.getTime() < now) {
        target.overdueCount += 1;
      }
    }

    return [...byExecutor.values()].map((item) => ({
      ...item,
      overduePercentage:
        item.totalDocuments === 0
          ? 0
          : Number(
              (
                ((item.completedLate + item.overdueCount) /
                  item.totalDocuments) *
                100
              ).toFixed(2),
            ),
    }));
  }

  private async findReportRows(filter: ReportFilterDto) {
    const { from, to } = this.normalizeDateRange(filter);
    const conditions = [
      gte(documents.dueDate, from),
      lte(documents.dueDate, to),
    ];

    if (!filter.includeDeleted) {
      conditions.push(isNull(documents.deletedAt));
    }
    if (filter.executorId !== undefined) {
      conditions.push(eq(documents.executorId, filter.executorId));
    }
    if (filter.ownerId !== undefined) {
      conditions.push(eq(documents.ownerId, filter.ownerId));
    }
    if (filter.employerId !== undefined) {
      conditions.push(eq(documents.employerId, filter.employerId));
    }
    if (filter.status !== undefined) {
      conditions.push(eq(documents.status, filter.status));
    }
    if (filter.selectedIds !== undefined) {
      if (filter.selectedIds.length === 0) {
        throw new BadRequestException('selectedIds must not be empty');
      }
      conditions.push(inArray(documents.id, filter.selectedIds));
    }

    return this.db.db
      .select({
        id: documents.id,
        registrationNumber: documents.registrationNumber,
        registrationDate: documents.registrationDate,
        title: documents.title,
        about1: documents.about1,
        description: documents.description,
        incomingNumber: documents.incomingNumber,
        outgoingNumber: documents.outgoingNumber,
        employerId: documents.employerId,
        ownerId: documents.ownerId,
        executorId: documents.executorId,
        status: documents.status,
        dueDate: documents.dueDate,
        completedAt: documents.completedAt,
        isControl: documents.isControl,
        deletedAt: documents.deletedAt,
        createdAt: documents.createdAt,
        updatedAt: documents.updatedAt,
        employerIdFromJoin: employers.id,
        employerFullName: employers.fullName,
        employerShortName: employers.shortName,
        employerLegalAddress: employers.legalAddress,
        employerActualAddress: employers.actualAddress,
        employerCreatedAt: employers.createdAt,
        employerUpdatedAt: employers.updatedAt,
        employerDeletedAt: employers.deletedAt,
        ownerIdFromJoin: reportOwnerUsers.id,
        ownerUsername: reportOwnerUsers.username,
        ownerDisplayName: reportOwnerUsers.displayName,
        ownerRole: reportOwnerUsers.role,
        ownerPasswordChangedAt: reportOwnerUsers.passwordChangedAt,
        ownerCreatedAt: reportOwnerUsers.createdAt,
        ownerUpdatedAt: reportOwnerUsers.updatedAt,
        executorIdFromJoin: reportExecutorUsers.id,
        executorUsername: reportExecutorUsers.username,
        executorDisplayName: reportExecutorUsers.displayName,
        executorUnit: reportExecutorUsers.unit,
        executorRole: reportExecutorUsers.role,
        executorPasswordChangedAt: reportExecutorUsers.passwordChangedAt,
        executorCreatedAt: reportExecutorUsers.createdAt,
        executorUpdatedAt: reportExecutorUsers.updatedAt,
      })
      .from(documents)
      .leftJoin(employers, eq(documents.employerId, employers.id))
      .innerJoin(reportOwnerUsers, eq(documents.ownerId, reportOwnerUsers.id))
      .innerJoin(
        reportExecutorUsers,
        eq(documents.executorId, reportExecutorUsers.id),
      )
      .where(and(...conditions))
      .orderBy(
        asc(reportExecutorUsers.displayName),
        asc(documents.dueDate),
        asc(documents.registrationDate),
        asc(documents.id),
      );
  }

  private normalizeDateRange(filter: ReportFilterInput) {
    const from = new Date(filter.dateFrom);
    from.setHours(0, 0, 0, 0);

    const to = new Date(filter.dateTo);
    to.setHours(23, 59, 59, 999);

    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
      throw new BadRequestException('Invalid report date range');
    }

    if (from.getTime() > to.getTime()) {
      throw new BadRequestException(
        'Report start date must be before end date',
      );
    }

    return { from, to };
  }

  private toCsv(
    rows: Awaited<ReturnType<ReportsService['findReportRows']>>,
  ): string {
    const headers = [
      '№ п/п',
      'Рег. номер',
      'Дата',
      'Краткое содержание',
      'Владелец',
      'Исполнитель',
      'Контрагент',
      'Срок исполнения',
      'Статус',
      'Приоритет',
      'Осталось дней',
    ];

    const statusLabel = (status: DocumentStatus): string => {
      if (status === DocumentStatus.NOT_DONE) return 'НЕ ВЫПОЛНЕНО';
      if (status === DocumentStatus.DONE) return 'ВЫПОЛНЕНО';
      return 'ВЫПОЛНЕНО';
    };

    const escapeCell = (value: string | number | boolean | null) => {
      const normalized = value === null ? '' : String(value);
      if (/[",\n;]/.test(normalized)) {
        return `"${normalized.replace(/"/g, '""')}"`;
      }
      return normalized;
    };

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const lines = rows.map((row, index) => {
      const due = new Date(row.dueDate);
      due.setHours(0, 0, 0, 0);
      const daysLeft = Math.ceil(
        (due.getTime() - startOfToday.getTime()) / (24 * 60 * 60 * 1000),
      );

      return [
        index + 1,
        row.registrationNumber,
        row.registrationDate.toISOString().slice(0, 10),
        row.about1 ?? row.title,
        row.ownerDisplayName || row.ownerUsername,
        row.executorDisplayName,
        row.employerShortName || row.employerFullName || '—',
        row.dueDate.toISOString().slice(0, 10),
        statusLabel(row.status as DocumentStatus),
        row.isControl ? 'НА КОНТРОЛЕ' : 'ОБЫЧНЫЙ',
        daysLeft,
      ]
        .map(escapeCell)
        .join(';');
    });

    return [headers.join(';'), ...lines].join('\n');
  }
}
