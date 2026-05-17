import { Controller, Get, Query, Res } from '@nestjs/common';
import { UserRole } from '@document-flow/shared';
import type { Response } from 'express';
import { Roles } from '../common/decorators/roles.decorator';
import { ReportFilterDto } from './dto/report-filter.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('documents/export')
  @Roles(UserRole.ROOT)
  async exportDocuments(
    @Query() filter: ReportFilterDto,
    @Res() response: Response,
  ): Promise<void> {
    const csv = await this.reportsService.exportDocuments(filter);

    response
      .status(200)
      .setHeader('Content-Type', 'text/csv; charset=utf-8')
      .setHeader(
        'Content-Disposition',
        'attachment; filename="documents-report.csv"',
      )
      .send(csv);
  }

  @Get('executors')
  @Roles(UserRole.ROOT)
  getExecutorStatistics(@Query() filter: ReportFilterDto) {
    return this.reportsService.getExecutorStatistics(filter);
  }
}
